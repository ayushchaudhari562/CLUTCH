import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "@excalidraw/excalidraw/index.css";

import { useWebRTC } from '../hooks/useWebRTC';
import Whiteboard from '../components/studyroom/Whiteboard';
import ChatPanel from '../components/studyroom/ChatPanel';
import VideoPanel from '../components/studyroom/VideoPanel';
import IncomingCallModal from '../components/studyroom/IncomingCallModal';

const StudyRoom = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get("room") || "room1";

  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
// const {
//   localStora
// }
  const {
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    acceptCall,
    rejectCall
  } = useWebRTC(roomId);

  //this is for dragging ...
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      //Calculate width from the right side (minus padding of 12px)
      const newWidth = window.innerWidth - e.clientX - 12;
      //Restrict minimum and maximum width
      if (newWidth > 250 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };
    //....
    //....
    //....

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

  const handleEndCall = (e) => {
    e.preventDefault();
    localStorage.removeItem("studyroom_chat");
    navigate("/");
  };

  return (
    <div className="h-screen bg-[#090A0F] text-white p-3 font-sans flex flex-col gap-3 overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[#0E1115] px-5 py-3 rounded-2xl border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="h-2.5 w-2.5 bg-[#10B981] rounded-full animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">DBMS session with Ayush</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">42 mins • CN ↔ DBMS swap</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleAudio} className={`p-2 rounded-full transition cursor-pointer border ${isAudioEnabled ? "bg-emerald-500/10 border-emerald-500/20 text-[#10B981]" : "bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              {isAudioEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Zm-5.46-3.83-8.85-8.85m14.31 14.31-8.85-8.85m14.31 14.31L1.5 1.5" />
              )}
            </svg>
          </button>
          <button onClick={toggleVideo} className={`p-2 rounded-full transition cursor-pointer border ${isVideoEnabled ? "bg-emerald-500/10 border-emerald-500/20 text-[#10B981]" : "bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              {isVideoEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Zm-3.03-9.5-12.5 12.5m12.5-12.5L1.5 1.5" />
              )}
            </svg>
          </button>
          <button onClick={handleEndCall} className="ml-2 bg-[#F87171] hover:bg-[#EF4444] text-white text-xs px-5 py-2 rounded-full font-medium transition cursor-pointer border-0 shadow-none">End Call</button>
        </div>
      </div>

      <IncomingCallModal 
        incomingCall={incomingCall} 
        acceptCall={acceptCall} 
        rejectCall={rejectCall} 
      />

      {/* Main Content Area */}
      <div className="flex gap-3 flex-1 overflow-hidden">
        {/* Left Panel: Whiteboard */}
        <Whiteboard roomId={roomId} />

        {/* Resizer Handle */}
        <div
          className="w-1.5 cursor-col-resize hover:bg-emerald-500/50 bg-white/5 transition-colors duration-150 rounded shrink-0 flex items-center justify-center group"
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
          }}
        >
          <div className="h-8 w-0.5 bg-[#6B7280] group-hover:bg-[#10B981] rounded-full transition-colors"></div>
        </div>

        {/* Right Panel: Video & Chat */}
        <div style={{ width: `${sidebarWidth}px` }} className="flex flex-col gap-3 shrink-0 transition-[width] duration-75 ease-out">
          
          <VideoPanel 
            remoteStream={remoteStream} 
            localStream={localStream} 
            remoteVideoRef={remoteVideoRef} 
            localVideoRef={localVideoRef} 
          />

          <ChatPanel roomId={roomId} />

        </div>
      </div>
    </div>
  );
}

export default StudyRoom;