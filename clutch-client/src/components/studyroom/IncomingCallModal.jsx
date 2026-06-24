import React from 'react';

const IncomingCallModal = ({ incomingCall, acceptCall, rejectCall }) => {
  if (!incomingCall) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-surface p-6 rounded-[16px] border border-white/5 w-[300px] text-center shadow-lg text-white">
        <div className="w-14 h-14 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-google-blue/20">
          ?
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Incoming Call</h2>
        <p className="text-xs text-slate-400 mb-6">Someone wants to join the room</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={rejectCall} 
            className="px-4 py-2 bg-google-red/10 hover:bg-google-red/20 text-google-red rounded-full font-bold transition w-full cursor-pointer border border-google-red/20 text-xs shadow-sm"
          >
            Decline
          </button>
          <button 
            onClick={acceptCall} 
            className="px-4 py-2 bg-google-blue hover:bg-google-blue/90 text-white rounded-full font-bold transition w-full cursor-pointer border-0 text-xs shadow-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
