import React, { useEffect } from 'react';

const VideoPanel = ({
  remoteStream,
  localStream,
  remoteVideoRef,
  localVideoRef
}) => {
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(console.error);
    }
  }, [remoteStream, remoteVideoRef]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(console.error);
    }
  }, [localStream, localVideoRef]);

  return (
    <div className="flex gap-3 h-[180px] shrink-0">
      
      {/* Remote Participant stream */}
      <div className="flex-1 bg-surface rounded-[16px] border border-white/5 relative flex items-center justify-center overflow-hidden shadow-md">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        
        {!remoteStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface">
            <div className="w-12 h-12 bg-google-green/10 text-google-green rounded-full flex items-center justify-center text-xl font-bold border border-google-green/20">
              A
            </div>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 flex items-center bg-black/60 backdrop-blur-sm border border-white/5 px-3 py-1 rounded-full">
          <span className="text-[10px] font-semibold text-white">Ayush</span>
          <div className="flex items-center gap-1 ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-google-green animate-pulse">
              <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
              <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.85v2.65h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.25v-2.65a6.751 6.751 0 0 1-6-6.85v-1.5A.75.75 0 0 1 6 10.5Z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Local Participant stream */}
      <div className="flex-1 bg-surface rounded-[16px] border border-white/5 relative flex items-center justify-center overflow-hidden shadow-md">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        
        {!localStream && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <div className="w-12 h-12 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center text-sm font-bold border border-google-blue/20">
              You
            </div>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-center items-center">
          <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
            localStream 
              ? "bg-google-green/10 text-google-green border-google-green/20" 
              : "bg-google-red/10 text-google-red border-google-red/20"
          }`}>
            {localStream ? "Cam On" : "Cam Off"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
