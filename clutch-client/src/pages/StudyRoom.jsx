import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import socket from "../socket/socket";

const StudyRoom = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("studyroom_chat");
    return saved ? JSON.parse(saved) : [{ id: 1, sender: "System", text: "Welcome to the study room!", isMe: false }];
  });
  const [input, setInput] = useState("");
  const msfEndRef = useRef(null);
  const [showPopup, setShowPopup] = useState(true);
  const [excalidrawAPI,setExcalidraw] = useState(null);
  const isUpdatingFromSocket = useRef(false);
  const debounceTimer = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      // Calculate width from the right side (minus padding of 12px)
      const newWidth = window.innerWidth - e.clientX - 12;
      // Restrict minimum and maximum width
      if (newWidth > 250 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Re-enable text selection
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  useEffect(() => {
    if (!excalidrawAPI) return; // Wait until Excalidraw is fully loaded
    
    const handleExcalidrawUpdate = (elements) => {
      isUpdatingFromSocket.current = true; // Mark update from network
      excalidrawAPI.updateScene({ elements });
    };

    socket.on("excalidraw-update", handleExcalidrawUpdate);

    return () => {
      socket.off("excalidraw-update", handleExcalidrawUpdate);
    };
  }, [excalidrawAPI]); 
  const handleExcalidrawChange = (elements) => {
    // Stop the infinite loop! If the network just updated us, don't send it back.
    if (isUpdatingFromSocket.current) {
      isUpdatingFromSocket.current = false;
      return;
    }
    
    // Smooth Debouncing (Wait 30ms before sending to avoid crashing the server)
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const roomId = searchParams.get("room") || "room1";
      
      // Emit to the backend!
      socket.emit("excalidraw-update", { roomId, elements });
    }, 30); 
  };


//.....
//..
//....

  useEffect(() => {
    msfEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("studyroom_chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get("room") || "room1"; // Fallback to room1

    //.........
    // Join that specific dynamic room
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
    }; {/*will use this to off entryy when its not receiving */ }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "User-" + (socket.id ? socket.id.substring(0, 4) : "0000"),
      senderId: socket.id,
      text: input,
    };

    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get("room") || "room1";

    // Emit the message to the backend
    socket.emit("send-message", { roomId: roomId, ...newMessage });
    setInput("");
  };

  // End call, clear chat history, and redirect
  const handleEndCall = (e) => {
    e.preventDefault();
    localStorage.removeItem("studyroom_chat"); 
    navigate("/"); 
  };


  return (
    <div className="h-screen bg-[#0a0a0a] text-white p-3 font-sans flex flex-col gap-3 overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#141414] px-5 py-3 rounded-xl border border-neutral-800 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-100">DBMS session with Ayush</h1>
            <p className="text-xs text-neutral-400 mt-0.5">42 mins • CN ↔ DBMS swap</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>
          </button>
          <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
          </button>
          <button onClick={handleEndCall} className="ml-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs px-5 py-2 rounded-lg font-semibold transition">End Call</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-3 flex-1 overflow-hidden">
        {/* Left Panel: Whiteboard */}
        <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 shadow-sm relative overflow-hidden flex flex-col">
          <Excalidraw 
            theme="dark" 
            excalidrawAPI={(api) => setExcalidraw(api)}
            onChange={handleExcalidrawChange}
          />
        </div>

        {/* Resizer Handle */}
        <div 
          className="w-1.5 cursor-col-resize hover:bg-purple-500/50 bg-neutral-800/30 transition-colors duration-150 rounded shrink-0 flex items-center justify-center group"
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
          }}
        >
          <div className="h-8 w-0.5 bg-neutral-500/50 group-hover:bg-white rounded-full transition-colors"></div>
        </div>

        <div style={{ width: `${sidebarWidth}px` }} className="flex flex-col gap-3 shrink-0 transition-[width] duration-75 ease-out">
          <div className="flex gap-2 h-[180px] shrink-0">
            <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 relative flex items-center justify-center overflow-hidden">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center text-lg font-bold border border-purple-500/20">A</div>
               </div>
               <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                 <span className="text-[10px] font-medium text-gray-300">Ayush</span>
                 <div className="flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-400 animate-pulse"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.85v2.65h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.25v-2.65a6.751 6.751 0 0 1-6-6.85v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>
                 </div>
               </div>
            </div>
            <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 relative flex items-center justify-center overflow-hidden">
               <div className="w-8 h-8 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center text-xs font-semibold border border-neutral-700">You</div>
               <div className="absolute bottom-2 left-2 right-2 flex justify-center items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-gray-400">
                 Cam Off
               </div>
            </div>
          </div>
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
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message room..." className="flex-1 bg-neutral-800/50 rounded-lg text-[13px] text-gray-200 placeholder-neutral-500 focus:outline-none px-3 py-2 border border-neutral-800 focus:border-neutral-700 transition" />
              <button type="submit" className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyRoom