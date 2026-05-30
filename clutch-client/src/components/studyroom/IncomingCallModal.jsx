import React from 'react';

const IncomingCallModal = ({ incomingCall, acceptCall, rejectCall }) => {
  if (!incomingCall) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#141414] p-6 rounded-2xl border border-neutral-800 shadow-2xl w-[320px] text-center">
        <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border border-purple-500/30">
          ?
        </div>
        <h2 className="text-xl font-bold mb-2">Incoming Call</h2>
        <p className="text-sm text-neutral-400 mb-6">Someone wants to join the room</p>
        <div className="flex gap-3 justify-center">
          <button onClick={rejectCall} className="px-5 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-semibold transition w-full">Decline</button>
          <button onClick={acceptCall} className="px-5 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl font-semibold transition w-full">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
