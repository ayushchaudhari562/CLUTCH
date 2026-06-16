import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";
import { motion } from "framer-motion";
import { Search, ArrowRightLeft, Clock, Trash2, CheckCircle2, ChevronDown, Zap } from "lucide-react";

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
    // Only fetching user data here now, socket logic moved to App.jsx
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
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
      targetUserId: swap.userId,
      requesterSocketId: socket.id,
      requesterName: user ? user.fullName || user.username || "Clutch User" : "Users--requesting"
    });
    alert("Match request sent!");
  };

  const handleDelete = async (swapId) => {
    if (!window.confirm("Are you sure you want to delete this swap?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/swaps/${swapId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete swap.");
      }
    } catch (error) {
      console.error("Error deleting swap:", error);
    }
  };

  const handlePost = async (e) => {
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
    const finalUrgency = urgencyMap[urgency] || "Flexible";
    const finalCategory = dsa === "1" ? "skill" : "dsa";

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id, // Clerk ID
          offer,
          need,
          urgency: finalUrgency,
          category: finalCategory
        }),
      });

      if (response.ok) {
        const savedSwap = await response.json();

        let rawName = savedSwap.user ? (savedSwap.user.username || "Clutch User") : (user ? user.fullName || user.username : "Clutch User");
        let displayName = rawName?.startsWith("user_") ? "Student" : rawName;

        const newSwapObj = {
          id: savedSwap.id,
          name: displayName,
          college: savedSwap.user ? savedSwap.user.collegeName : userCollege,
          year: "2nd",
          rating: "5.0⭐",
          offer: savedSwap.offer,
          need: savedSwap.need,
          urgency: savedSwap.urgency,
          category: savedSwap.category,
          socketId: socket.id,
          userId: user?.id,
        };

        addSwap(newSwapObj);

        setOffer("");
        setNeed("");
        setUrgency("");
        setDsa("");
      } else {
        alert("Failed to post swap. Ensure you are logged in.");
      }
    } catch (error) {
      console.error("Error posting swap:", error);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#6B7280] inline-flex items-center gap-3">
          <ArrowRightLeft className="text-[#10b981] w-8 h-8" />
          Study Swap
        </h1>
        <p className="text-[#6B7280] mt-2 max-w-xl mx-auto">
          Trade your skills and knowledge with other students. Post what you can teach and what you need to learn.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap md:flex-nowrap gap-4 p-5 max-w-5xl mx-auto items-center bg-white/5 backdrop-blur-md rounded-[16px] border border-white/10 shadow-xl mb-12"
      >
        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="I can teach..."
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            className="w-full bg-[#090A0F]/50 text-white placeholder-[#6B7280] border border-white/5 rounded-[10px] pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="I want to learn..."
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            className="w-full bg-[#090A0F]/50 text-white placeholder-[#6B7280] border border-white/5 rounded-[10px] pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative w-full md:w-48">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full bg-[#090A0F]/50 text-white border border-white/5 rounded-[10px] pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent cursor-pointer appearance-none"
          >
            <option value="" className="bg-[#090A0F] text-[#6B7280]">Urgency</option>
            <option value="1" className="bg-[#090A0F]">Today</option>
            <option value="2" className="bg-[#090A0F]">Tomorrow</option>
            <option value="3" className="bg-[#090A0F]">Next Week</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        <div className="relative w-full md:w-48">
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          <select
            value={dsa}
            onChange={(e) => setDsa(e.target.value)}
            className="w-full bg-[#090A0F]/50 text-white border border-white/5 rounded-[10px] pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-transparent cursor-pointer appearance-none"
          >
            <option value="" className="bg-[#090A0F] text-[#6B7280]">Category</option>
            <option value="1" className="bg-[#090A0F]">Skill Swap</option>
            <option value="2" className="bg-[#090A0F]">DSA Swap</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePost}
          className="bg-[#10b981] hover:bg-[#059669] text-black font-bold px-8 py-3 rounded-[10px] transition-all shadow-lg shadow-[#10b981]/20 cursor-pointer shrink-0 w-full md:w-auto"
        >
          Post
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column: Skill Swaps */}
        <div className="bg-[#12141C]/80 backdrop-blur-md p-6 lg:p-8 rounded-[20px] border border-white/5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-[13px] font-bold text-white tracking-widest uppercase">Skill Swaps</h2>
            <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-1 rounded-full font-bold border border-emerald-500/20">
              {swaps.filter((s) => s.category === "skill").length} Active
            </span>
          </div>

          {swaps.filter((s) => s.category === "skill").length === 0 ? (
            <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center my-auto">
              No skill swaps posted yet. Use the form above to post the first one!
            </p>
          ) : (
            <div className="space-y-5">
              {swaps
                .filter((s) => s.category === "skill")
                .map((swap, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    key={swap.id}
                    className="p-6 bg-gradient-to-br from-[#1a1d27] to-[#12141C] rounded-[16px] border border-white/5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white tracking-tight">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-[#6B7280] mt-1 font-medium">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded-full border border-white/10 shadow-sm">
                          {swap.urgency}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-bold mb-5">
                        <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating : `${swap.rating} ⭐`) : "1.0 ⭐"}</span>
                      </div>

                      <div className="space-y-4 text-sm border-t border-white/10 pt-5">
                        <div>
                          <span className="font-bold text-[#10b981] uppercase text-[10px] tracking-widest block mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" /> Offering
                          </span>
                          <span className="text-white text-base font-medium block">
                            {swap.offer}
                          </span>
                        </div>

                        <div className="flex justify-between items-end pt-2">
                          <div>
                            <span className="font-bold text-[#f87171] uppercase text-[10px] tracking-widest block mb-1.5 flex items-center gap-1.5">
                              <Search className="w-3 h-3" /> Seeking
                            </span>
                            <span className="text-white text-base font-medium block">
                              {swap.need}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(swap.id)}
                                className="cursor-pointer bg-transparent hover:bg-red-500/10 text-red-500 text-sm p-3 rounded-[10px] transition-all flex items-center justify-center shrink-0 border border-transparent hover:border-red-500/20"
                                title="Delete Swap"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMatch(swap)}
                              className="cursor-pointer bg-white text-black hover:bg-slate-200 text-sm px-6 py-2.5 rounded-[10px] font-bold border-0 shadow-lg transition-all tracking-wide"
                            >
                              Match
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column: DSA Swaps */}
        <div className="bg-[#12141C]/80 backdrop-blur-md p-6 lg:p-8 rounded-[20px] border border-white/5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-[13px] font-bold text-white tracking-widest uppercase">DSA Swaps</h2>
            <span className="bg-[#3b82f6]/10 text-[#3b82f6] text-[11px] px-3 py-1 rounded-full font-bold border border-[#3b82f6]/20">
              {swaps.filter((s) => s.category === "dsa").length} Active
            </span>
          </div>

          {swaps.filter((s) => s.category === "dsa").length === 0 ? (
            <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center my-auto">
              No DSA swaps posted yet. Use the form above to post the first one!
            </p>
          ) : (
            <div className="space-y-5">
              {swaps
                .filter((s) => s.category === "dsa")
                .map((swap, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    key={swap.id}
                    className="p-6 bg-gradient-to-br from-[#1a1d27] to-[#12141C] rounded-[16px] border border-white/5 hover:border-[#3b82f6]/40 transition-all duration-300 flex flex-col shadow-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#3b82f6]/10 transition-all"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white tracking-tight">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-[#6B7280] mt-1 font-medium">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white rounded-full border border-white/10 shadow-sm">
                          {swap.urgency}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-yellow-500 font-bold mb-5">
                        <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating : `${swap.rating} ⭐`) : "1.0 ⭐"}</span>
                      </div>

                      <div className="space-y-4 text-sm border-t border-white/10 pt-5">
                        <div>
                          <span className="font-bold text-[#3b82f6] uppercase text-[10px] tracking-widest block mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" /> Offering
                          </span>
                          <span className="text-white text-base font-medium block">
                            {swap.offer}
                          </span>
                        </div>

                        <div className="flex justify-between items-end pt-2">
                          <div>
                            <span className="font-bold text-[#f87171] uppercase text-[10px] tracking-widest block mb-1.5 flex items-center gap-1.5">
                              <Search className="w-3 h-3" /> Seeking
                            </span>
                            <span className="text-white text-base font-medium block">
                              {swap.need}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(swap.id)}
                                className="cursor-pointer bg-transparent hover:bg-red-500/10 text-red-500 text-sm p-3 rounded-[10px] transition-all flex items-center justify-center shrink-0 border border-transparent hover:border-red-500/20"
                                title="Delete Swap"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMatch(swap)}
                              className="cursor-pointer bg-white text-black hover:bg-slate-200 text-sm px-6 py-2.5 rounded-[10px] font-bold border-0 shadow-lg transition-all tracking-wide"
                            >
                              Match
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudySwap;