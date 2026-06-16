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
      targetSocketId: swap.socketId,
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
      <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans space-y-8 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center border-b border-white/5 pb-6"
        >
          <section className="text-lg font-semibold text-white">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#6B7280]">
              {getGreeting()}, {user?.firstName || "Student"}!
            </h1>

            <p className="text-sm text-[#6B7280] mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#10b981]" />
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" • "}
              {currentTime.toLocaleTimeString()}
            </p>
          </section>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-4 items-center"
        >
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] px-5 py-3 shadow-lg">
            <Flame className="text-orange-500 w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-[#6B7280] text-[11px] uppercase tracking-wider font-semibold">Session Streak</span>
              <span className="text-white font-bold text-sm">{session}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] px-5 py-3 shadow-lg">
            <Flame className="text-red-500 w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-[#6B7280] text-[11px] uppercase tracking-wider font-semibold">Day Streak</span>
              <span className="text-white font-bold text-sm">{session}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-[12px] px-5 py-3 shadow-lg">
            <GraduationCap className="text-[#10b981] w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-[#6B7280] text-[11px] uppercase tracking-wider font-semibold">College</span>
              <span className="text-white font-bold text-sm truncate max-w-[800px]">{userCollege}</span>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-[12px] font-bold shadow-none transition-colors ml-auto"
          >
            <ShieldAlert className="w-5 h-5" />
            SOS
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/study-swap")}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-black border-0 px-6 py-3 rounded-[12px] font-bold shadow-lg shadow-[#10b981]/20 cursor-pointer transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Post Swap
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-[#6B7280] text-xs font-bold tracking-[2px] mb-6 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            Recent Swap Requests
          </h2>
          
          {swaps.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[16px] border border-white/10 text-center shadow-lg">
              <PlusCircle className="w-12 h-12 text-[#6B7280] mx-auto mb-4 opacity-50" />
              <p className="text-[#6B7280] font-medium">No swap requests posted yet.</p>
              <p className="text-sm text-[#6B7280] mt-1">Be the first to post a study swap!</p>
            </div>
          ) : (
            <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Skill Swaps */}
              <div className="bg-[#0E1115]/80 backdrop-blur-md p-6 lg:p-8 rounded-[20px] border border-white/5 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h2 className="text-[13px] font-bold text-white tracking-widest uppercase">Skill Swaps</h2>
                  <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                    {swaps.filter((s) => s.category === "skill").length} Active
                  </span>
                </div>

                  {swaps.filter((s) => s.category === "skill").length === 0 ? (
                  <p className="text-[#6B7280] italic bg-[#0E1115] p-6 rounded-[12px] border border-white/5 text-center my-auto">
                    No skill swaps posted yet.
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
                          className="p-6 bg-[#0E1115] rounded-[16px] border border-white/5 hover:border-emerald-500/40 transition-all duration-300 flex flex-col shadow-lg relative overflow-hidden group"
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
                                <span className="font-bold text-[#10b981] uppercase text-[10px] tracking-widest block mb-1.5">
                                  Offering
                                </span>
                                <span className="text-white text-base font-medium block">
                                  {swap.offer}
                                </span>
                              </div>
                              <div className="flex justify-between items-end pt-2">
                                <div>
                                  <span className="font-bold text-[#f87171] uppercase text-[10px] tracking-widest block mb-1.5">
                                    Seeking
                                  </span>
                                  <span className="text-white text-base font-medium block">
                                    {swap.need}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
                                  className="cursor-pointer bg-white text-black hover:bg-slate-200 text-sm px-6 py-2.5 rounded-[10px] font-bold border-0 shadow-lg transition-all tracking-wide"
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
              <div className="bg-[#0E1115]/80 backdrop-blur-md p-6 lg:p-8 rounded-[20px] border border-white/5 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <h2 className="text-[13px] font-bold text-white tracking-widest uppercase">DSA Swaps</h2>
                  <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                    {swaps.filter((s) => s.category === "dsa").length} Active
                  </span>
                </div>

                {swaps.filter((s) => s.category === "dsa").length === 0 ? (
                  <p className="text-[#6B7280] italic bg-[#0E1115] p-6 rounded-[12px] border border-white/5 text-center my-auto">
                    No DSA swaps posted yet.
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
                          className="p-6 bg-[#0E1115] rounded-[16px] border border-white/5 hover:border-[#3b82f6]/40 transition-all duration-300 flex flex-col shadow-lg relative overflow-hidden group"
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
                                <span className="font-bold text-[#3b82f6] uppercase text-[10px] tracking-widest block mb-1.5">
                                  Offering
                                </span>
                                <span className="text-white text-base font-medium block">
                                  {swap.offer}
                                </span>
                              </div>
                              <div className="flex justify-between items-end pt-2">
                                <div>
                                  <span className="font-bold text-[#f87171] uppercase text-[10px] tracking-widest block mb-1.5">
                                    Seeking
                                  </span>
                                  <span className="text-white text-base font-medium block">
                                    {swap.need}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
                                  className="cursor-pointer bg-white text-black hover:bg-slate-200 text-sm px-6 py-2.5 rounded-[10px] font-bold border-0 shadow-lg transition-all tracking-wide"
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

        <footer className="max-w-[900px] mx-auto pt-4">

        </footer>

        {/* The Match Request Popup */}
        {incomingRequest && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0E1115] p-6 rounded-[12px] border border-[#2e332e] max-w-sm w-full text-white shadow-none">
              <h3 className="text-lg font-bold text-white mb-2">New Match Request</h3>

              <p className="mb-6 text-[#6B7280]">
                <span className="font-semibold text-[#007666]">{incomingRequest.requesterName}</span> wants to study with you.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIncomingRequest(null)}
                  className="flex-1 px-4 py-2 bg-transparent hover:bg-white/5 text-[#6B7280] border border-[#2e332e] rounded-[8px] font-semibold transition cursor-pointer"
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
    </>
  );
};

export default Home;
