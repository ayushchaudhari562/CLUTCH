import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import socket from "../socket/socket";

const Home = ({ swaps = [] }) => {
  const { user } = useUser();
  const [session] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userCollege, setUserCollege] = useState("Loading...");
  const [incomingRequest, setIncomingRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/user/${user.id}`)
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
      requesterName: user ? user.fullName || "Clutch User" : "Users--requesting"
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
      <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans space-y-6">
        <div className="flex items-center border-b border-white/5 pb-4">
          <section className="text-lg font-semibold text-white">
            <h1 className="text-2xl font-bold">{getGreeting()}</h1>

            <p className="text-sm text-[#6B7280] mt-1">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <p className="text-sm text-[#6B7280] mt-0.5">
              {currentTime.toLocaleTimeString()}
            </p>
          </section>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-[#12141C] border border-white/5 rounded-[8px] px-4 py-2 text-[#6B7280] text-sm">
            Session Streak: <span className="text-white font-medium">{session}</span>
          </div>
          <div className="bg-[#12141C] border border-white/5 rounded-[8px] px-4 py-2 text-[#6B7280] text-sm">
            Day Streak: <span className="text-white font-medium">{session}</span>
          </div>
          <div className="bg-[#12141C] border border-white/5 rounded-[8px] px-4 py-2 text-[#6B7280] text-sm">
            College: <span className="font-semibold text-[#10b981]">{userCollege}</span>
          </div>
          <button className="cursor-pointer bg-[#10b981] hover:bg-[#059669] text-black text-xs px-6 py-2 rounded-[8px] font-semibold border-0 shadow-none transition-colors">
            SOS
          </button>
          <button
            onClick={() => navigate("/study-swap")}
            className="bg-transparent hover:bg-white/5 text-[#ccc] border border-[#3a3d3a] px-[22px] py-[10px] rounded-[8px] text-[13px] font-medium transition-colors shadow-none cursor-pointer"
          >
            Post a swap request
          </button>
        </div>

        <div>
          <h2 className="text-[#6B7280] text-[11px] font-semibold tracking-wider mb-4 uppercase">
            Recent Swap Requests
          </h2>
          {swaps.length === 0 ? (
            <p className="text-[#6B7280] italic bg-[#12141C] p-6 rounded-[12px] border border-white/5 text-center shadow-none">
              No swap requests posted yet.
            </p>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Skill Swaps */}
              <div className="bg-[#12141C] p-6 rounded-[12px] border border-white/5 shadow-none flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
                  <h2 className="text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">Skill Swaps</h2>
                  <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-0.5 rounded-[20px] font-medium border border-emerald-500/20">
                    {swaps.filter((s) => s.category === "skill").length} Active
                  </span>
                </div>

                {swaps.filter((s) => s.category === "skill").length === 0 ? (
                  <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center shadow-none my-auto">
                    No skill swaps posted yet.
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
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
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
                  <h2 className="text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase">DSA Swaps</h2>
                  <span className="bg-emerald-500/10 text-[#10b981] text-[11px] px-3 py-0.5 rounded-[20px] font-medium border border-emerald-500/20">
                    {swaps.filter((s) => s.category === "dsa").length} Active
                  </span>
                </div>

                {swaps.filter((s) => s.category === "dsa").length === 0 ? (
                  <p className="text-[#6B7280] italic bg-[#090A0F] p-6 rounded-[12px] border border-white/5 text-center shadow-none my-auto">
                    No DSA swaps posted yet.
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
                                  onClick={(e) => { e.stopPropagation(); handleMatch(swap); }}
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
          )}
        </div>

        <footer className="max-w-[900px] mx-auto pt-4">

        </footer>

        {/* The Match Request Popup */}
        {incomingRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#222622] p-6 rounded-[12px] border border-[#2e332e] max-w-sm w-full text-white shadow-none">
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
