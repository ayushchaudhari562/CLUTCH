import React, { useState, useEffect, useRef } from 'react';
import socket from '../../socket/socket';

const ChatPanel = ({ roomId }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("studyroom_chat");
    return saved ? JSON.parse(saved) : [{ id: 1, sender: "System", text: "Welcome to the study room!", isMe: false }];
  });
  const [input, setInput] = useState("");
  const msfEndRef = useRef(null);

  useEffect(() => {
    msfEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("studyroom_chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    const messageHandler = (data) => {
      if (typeof data === "string") {
        setMessages((prev) => [...prev, { id: Date.now(), sender: "System", text: data, isMe: false }]);
      } else {
        const isMyMessage = data.senderId === socket.id;
        setMessages((prev) => [...prev, { ...data, isMe: isMyMessage }]);
      }
    };

    socket.on("receive-message", messageHandler);

    return () => {
      socket.off("receive-message", messageHandler);
    };
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "User-" + (socket.id ? socket.id.substring(0, 4) : "0000"),
      senderId: socket.id,
      text: input,
    };

    socket.emit("send-message", { roomId: roomId, ...newMessage });
    setInput("");
  };

  return (
    <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 flex flex-col overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${msg.isMe ? "self-end" : "self-start"}`}>
            {!msg.isMe && <span className="text-[10px] text-neutral-500 font-medium px-1">{msg.sender}</span>}
            <div className={`px-3 py-2 text-[13px] shadow-sm leading-relaxed ${msg.isMe ? "bg-purple-600/90 text-white rounded-2xl rounded-tr-sm" : "bg-neutral-800 text-gray-200 rounded-2xl rounded-tl-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={msfEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-800 bg-[#141414] flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Message room..." 
          className="flex-1 bg-neutral-800/50 rounded-lg text-[13px] text-gray-200 placeholder-neutral-500 focus:outline-none px-3 py-2 border border-neutral-800 focus:border-neutral-700 transition" 
        />
        <button type="submit" className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
