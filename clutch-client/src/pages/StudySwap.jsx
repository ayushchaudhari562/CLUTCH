import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";

const StudySwap = ({ swaps = [], addSwap }) => {
  const { user } = useUser();
  const [offer, setOffer] = useState("");
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState("");
  const [dsa, setDsa] = useState("");
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [userCollege, setUserCollege] = useState("IIIT");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("incoming-match-request", (data) => {
      setIncomingRequest(data);
    });

    socket.on("match-accepted", (roomId) => {
      navigate(`/study-room?room=${roomId}`);
    });

    return () => {
      socket.off("incoming-match-request");
      socket.off("match-accepted");
    };
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.collegeName) {
            setUserCollege(data.collegeName);
          }
        })
        .catch(err => console.error("Error fetching user data in StudySwap:", err));
    }
  }, [user]);

  const handleMatch = (swap) => {
    socket.emit("request-match", {
      targetSocketId: swap.socketId,
      requesterSocketId: socket.id,
      requesterName: user ? user.fullName || user.username || "Clutch User" : "Users--requesting"
    });
    alert("Match request sent!");
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!offer || !need) {
      alert("Please fill in both offer and need!");
      return;
    }
    if (!dsa) {
      alert("Please select a swap category (Skill Swap or DSA Swap)!");
      return;
    }

    const urgencyMap = { 1: "Today", 2: "Tomorrow", 3: "Next Week" };
    const newSwapObj = {
      id: Date.now(),
      name: user ? user.fullName || user.username || "Clutch User" : "Ayush Chaudhari",
      college: userCollege,
      year: "2nd",
      rating: "5.0⭐",
      offer: offer,
      need: need,
      urgency: urgencyMap[urgency] || "Flexible",
      category: dsa === "1" ? "skill" : "dsa",
      socketId: socket.id, 
    };

    addSwap(newSwapObj);

    setOffer("");
    setNeed("");
    setUrgency("");
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans">
      <h1 className="m-5 text-xl font-bold text-center text-white uppercase tracking-wider">
        What you need / What you offer
      </h1>
      
      <div className="flex flex-wrap md:flex-nowrap gap-4 p-4 max-w-7xl mx-auto items-center bg-[#12141C] rounded-[12px] border border-white/5 mb-8">
        <input
          type="text"
          placeholder="What you offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          className="bg-[#090A0F] text-white placeholder-[#6B7280] border border-white/5 rounded-[8px] p-3 flex-1 min-w-[150px] focus:outline-none focus:border-[#10b981] transition-colors"
        />

        <input
          type="text"
          placeholder="What you need"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className="bg-[#090A0F] text-white placeholder-[#6B7280] border border-white/5 rounded-[8px] p-3 flex-1 min-w-[150px] focus:outline-none focus:border-[#10b981] transition-colors"
        />
        
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="bg-[#090A0F] text-white border border-white/5 rounded-[8px] p-3 w-full md:w-48 focus:outline-none focus:border-[#10b981] cursor-pointer"
        >
          <option value="" className="bg-[#090A0F] text-[#6B7280]">Select urgency</option>
          <option value="1" className="bg-[#090A0F]">Today</option>
          <option value="2" className="bg-[#090A0F]">Tomorrow</option>
          <option value="3" className="bg-[#090A0F]">Next Week</option>
        </select>
        
        <select
          value={dsa}
          onChange={(e) => setDsa(e.target.value)}
          className="bg-[#090A0F] text-white border border-white/5 rounded-[8px] p-3 w-full md:w-48 focus:outline-none focus:border-[#10b981] cursor-pointer"
        >
          <option value="" className="bg-[#090A0F] text-[#6B7280]">Select Swap</option>
          <option value="1" className="bg-[#090A0F]">Skill Swap</option>
          <option value="2" className="bg-[#090A0F]">DSA-Swap</option>
        </select>
        
        <button
          onClick={handlePost}
          className="bg-[#10b981] hover:bg-[#059669] text-black font-semibold px-6 py-3 rounded-[8px] transition-colors border-0 shadow-none cursor-pointer shrink-0"
        >
          Post Swap
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Skill Swaps */}
        <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/5 shadow-none flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
            <h2 className="text-[11px] font-bold text-[#6B7280] tracking-[1.5px] uppercase">Skill Swaps</h2>
            <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-0.5 rounded-[20px] font-medium border border-emerald-500/20">
              {swaps.filter((s) => s.category === "skill").length} Active
            </span>
          </div>
          
          {swaps.filter((s) => s.category === "skill").length === 0 ? (
            <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center shadow-none my-auto">
              No skill swaps posted yet. Use the form above to post the first one!
            </p>
          ) : (
            <div className="space-y-4">
              {swaps
                .filter((s) => s.category === "skill")
                .map((swap) => (
                  <div
                    key={swap.id}
                    className="p-7 bg-[#090A0F] rounded-[16px] border border-white/5 hover:border-emerald-500/30 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white tracking-tight">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="px-3.5 py-1 text-xs font-semibold bg-white/5 text-[#6B7280] rounded-full border border-white/5">
                          {swap.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-semibold mb-4 mt-2">
                        <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating : `${swap.rating} ⭐`) : "1.0 ⭐"}</span>
                      </div>
                      <div className="space-y-4 text-sm border-t border-white/5 pt-4 mt-3">
                        <div>
                          <span className="font-bold text-[#10b981] uppercase text-[11px] tracking-widest block">
                            Offering
                          </span>
                          <span className="text-white mt-1 text-base font-medium block">
                            {swap.offer}
                          </span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                          <div>
                            <span className="font-bold text-[#f87171] uppercase text-[11px] tracking-widest block">
                              Seeking
                            </span>
                            <span className="text-white mt-1 text-base font-medium block">
                              {swap.need}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleMatch(swap)} 
                            className="cursor-pointer bg-[#10b981] hover:bg-[#059669] text-black text-sm px-6 py-3 rounded-[10px] font-extrabold border-0 shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider shrink-0"
                          >
                            Match
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column: DSA Swaps */}
        <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/5 shadow-none flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
            <h2 className="text-[11px] font-bold text-[#6B7280] tracking-[1.5px] uppercase">DSA Swaps</h2>
            <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-0.5 rounded-[20px] font-medium border border-emerald-500/20">
              {swaps.filter((s) => s.category === "dsa").length} Active
            </span>
          </div>
          
          {swaps.filter((s) => s.category === "dsa").length === 0 ? (
            <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center shadow-none my-auto">
              No DSA swaps posted yet. Use the form above to post the first one!
            </p>
          ) : (
            <div className="space-y-4">
              {swaps
                .filter((s) => s.category === "dsa")
                .map((swap) => (
                  <div
                    key={swap.id}
                    className="p-7 bg-[#090A0F] rounded-[16px] border border-white/5 hover:border-emerald-500/30 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white tracking-tight">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="px-3.5 py-1 text-xs font-semibold bg-white/5 text-[#6B7280] rounded-full border border-white/5">
                          {swap.urgency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-semibold mb-4 mt-2">
                        <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating : `${swap.rating} ⭐`) : "1.0 ⭐"}</span>
                      </div>
                      <div className="space-y-4 text-sm border-t border-white/5 pt-4 mt-3">
                        <div>
                          <span className="font-bold text-[#10b981] uppercase text-[11px] tracking-widest block">
                            Offering
                          </span>
                          <span className="text-white mt-1 text-base font-medium block">
                            {swap.offer}
                          </span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                          <div>
                            <span className="font-bold text-[#f87171] uppercase text-[11px] tracking-widest block">
                              Seeking
                            </span>
                            <span className="text-white mt-1 text-base font-medium block">
                              {swap.need}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleMatch(swap)} 
                            className="cursor-pointer bg-[#10b981] hover:bg-[#059669] text-black text-sm px-6 py-3 rounded-[10px] font-extrabold border-0 shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider shrink-0"
                          >
                            Match
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* The Match Request Popup */}
      {incomingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/5 max-w-sm w-full text-white shadow-none">
            <h3 className="text-lg font-bold text-white mb-2">New Match Request</h3>
            
            <p className="mb-6 text-[#6B7280]">
              <span className="font-semibold text-[#10b981]">{incomingRequest.requesterName}</span> wants to study with you.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIncomingRequest(null)}
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
      )}
    </div>
  );
};

export default StudySwap;
 