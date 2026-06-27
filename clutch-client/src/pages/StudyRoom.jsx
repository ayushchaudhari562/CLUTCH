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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - e.clientX - 12;
      if (newWidth > 250 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
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
    <div className="h-screen bg-background text-white p-4 font-sans flex flex-col gap-4 overflow-hidden pt-4">

      {/* Top Header Session Bar */}
      <div className="flex justify-between items-center bg-surface px-6 py-3.5 rounded-[16px] border border-white/5 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-google-green/10 border border-google-green/20">
            <span className="h-2.5 w-2.5 bg-google-green rounded-full animate-pulse"></span>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white">DBMS session with Ayush</h1>
            <p className="text-[10px] text-slate-400 font-medium">42 mins • CN ↔ DBMS swap</p>
          </div>
        </div>

        {/* Controls (Meet style circle triggers) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-full transition-all cursor-pointer border ${isAudioEnabled
                ? "bg-google-blue/10 border-google-blue/20 text-google-blue hover:bg-google-blue/20"
                : "bg-google-red/10 border-google-red/20 text-google-red hover:bg-google-red/20"
              }`}
            title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              {isAudioEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Zm-5.46-3.83-8.85-8.85m14.31 14.31-8.85-8.85m14.31 14.31L1.5 1.5" />
              )}
            </svg>
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2.5 rounded-full transition-all cursor-pointer border ${isVideoEnabled
                ? "bg-google-blue/10 border-google-blue/20 text-google-blue hover:bg-google-blue/20"
                : "bg-google-red/10 border-google-red/20 text-google-red hover:bg-google-red/20"
              }`}
            title={isVideoEnabled ? "Disable Camera" : "Enable Camera"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              {isVideoEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Zm-3.03-9.5-12.5 12.5m12.5-12.5L1.5 1.5" />
              )}
            </svg>
          </button>

          <button
            onClick={handleEndCall}
            className="ml-2 bg-google-red hover:bg-google-red/90 text-white text-xs px-5 py-2.5 rounded-full font-bold transition cursor-pointer border-0 shadow-md"
          >
            End Call
          </button>
        </div>
      </div>

      <IncomingCallModal
        incomingCall={incomingCall}
        acceptCall={acceptCall}
        rejectCall={rejectCall}
      />

      {/* Main Content Split Area */}
      <div className="flex gap-4 flex-1 overflow-hidden min-h-0">

        {/* Left Panel: Whiteboard */}
        <Whiteboard roomId={roomId} />

        {/* Resizer Handle */}
        <div
          className="w-1.5 cursor-col-resize hover:bg-google-blue/30 bg-white/5 transition-colors duration-150 rounded shrink-0 flex items-center justify-center group"
          onMouseDown={() => {
            isDragging.current = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        >
          <div className="h-8 w-0.5 bg-slate-500 group-hover:bg-google-blue rounded-full transition-colors"></div>
        </div>

        {/* Right Panel: Video & Chat */}
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="flex flex-col gap-4 shrink-0 transition-[width] duration-75 ease-out min-h-0"
        >
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