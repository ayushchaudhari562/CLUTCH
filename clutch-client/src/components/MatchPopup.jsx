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
      console.log("MatchPopup: User loaded:", user.id, "Socket connected:", socket.connected);
      if (socket.connected) {
        console.log("MatchPopup: Socket already connected, registering user:", user.id);
        socket.emit("register", user.id);
      }
      const onConnect = () => {
        console.log("MatchPopup: Socket connected event, registering user:", user.id);
        socket.emit("register", user.id);
      };
      socket.on("connect", onConnect);

      return () => socket.off("connect", onConnect);
    }
  }, [user]);

  useEffect(() => {
    const handleIncoming = (data) => {
      console.log("MatchPopup: Received incoming-match-request event:", data);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/5 max-w-sm w-full text-white shadow-none">
        <h3 className="text-lg font-bold text-white mb-2">New Match Request</h3>
        
        <p className="mb-6 text-[#6B7280]">
          <span className="font-semibold text-[#10b981]">{incomingRequest.requesterName}</span> wants to study with you.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              socket.emit("decline-match", {
                requesterSocketId: incomingRequest.requesterSocketId
              });
              setIncomingRequest(null);
            }}
            className="flex-1 px-4 py-2 bg-transparent hover:bg-white/5 text-[#6B7280] border border-white/5 rounded-[8px] font-semibold transition cursor-pointer"
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
            className="flex-1 px-4 py-2 bg-white hover:bg-slate-200 text-black rounded-[8px] font-semibold transition border-0 shadow-none cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPopup;
