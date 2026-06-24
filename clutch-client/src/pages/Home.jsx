import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";
import { motion } from "framer-motion";
import { Flame, Clock, GraduationCap, ShieldAlert, PlusCircle } from "lucide-react";

const Home = ({ swaps = [] }) => {
  const { user } = useUser();
  const [session] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userCollege, setUserCollege] = useState("Loading...");
  const [incomingRequest, setIncomingRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.collegeName) {
            setUserCollege(data.collegeName);
          } else {
            setUserCollege("No college selected");
          }
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setUserCollege("Error loading college");
        });
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleMatch = (swap) => {
    socket.emit("request-match", {
      targetUserId: swap.userId,
      requesterSocketId: socket.id,
      requesterName: user ? user.username || user.fullName || "Clutch User" : "Users--requesting"
    });
    alert("Match request sent!");
  };

  function getGreeting() {
    const hour = currentTime.getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else if (hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background text-white px-4 md:px-6 lg:px-12 pt-28 pb-12 font-sans space-y-6">
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col border-b border-white/5 pb-4 gap-2"
        >
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-google-green bg-clip-text text-transparent w-fit pb-1">
            {getGreeting()}, {user?.firstName || "Student"}!
          </h1>

          <p className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0 font-medium">
            <Clock className="w-3.5 h-3.5 text-google-green" />
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" • "}
            {currentTime.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Dashboard Metrics and Actions Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            {/* Session Streak Card */}
            <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-[16px] px-4 py-2.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">Session Streak</span>
                <span className="text-white font-extrabold text-xs mt-0.5">{session}</span>
              </div>
            </div>

            {/* Day Streak Card */}
            <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-[16px] px-4 py-2.5 shadow-md">
              <div className="w-8 h-8 rounded-full bg-google-red/10 flex items-center justify-center text-google-red shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">Day Streak</span>
                <span className="text-white font-extrabold text-xs mt-0.5">{session}</span>
              </div>
            </div>

            {/* College Card */}
            <div className="flex items-center gap-3 bg-surface border border-white/5 rounded-[16px] px-4 py-2.5 shadow-md min-w-0 max-w-xl shrink">
              <div className="w-8 h-8 rounded-full bg-google-green/10 flex items-center justify-center text-google-green shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-slate-400 text-[9px] uppercase tracking-wider font-bold">College</span>
                <span className="text-white font-bold text-xs truncate mt-0.5">{userCollege}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 cursor-pointer bg-google-red/10 hover:bg-google-red/20 text-google-red border border-google-red/20 px-4.5 py-2 rounded-full font-bold shadow-sm transition-colors text-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              SOS
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/study-swap")}
              className="flex items-center gap-1.5 bg-google-blue hover:bg-google-blue/90 text-white border-0 px-5 py-2.5 rounded-full font-bold shadow-md cursor-pointer transition-all text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post Swap
            </motion.button>
          </div>
        </motion.div>

        {/* Feed List Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-slate-400 text-xs font-bold tracking-[2px] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-google-green"></span>
            Recent Swap Requests
          </h2>

          {swaps.length === 0 ? (
            <div className="bg-surface p-12 rounded-[16px] border border-white/5 text-center shadow-md">
              <PlusCircle className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-40" />
              <p className="text-slate-400 font-semibold text-sm">No swap requests posted yet.</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to post a study swap!</p>
            </div>
          ) : (
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Skill Swaps */}
              <div className="bg-surface p-5 lg:p-6 rounded-[16px] border border-white/5 shadow-md flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-google-green"></span>
                    Skill Swaps
                  </h2>
                  <span className="bg-google-green/10 text-google-green text-[10px] px-3 py-1 rounded-full font-bold border border-google-green/20">
                    {swaps.filter((s) => s.category === "skill").length} Active
                  </span>
                </div>

                {swaps.filter((s) => s.category === "skill").length === 0 ? (
                  <p className="text-slate-500 italic bg-background p-6 rounded-[12px] border border-white/5 text-center my-auto text-xs">
                    No skill swaps posted yet.
                  </p>
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
                          className="p-5 bg-background rounded-[16px] border border-white/5 hover:border-google-green/20 transition-all duration-200 flex flex-col shadow-md relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-google-green/[0.02] rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-google-green/[0.04] transition-all"></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                              <div className="min-w-0">
                                <h3 className="font-bold text-sm text-white truncate">
                                  {swap.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {swap.college} • {swap.year} Year
                                </p>
                              </div>
                              <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-white/5 text-slate-300 rounded-full border border-white/5 shadow-sm">
                                {swap.urgency}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-google-yellow font-bold mb-3.5 bg-google-yellow/5 w-fit px-2 py-0.5 rounded-full border border-google-yellow/10">
                              <span className="text-[10px]">★</span>
                              <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "") : swap.rating) : "5.0"}</span>
                            </div>

                            <div className="space-y-3.5 text-xs border-t border-white/5 pt-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-google-green uppercase text-[9px] tracking-wider">
                                  Offering
                                </span>
                                <span className="text-white text-sm font-medium">
                                  {swap.offer}
                                </span>
                              </div>
                              <div className="flex justify-between items-end gap-4 pt-1">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="font-bold text-google-red uppercase text-[9px] tracking-wider">
                                    Seeking
                                  </span>
                                  <span className="text-white text-sm font-medium truncate">
                                    {swap.need}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
                                  className="cursor-pointer bg-google-blue text-white hover:bg-google-blue/90 text-xs px-4 py-2 rounded-full font-bold border-0 shadow-md transition-all shrink-0"
                                >
                                  Match
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>

              {/* Right Column: DSA Swaps */}
              <div className="bg-surface p-5 lg:p-6 rounded-[16px] border border-white/5 shadow-md flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-google-blue"></span>
                    DSA Swaps
                  </h2>
                  <span className="bg-google-blue/10 text-google-blue text-[10px] px-3 py-1 rounded-full font-bold border border-google-blue/20">
                    {swaps.filter((s) => s.category === "dsa").length} Active
                  </span>
                </div>

                {swaps.filter((s) => s.category === "dsa").length === 0 ? (
                  <p className="text-slate-500 italic bg-background p-6 rounded-[12px] border border-white/5 text-center my-auto text-xs">
                    No DSA swaps posted yet.
                  </p>
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
                          className="p-5 bg-background rounded-[16px] border border-white/5 hover:border-google-blue/20 transition-all duration-200 flex flex-col shadow-md relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-google-blue/[0.02] rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-google-blue/[0.04] transition-all"></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3">
                              <div className="min-w-0">
                                <h3 className="font-bold text-sm text-white truncate">
                                  {swap.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {swap.college} • {swap.year} Year
                                </p>
                              </div>
                              <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-white/5 text-slate-300 rounded-full border border-white/5 shadow-sm">
                                {swap.urgency}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-google-yellow font-bold mb-3.5 bg-google-yellow/5 w-fit px-2 py-0.5 rounded-full border border-google-yellow/10">
                              <span className="text-[10px]">★</span>
                              <span>{swap.rating ? (swap.rating.includes("⭐") ? swap.rating.replace("⭐", "") : swap.rating) : "5.0"}</span>
                            </div>

                            <div className="space-y-3.5 text-xs border-t border-white/5 pt-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-google-blue uppercase text-[9px] tracking-wider">
                                  Offering
                                </span>
                                <span className="text-white text-sm font-medium">
                                  {swap.offer}
                                </span>
                              </div>
                              <div className="flex justify-between items-end gap-4 pt-1">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="font-bold text-google-red uppercase text-[9px] tracking-wider">
                                    Seeking
                                  </span>
                                  <span className="text-white text-sm font-medium truncate">
                                    {swap.need}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
                                  className="cursor-pointer bg-google-blue text-white hover:bg-google-blue/90 text-xs px-4 py-2 rounded-full font-bold border-0 shadow-md transition-all shrink-0"
                                >
                                  Match
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Dynamic Match Alert Popup */}
        {incomingRequest && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface p-6 rounded-[16px] border border-white/5 max-w-sm w-full text-white shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">New Match Request</h3>

              <p className="mb-6 text-slate-400 text-sm">
                <span className="font-bold text-google-green">{incomingRequest.requesterName}</span> wants to study with you.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIncomingRequest(null)}
                  className="flex-1 px-4 py-2 bg-transparent hover:bg-white/5 text-slate-400 border border-white/5 rounded-full font-semibold transition cursor-pointer text-sm"
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
                  className="flex-1 px-4 py-2 bg-google-blue hover:bg-google-blue/90 text-white rounded-full font-semibold transition border-0 shadow-sm cursor-pointer text-sm"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
