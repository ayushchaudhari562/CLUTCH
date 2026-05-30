import React from 'react';

const VideoPanel = ({ 
  remoteStream, 
  localStream, 
  remoteVideoRef, 
  localVideoRef 
}) => {
  return (
    <div className="flex gap-2 h-[180px] shrink-0">
      <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 relative flex items-center justify-center overflow-hidden">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        {!remoteStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#141414]">
            <div className="w-10 h-10 bg-purple-600/10 text-purple-400 rounded-full flex items-center justify-center text-lg font-bold border border-purple-500/20">A</div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
          <span className="text-[10px] font-medium text-gray-300">Ayush</span>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-400 animate-pulse"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.85v2.65h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.25v-2.65a6.751 6.751 0 0 1-6-6.85v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#141414] rounded-xl border border-neutral-800 relative flex items-center justify-center overflow-hidden">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        {!localStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
            <div className="w-8 h-8 bg-neutral-800 text-neutral-400 rounded-full flex items-center justify-center text-xs font-semibold border border-neutral-700">You</div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex justify-center items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-gray-400">
          {localStream ? "Cam On" : "Cam Off"}
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
