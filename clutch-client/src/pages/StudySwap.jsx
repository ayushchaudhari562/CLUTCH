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
  ArrowRight,
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

  // Helper to color urgency badges
  const getUrgencyStyles = (urgency) => {
    const cleanUrgency = (urgency || "").toLowerCase();
    if (cleanUrgency.includes("today")) {
      return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
    }
    if (cleanUrgency.includes("tomorrow")) {
      return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
    }
    return "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20";
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] p-4 md:p-6 lg:px-12 font-sans pt-24 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center space-y-2"
        >
          <h1 className="text-3xl font-medium text-[#111827] inline-flex items-center justify-center gap-2">
            <ArrowRightLeft className="text-[#10B981] w-6 h-6" />
            Study Swap
          </h1>
          <p className="text-[#6B7280] text-sm max-w-xl mx-auto">
            Trade your skills and knowledge with other students. Post what you can teach and what you need to learn.
          </p>
        </motion.div>

        {/* Floating Input Control Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
        >
          <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-[#10B981]" /> Create a new swap request
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="I can teach..."
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full bg-white text-[#111827] placeholder-[#6B7280] border border-[#E5E7EB] rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all text-sm shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
              />
            </div>

            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EF4444]">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="I want to learn..."
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                className="w-full bg-white text-[#111827] placeholder-[#6B7280] border border-[#E5E7EB] rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all text-sm shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
              />
            </div>

            <div className="relative w-full md:w-48 shrink-0">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-white text-[#111827] border border-[#E5E7EB] rounded-full pl-10 pr-10 py-3 focus:outline-none focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] cursor-pointer appearance-none transition-all text-sm shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
              >
                <option value="" className="bg-white text-[#6B7280]">Urgency</option>
                <option value="1" className="bg-white">Today</option>
                <option value="2" className="bg-white">Tomorrow</option>
                <option value="3" className="bg-white">Next Week</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            </div>

            <div className="relative w-full md:w-48 shrink-0">
              <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
              <select
                value={dsa}
                onChange={(e) => setDsa(e.target.value)}
                className="w-full bg-white text-[#111827] border border-[#E5E7EB] rounded-full pl-10 pr-10 py-3 focus:outline-none focus:ring-4 focus:ring-[#10B981]/20 focus:border-[#10B981] cursor-pointer appearance-none transition-all text-sm shadow-[0_1px_2px_rgba(17,24,39,0.06)]"
              >
                <option value="" className="bg-white text-[#6B7280]">Category</option>
                <option value="1" className="bg-white">Skill Swap</option>
                <option value="2" className="bg-white">DSA Swap</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePost}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold px-8 py-3 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all cursor-pointer shrink-0 w-full md:w-auto border-0 text-sm h-[46px] flex items-center justify-center"
            >
              Post
            </motion.button>
          </div>
        </motion.div>

        {/* Swap Feed Columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Column: Skill Swaps */}
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.06)] flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-xs font-semibold tracking-[2px] uppercase text-[#6B7280]">Skill Swaps</h2>
              </div>
              <span className="bg-[#10B981]/10 text-[#10B981] text-[11px] px-3 py-1 rounded-full font-bold border border-[#10B981]/20">
                {swaps.filter((s) => s.category === "skill").length} Active
              </span>
            </div>

            {swaps.filter((s) => s.category === "skill").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center my-auto p-8 border border-dashed border-[#E5E7EB] rounded-2xl bg-[#F8F9FA]">
                <Sparkles className="w-10 h-10 text-[#6B7280] opacity-40 mb-3" />
                <p className="text-[#6B7280] font-medium text-xs">No skill swaps posted yet.</p>
                <p className="text-[10px] text-[#6B7280] mt-1">Use the form above to post the first one!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {swaps
                  .filter((s) => s.category === "skill")
                  .map((swap, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      key={swap.id}
                      className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.06)] hover:shadow-[0_1px_2px_rgba(17,24,39,0.15),0_2px_8px_2px_rgba(17,24,39,0.10)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <div>
                            <h3 className="font-semibold text-lg text-[#111827] tracking-tight">
                              {swap.name}
                            </h3>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {swap.college} • {swap.year || "2nd"} Year
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getUrgencyStyles(swap.urgency)}`}>
                            {swap.urgency || "Flexible"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold mb-4 bg-[#F59E0B]/5 w-fit px-2 py-0.5 rounded-full border border-[#F59E0B]/10">
                          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                          <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "") : swap.rating) : "5.0"}</span>
                        </div>

                        <div className="space-y-3 text-xs border-t border-[#E5E7EB] pt-4">
                          <div>
                            <span className="font-bold text-[#10B981] uppercase text-[9px] tracking-wider block mb-1">
                              Offering
                            </span>
                            <span className="text-[#111827] font-medium text-sm block">
                              {swap.offer}
                            </span>
                          </div>

                          <div className="flex justify-between items-end pt-1 gap-4">
                            <div>
                              <span className="font-bold text-[#EF4444] uppercase text-[9px] tracking-wider block mb-1">
                                Seeking
                              </span>
                              <span className="text-[#111827] font-medium text-sm block">
                                {swap.need}
                              </span>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(swap.id)}
                                  className="cursor-pointer bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border-0"
                                  title="Delete Swap"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleMatch(swap)}
                                className="cursor-pointer bg-[#10B981] hover:bg-[#059669] text-white text-xs px-5 py-2.5 rounded-full font-bold border-0 shadow-[0_2px_8px_rgba(16,185,129,0.15)] transition-all"
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
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.06)] flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#3B82F6]" />
                <h2 className="text-xs font-semibold tracking-[2px] uppercase text-[#6B7280]">DSA Swaps</h2>
              </div>
              <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[11px] px-3 py-1 rounded-full font-bold border border-[#3B82F6]/20">
                {swaps.filter((s) => s.category === "dsa").length} Active
              </span>
            </div>

            {swaps.filter((s) => s.category === "dsa").length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center my-auto p-8 border border-dashed border-[#E5E7EB] rounded-2xl bg-[#F8F9FA]">
                <Sparkles className="w-10 h-10 text-[#6B7280] opacity-40 mb-3" />
                <p className="text-[#6B7280] font-medium text-xs">No DSA swaps posted yet.</p>
                <p className="text-[10px] text-[#6B7280] mt-1">Use the form above to post the first one!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {swaps
                  .filter((s) => s.category === "dsa")
                  .map((swap, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      key={swap.id}
                      className="p-5 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,24,39,0.06)] hover:shadow-[0_1px_2px_rgba(17,24,39,0.15),0_2px_8px_2px_rgba(17,24,39,0.10)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3 gap-4">
                          <div>
                            <h3 className="font-semibold text-lg text-[#111827] tracking-tight">
                              {swap.name}
                            </h3>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {swap.college} • {swap.year || "2nd"} Year
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getUrgencyStyles(swap.urgency)}`}>
                            {swap.urgency || "Flexible"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold mb-4 bg-[#F59E0B]/5 w-fit px-2 py-0.5 rounded-full border border-[#F59E0B]/10">
                          <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                          <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "") : swap.rating) : "5.0"}</span>
                        </div>

                        <div className="space-y-3 text-xs border-t border-[#E5E7EB] pt-4">
                          <div>
                            <span className="font-bold text-[#3B82F6] uppercase text-[9px] tracking-wider block mb-1">
                              Offering
                            </span>
                            <span className="text-[#111827] font-medium text-sm block">
                              {swap.offer}
                            </span>
                          </div>

                          <div className="flex justify-between items-end pt-1 gap-4">
                            <div>
                              <span className="font-bold text-[#EF4444] uppercase text-[9px] tracking-wider block mb-1">
                                Seeking
                              </span>
                              <span className="text-[#111827] font-medium text-sm block">
                                {swap.need}
                              </span>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              {(user && (user.id === swap.userId || user.fullName === swap.name || user.username === swap.name)) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(swap.id)}
                                  className="cursor-pointer bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs p-2.5 rounded-full transition-all flex items-center justify-center shrink-0 border-0"
                                  title="Delete Swap"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleMatch(swap)}
                                className="cursor-pointer bg-[#10B981] hover:bg-[#059669] text-white text-xs px-5 py-2.5 rounded-full font-bold border-0 shadow-[0_2px_8px_rgba(16,185,129,0.15)] transition-all"
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