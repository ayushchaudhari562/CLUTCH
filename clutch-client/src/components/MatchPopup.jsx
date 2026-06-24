import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";

const MatchPopup = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    if (user) {
      if (socket.connected) {
        socket.emit("register", user.id);
      }
      const onConnect = () => {
        socket.emit("register", user.id);
      };
      socket.on("connect", onConnect);

      return () => socket.off("connect", onConnect);
    }
  }, [user]);

  useEffect(() => {
    const handleIncoming = (data) => {
      setIncomingRequest(data);
    };
    const handleAccepted = (roomId) => {
      navigate(`/study-room?room=${roomId}`);
    };
    const handleDeclined = () => {
      alert("Your match request was declined.");
    };

    socket.on("incoming-match-request", handleIncoming);
    socket.on("match-accepted", handleAccepted);
    socket.on("match-declined", handleDeclined);

    return () => {
      socket.off("incoming-match-request", handleIncoming);
      socket.off("match-accepted", handleAccepted);
      socket.off("match-declined", handleDeclined);
    };
  }, [navigate]);

  if (!incomingRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-surface p-6 rounded-[16px] border border-white/5 max-w-sm w-full text-white shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 tracking-tight">New Match Request</h3>
        
        <p className="mb-6 text-slate-400 text-xs font-medium leading-relaxed">
          <span className="font-extrabold text-google-green">{incomingRequest.requesterName}</span> wants to study with you.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              socket.emit("decline-match", {
                requesterSocketId: incomingRequest.requesterSocketId
              });
              setIncomingRequest(null);
            }}
            className="flex-1 px-4 py-2 bg-transparent hover:bg-white/5 text-slate-400 border border-white/5 rounded-full font-bold transition cursor-pointer text-xs"
          >
            Decline
          </button>
          
          <button
            onClick={() => {
              socket.emit("accept-match", {
                targetSocketId: socket.id,
                requesterSocketId: incomingRequest.requesterSocketId
              });
              setIncomingRequest(null);
            }}
            className="flex-1 px-4 py-2 bg-google-blue hover:bg-google-blue/90 text-white rounded-full font-bold transition border-0 shadow-md cursor-pointer text-xs"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;
