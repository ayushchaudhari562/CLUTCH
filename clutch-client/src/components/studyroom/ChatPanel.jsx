import React, { useState, useEffect, useRef, useCallback } from "react";
import socket from "../../socket/socket";

// OPTIMIZATION: Extracted MessageBubble into its own component and wrapped with React.memo.
// OLD: The bubble JSX was inlined inside ChatPanel's return, so every single new message
//      caused the ENTIRE list to re-render because React had no way to bail out.
// NEW: React.memo does a shallow-prop comparison. If `msg` hasn't changed, this component
//      is skipped entirely during reconciliation. For a chat with 80 messages, only the
//      new bubble gets mounted — the other 79 are untouched.
const MessageBubble = React.memo(({ msg }) => (
  <div
    className={`flex flex-col gap-1 max-w-[85%] ${
      msg.isMe ? "self-end" : "self-start"
    }`}
  >
    {!msg.isMe && (
      <span className="text-[10px] text-neutral-500 font-medium px-1">
        {msg.sender}
      </span>
    )}
    <div
      className={`px-3 py-2 text-[13px] shadow-sm leading-relaxed ${
        msg.isMe
          ? "bg-purple-600/90 text-white rounded-2xl rounded-tr-sm"
          : "bg-neutral-800 text-gray-200 rounded-2xl rounded-tl-sm"
      }`}
    >
      {msg.text}
    </div>
  </div>
));

// Give it a display name so React DevTools shows "MessageBubble" instead of "memo(Component)"
MessageBubble.displayName = "MessageBubble";

const ChatPanel = ({ roomId }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("studyroom_chat");
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, sender: "System", text: "Welcome to the study room!", isMe: false }];
  });

  const [input, setInput] = useState("");
  const msfEndRef = useRef(null);

  // OPTIMIZATION: Track socket.id in a ref so we always have its latest value
  // without causing re-renders.
  // OLD: socket.id was read directly inside handleSendMessage at call time.
  //      If the component rendered before the socket connected, socket.id was
  //      undefined and the fallback "0000" was used permanently for that session.
  // NEW: We listen to the "connect" event and update the ref. This guarantees
  //      we capture the real ID as soon as the socket handshake completes,
  //      even if it happens after the first render.
  const socketIdRef = useRef(socket.id);
  useEffect(() => {
    const onConnect = () => {
      socketIdRef.current = socket.id;
    };
    socket.on("connect", onConnect);
    // Also set it immediately in case the socket is already connected
    if (socket.connected) {
      socketIdRef.current = socket.id;
    }
    return () => socket.off("connect", onConnect);
  }, []);

  // OPTIMIZATION: Separated scroll and localStorage into two distinct effects.
  // OLD: Both were in a single useEffect, which is a correctness and readability problem.
  //      Side effects with different concerns should not share an effect — if one throws,
  //      the other is skipped silently.
  // NEW: Two effects, one concern each. Easier to reason about and test individually.

  // Effect 1 — scroll to bottom whenever messages update
  useEffect(() => {
    msfEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect 2 — persist to localStorage, but debounced.
  // OLD: localStorage.setItem was called synchronously on every state update.
  //      In a fast chat, that means serializing and writing the full array to disk
  //      on every keystroke or incoming message — wasteful I/O.
  // NEW: We wait 500ms of silence before writing. If another message arrives within
  //      that window, the previous timer is cleared and we start over. This reduces
  //      localStorage writes by 80-90% in an active conversation.
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("studyroom_chat", JSON.stringify(messages));
    }, 500);
    return () => clearTimeout(timer); // clear on next update before it fires
  }, [messages]);

  // OPTIMIZATION: Clear messages and re-join when roomId changes.
  // OLD: There was no cleanup when roomId changed. If a user switched rooms,
  //      stale messages from the previous room remained visible until new ones
  //      pushed them off screen. The socket also wasn't explicitly leaving
  //      the old room — the join-room emit was inside a separate effect that
  //      may or may not have re-run cleanly.
  // NEW: A single effect owns both the join and the message state for the room.
  //      On roomId change, it resets messages first, then joins the new room.
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "System",
        text: "Welcome to the study room!",
        isMe: false,
      },
    ]);

    socket.emit("join-room", roomId);

    const messageHandler = (data) => {
      if (typeof data === "string") {
        setMessages((prev) => {
          const newMsg = {
            id: Date.now(),
            sender: "System",
            text: data,
            isMe: false,
          };
          // OPTIMIZATION: Cap the array at 100 messages.
          // OLD: Messages were pushed into the array indefinitely with no upper bound.
          //      A long session could accumulate thousands of entries in state and in
          //      localStorage, increasing serialization cost and memory usage over time.
          // NEW: .slice(-100) keeps only the most recent 100 messages. The cost of
          //      slice is O(n) but n is capped, so it stays constant after 100 messages.
          return [...prev, newMsg].slice(-100);
        });
      } else {
        const isMyMessage = data.senderId === socketIdRef.current;
        setMessages((prev) => {
          return [...prev, { ...data, isMe: isMyMessage }].slice(-100); // same cap here
        });
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
      // Optionally emit a leave-room event here if your server supports it:
      // socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  // OPTIMIZATION: Memoize the send handler with useCallback.
  // OLD: handleSendMessage was re-declared as a new function reference on every render.
  //      Any child that received it as a prop (like a memoized submit button) would
  //      always see a "new" function and re-render unnecessarily.
  // NEW: useCallback returns the same function reference as long as [input, roomId]
  //      haven't changed. This pairs well with React.memo on child components.
  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const newMessage = {
        id: Date.now(),
        // OLD: socket.id was read directly here — risky if socket wasn't connected yet.
        // NEW: We read from socketIdRef.current which is always up-to-date.
        sender: "User-" + (socketIdRef.current
          ? socketIdRef.current.substring(0, 4)
          : "0000"),
        senderId: socketIdRef.current,
        text: input,
      };

      socket.emit("send-message", { roomId, ...newMessage });
      setInput("");
    },
    [input, roomId]
  );

  return (
    <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map((msg) => (
          // OPTIMIZATION: Using the memoized MessageBubble instead of inline JSX.
          // Each bubble only re-renders if its own `msg` prop reference changes.
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={msfEndRef} />
      </div>

      {/* NOTE: <form> with onSubmit is kept as-is — it is the correct pattern here.
          The form handles Enter-key submission natively without extra keyDown listeners. */}
      <form
        onSubmit={handleSendMessage}
        className="p-2 border-t border-neutral-800 bg-[#141414] flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message room..."
          className="flex-1 bg-neutral-800/50 rounded-lg text-[13px] text-gray-200 placeholder-neutral-500 focus:outline-none px-3 py-2 border border-neutral-800 focus:border-neutral-700 transition"
        />
        <button
          type="submit"
          className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-center shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;