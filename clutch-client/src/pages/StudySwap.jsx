import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRightLeft,
  Clock,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Zap,
  BookOpen,
  Code,
  Star,
  PlusCircle,
  Sparkles
} from "lucide-react";

const StudySwap = ({ swaps = [], addSwap }) => {
  const { user } = useUser();
  const [offer, setOffer] = useState("");
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState("");
  const [dsa, setDsa] = useState("");
  const [userCollege, setUserCollege] = useState("IIIT");
  const navigate = useNavigate();

  useEffect(() => {
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

  const getUrgencyStyles = (urgency) => {
    const cleanUrgency = (urgency || "").toLowerCase();
    if (cleanUrgency.includes("today")) {
      return "bg-google-red/10 text-google-red border-google-red/20";
    }
    if (cleanUrgency.includes("tomorrow")) {
      return "bg-google-yellow/10 text-google-yellow border-google-yellow/20";
    }
    return "bg-google-blue/10 text-google-blue border-google-blue/20";
  };

  return (
    <div className="min-h-screen bg-background text-white px-4 md:px-6 lg:px-12 pt-28 pb-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-extrabold text-white inline-flex items-center justify-center gap-2.5">
            <ArrowRightLeft className="text-google-green w-7 h-7" />
            Study Swap
          </h1>
          <p className="text-slate-400 text-xs max-w-xl mx-auto">
            Trade your skills and knowledge with other students. Post what you can teach and what you need to learn.
          </p>
        </motion.div>

        {/* Create Swap Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="p-5 bg-surface rounded-[16px] border border-white/5 shadow-md"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-google-green" /> Create a new swap request
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-google-green">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="I can teach..."
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full bg-background text-white placeholder-slate-500 border border-white/5 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:border-google-green transition-all text-sm"
              />
            </div>

            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-google-red">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="I want to learn..."
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                className="w-full bg-background text-white placeholder-slate-500 border border-white/5 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:border-google-green transition-all text-sm"
              />
            </div>

            <div className="relative w-full md:w-44 shrink-0">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-background text-white border border-white/5 rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-google-green cursor-pointer appearance-none transition-all text-sm"
              >
                <option value="" className="bg-surface text-slate-400">Urgency</option>
                <option value="1" className="bg-surface">Today</option>
                <option value="2" className="bg-surface">Tomorrow</option>
                <option value="3" className="bg-surface">Next Week</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative w-full md:w-44 shrink-0">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={dsa}
                onChange={(e) => setDsa(e.target.value)}
                className="w-full bg-background text-white border border-white/5 rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-google-green cursor-pointer appearance-none transition-all text-sm"
              >
                <option value="" className="bg-surface text-slate-400">Category</option>
                <option value="1" className="bg-surface">Skill Swap</option>
                <option value="2" className="bg-surface">DSA Swap</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePost}
              className="bg-google-blue hover:bg-google-blue/90 text-white font-bold px-7 py-2.5 rounded-full shadow-md transition-all cursor-pointer shrink-0 w-full md:w-auto border-0 text-sm h-[40px] flex items-center justify-center"
            >
              Post
            </motion.button>
          </div>
        </motion.div>

        {/* Swap Feed Columns */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Column: Skill Swaps */}
          <div className="bg-surface p-5 lg:p-6 rounded-[16px] border border-white/5 shadow-md flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-google-green" />
                <h2 className="text-xs font-bold tracking-[2px] uppercase text-white">Skill Swaps</h2>
              </div>
              <span className="bg-google-green/10 text-google-green text-[10px] px-3 py-1 rounded-full font-bold border border-google-green/20">
                {swaps.filter((s) => s.category === "skill").length} Active
              </span>
            </div>

            {swaps.filter((s) => s.category === "skill").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center my-auto p-8 border border-dashed border-white/5 rounded-[16px] bg-background">
                <Sparkles className="w-8 h-8 text-slate-500 opacity-40 mb-3" />
                <p className="text-slate-400 font-semibold text-xs">No skill swaps posted yet.</p>
                <p className="text-[10px] text-slate-500 mt-1">Use the form above to post the first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps
                  .filter((s) => s.category === "skill")
                  .map((swap, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ y: -2 }}
                      key={swap.id}
                      className="p-5 bg-background rounded-[16px] border border-white/5 hover:border-google-green/20 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-google-green/[0.02] rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-google-green/[0.04] transition-all"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <div className="min-w-0">
                            <h3 className="font-bold text-base text-white truncate">
                              {swap.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {swap.college} • {swap.year || "2nd"} Year
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${getUrgencyStyles(swap.urgency)}`}>
                            {swap.urgency || "Flexible"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-google-yellow font-bold mb-3.5 bg-google-yellow/5 w-fit px-2 py-0.5 rounded-full border border-google-yellow/10">
                          <Star className="w-3.5 h-3.5 fill-google-yellow text-google-yellow" />
                          <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "").trim() : swap.rating) : "5.0"}</span>
                        </div>

                        <div className="space-y-3.5 text-xs border-t border-white/5 pt-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-google-green uppercase text-[9px] tracking-wider block">
                              Offering
                            </span>
                            <span className="text-white font-medium text-sm">
                              {swap.offer}
                            </span>
                          </div>

                          <div className="flex justify-between items-end pt-1 gap-4">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-bold text-google-red uppercase text-[9px] tracking-wider block">
                                Seeking
                              </span>
                              <span className="text-white font-medium text-sm truncate">
                                {swap.need}
                              </span>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(swap.id)}
                                  className="cursor-pointer bg-google-red/10 hover:bg-google-red/20 text-google-red text-xs p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border-0"
                                  title="Delete Swap"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleMatch(swap)}
                                  className="cursor-pointer bg-google-blue text-white hover:bg-google-blue/90 text-xs px-4 py-2 rounded-full font-bold border-0 shadow-md transition-all shrink-0"
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
          <div className="bg-surface p-5 lg:p-6 rounded-[16px] border border-white/5 shadow-md flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-google-blue" />
                <h2 className="text-xs font-bold tracking-[2px] uppercase text-white">DSA Swaps</h2>
              </div>
              <span className="bg-google-blue/10 text-google-blue text-[10px] px-3 py-1 rounded-full font-bold border border-google-blue/20">
                {swaps.filter((s) => s.category === "dsa").length} Active
              </span>
            </div>

            {swaps.filter((s) => s.category === "dsa").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center my-auto p-8 border border-dashed border-white/5 rounded-[16px] bg-background">
                <Sparkles className="w-8 h-8 text-slate-500 opacity-40 mb-3" />
                <p className="text-slate-400 font-semibold text-xs">No DSA swaps posted yet.</p>
                <p className="text-[10px] text-slate-500 mt-1">Use the form above to post the first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {swaps
                  .filter((s) => s.category === "dsa")
                  .map((swap, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ y: -2 }}
                      key={swap.id}
                      className="p-5 bg-background rounded-[16px] border border-white/5 hover:border-google-blue/20 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-google-blue/[0.02] rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-google-blue/[0.04] transition-all"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <div className="min-w-0">
                            <h3 className="font-bold text-base text-white truncate">
                              {swap.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {swap.college} • {swap.year || "2nd"} Year
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${getUrgencyStyles(swap.urgency)}`}>
                            {swap.urgency || "Flexible"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-google-yellow font-bold mb-3.5 bg-google-yellow/5 w-fit px-2 py-0.5 rounded-full border border-google-yellow/10">
                          <Star className="w-3.5 h-3.5 fill-google-yellow text-google-yellow" />
                          <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "").trim() : swap.rating) : "5.0"}</span>
                        </div>

                        <div className="space-y-3.5 text-xs border-t border-white/5 pt-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-google-blue uppercase text-[9px] tracking-wider block">
                              Offering
                            </span>
                            <span className="text-white font-medium text-sm">
                              {swap.offer}
                            </span>
                          </div>

                          <div className="flex justify-between items-end pt-1 gap-4">
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-bold text-google-red uppercase text-[9px] tracking-wider block">
                                Seeking
                              </span>
                              <span className="text-white font-medium text-sm truncate">
                                {swap.need}
                              </span>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(swap.id)}
                                  className="cursor-pointer bg-google-red/10 hover:bg-google-red/20 text-google-red text-xs p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border-0"
                                  title="Delete Swap"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleMatch(swap)}
                                  className="cursor-pointer bg-google-blue text-white hover:bg-google-blue/90 text-xs px-4 py-2 rounded-full font-bold border-0 shadow-md transition-all shrink-0"
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
    </div>
  );
};

export default StudySwap;