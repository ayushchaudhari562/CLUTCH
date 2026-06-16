import React from 'react';

const IncomingCallModal = ({ incomingCall, acceptCall, rejectCall }) => {
  if (!incomingCall) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/10 w-[320px] text-center shadow-none text-white">
        <div className="w-16 h-16 bg-emerald-500/10 text-[#10b981] rounded-[50%] flex items-center justify-center text-2xl font-bold mx-auto mb-4 border border-emerald-500/20">
          ?
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Incoming Call</h2>
        <p className="text-sm text-[#6B7280] mb-6">Someone wants to join the room</p>
        <div className="flex gap-3 justify-center">
          <button onClick={rejectCall} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-[8px] font-semibold transition w-full cursor-pointer border-0 shadow-none">Decline</button>
          <button onClick={acceptCall} className="px-5 py-2 bg-white hover:bg-slate-200 text-black rounded-[8px] font-semibold transition w-full cursor-pointer border-0 shadow-none">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
