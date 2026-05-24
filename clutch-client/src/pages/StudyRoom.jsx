import React, { useState, useEffect, useRef } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import socket from "../socket/socket";

const StudyRoom = () => {
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


  useEffect(() => {
    if (!excalidrawAPI) return; // Wait until Excalidraw is fully loaded
    const handleExcalidrawUpdate = (elements) => {
      //Mark that this update came from the network
      isUpdatingFromSocket.current = true;
      //Actually draw it on the screen
      //...
      //..
      ///...
      excalidrawAPI.updateScene({ elements });
    };

    socket.on("excalidraw-update", handleExcalidrawUpdate);

    return () => {
      socket.off("excalidraw-update", handleExcalidrawUpdate);
    };
  }, [excalidrawAPI]); 

  //................
  //.
  //.........


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
  //
  useEffect(() => {
    //..
    //....
    //......Look at the web URL and grab whatever is after "?room="
    //..
    //....
    //..
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get("room") || "room1"; //Fallback to room1 just in case
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

    // Get the dynamic room ID here too
    const searchParams = new URLSearchParams(window.location.search);
    const roomId = searchParams.get("room") || "room1";

    // Emit the message to the backend
    socket.emit("send-message", { roomId: roomId, ...newMessage });
    setInput("");
  };
  //...........
  // const handleEndCall = (e) => {
  //   localStorage.removeItem();
  //   target.e.
  // }


  return (
    //.......
    <div className="min-h-screen bg-[#121212] text-white p-4 font-sans flex flex-col gap-4">

      <div className="flex justify-between items-center bg-[#1e1e1e] p-4 rounded-xl border border-neutral-800 shadow-md">
        <div className="flex items-center gap-3">
          <span className="h-3.5 w-3.5 bg-green-500 rounded-full animate-pulse"></span>
          <div>
            <h1 className="text-lg font-bold text-gray-100">DBMS session with Ayush</h1>
            <p className="text-xs text-neutral-400">42 mins • CN ↔ DBMS swap</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {}} className="cursor-pointer  bg-purple-600 text-white text-xs px-6 py-3 rounded-full font-semibold shadow-sm">End-Call</button>

          <button className="p-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </button>
          <button className="p-2.5 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-[#e8ebfa] text-[#3f51b5] p-4 rounded-xl border border-[#d2d9f7] shadow-sm flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#3f51b5]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813ZM18 10.5l-.5-3.5-3.5-.5.5-3.5 3.5.5.5 3.5-3.5.5ZM10.5 6 10 3.5 7.5 3 10 2.5 10.5 0 11 2.5 13.5 3 11 3.5 10.5 6Z" />
          </svg>
          AI session plan
        </div>
        <p className="text-sm font-medium leading-relaxed">
          Cover today: Normalization (1NF → BCNF), Indexing types, ACID. Ayush is weak on joins — start there first.
        </p>
      </div>

      <div className="bg-[#1e1e1e] rounded-xl border border-neutral-800 shadow-md p-4 flex flex-col gap-4">
        <div className="h-[800px] w-full rounded-lg border border-neutral-800/80 overflow-hidden relative">
          <Excalidraw 
            theme="dark" 
            excalidrawAPI={(api) => setExcalidraw(api)}
            onChange={handleExcalidrawChange}
          />
        </div>
      </div>

      <div className="flex justify-between items-center bg-[#1e1e1e] p-3 rounded-xl border border-neutral-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/10 text-purple-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-200">Ayush is speaking...</h3>

          </div>
        </div>
        <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-1 rounded">42:18</span>
      </div>
      {/* from here the chatbox or convo part */}
      <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-neutral-800 shadow-md p-4 flex flex-col justify-between gap-4 min-h-[300px]">
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[250px] pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[85%] ${msg.isMe ? "self-end" : "self-start"
                }`}
            >
              {!msg.isMe && (
                <span className="text-[11px] text-neutral-500 font-semibold px-1">
                  {msg.sender}
                </span>
              )}
              <div
                className={`p-3 text-sm shadow-sm leading-relaxed ${msg.isMe
                  ? "bg-[#7c4dff] text-white rounded-2xl rounded-tr-none"
                  : "bg-[#292929] text-gray-100 rounded-2xl rounded-tl-none border border-neutral-800"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={msfEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 bg-[#292929] rounded-lg p-2 border border-neutral-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-neutral-500 focus:outline-none px-2"
          />
          <button type="submit" className="p-2 bg-[#7c4dff] hover:bg-[#6c3df0] text-white rounded-md transition flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudyRoom