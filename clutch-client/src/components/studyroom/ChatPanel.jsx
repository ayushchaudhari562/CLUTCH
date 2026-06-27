import React, { useState, useEffect, useRef, useCallback } from "react";
import socket from "../../socket/socket";

// MessageBubble Component
const MessageBubble = React.memo(({ msg }) => (
  <div
    className={`flex flex-col gap-1 max-w-[85%] ${msg.isMe ? "self-end" : "self-start"
      }`}
  >
    {!msg.isMe && (
      <span className="text-[10px] text-slate-400 font-bold px-2.5">
        {msg.sender}
      </span>
    )}
    <div
      className={`px-3.5 py-2 text-xs leading-relaxed shadow-sm ${msg.isMe
          ? "bg-google-blue/10 text-white rounded-2xl rounded-tr-sm border border-google-blue/20"
          : "bg-surface-elevated text-white rounded-2xl rounded-tl-sm border border-white/5"
        }`}
    >
      {msg.text}
    </div>
  </div>
));

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
  const socketIdRef = useRef(socket.id);

  useEffect(() => {
    const onConnect = () => {
      socketIdRef.current = socket.id;
      if (roomId) {
        socket.emit("join-room", roomId);
      }
    };
    socket.on("connect", onConnect);
    if (socket.connected) {
      socketIdRef.current = socket.id;
    }
    return () => socket.off("connect", onConnect);
  }, [roomId]);

  useEffect(() => {
    msfEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("studyroom_chat", JSON.stringify(messages));
    }, 500);
    return () => clearTimeout(timer);
  }, [messages]);

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
          return [...prev, newMsg].slice(-100);
        });
      } else {
        const isMyMessage = data.senderId === socketIdRef.current;
        setMessages((prev) => {
          return [...prev, { ...data, isMe: isMyMessage }].slice(-100);
        });
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
    };
  }, [roomId]);

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const newMessage = {
        id: Date.now(),
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
    <div className="flex-1 bg-surface rounded-[16px] border border-white/5 flex flex-col overflow-hidden min-h-0 shadow-md">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={msfEndRef} />
      </div>

      {/* Input controls form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-white/5 bg-surface flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message room..."
          className="flex-1 bg-background rounded-full text-xs text-white placeholder-slate-500 focus:outline-none px-4.5 py-2.5 border border-white/5 focus:border-google-blue transition-colors"
        />
        <button
          type="submit"
          className="p-2.5 bg-google-blue hover:bg-google-blue/90 text-white rounded-full transition-colors flex items-center justify-center shrink-0 border-0 shadow-sm cursor-pointer"
          title="Send message"
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