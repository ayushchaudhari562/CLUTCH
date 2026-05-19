import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import studyRoom from "./StudyRoom";

const StudySwap = ({ swaps = [], addSwap }) => {
  // const [show, setShow] = useState("");
  const [offer, setOffer] = useState("");
  const [need, setNeed] = useState("");
  const [urgency, setUrgency] = useState("");
  const [dsa, setDsa] = useState("");

  const navigate = useNavigate();

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
      name: "Sarthak Bihari",
      college: "IIIT",
      year: "2nd",
      rating: "1.4⭐",
      offer: offer,
      need: need,
      urgency: urgencyMap[urgency] || "Flexible",
      category: dsa === "1" ? "skill" : "dsa",
    };

    addSwap(newSwapObj);

    setOffer("");
    setNeed("");
    setUrgency("");
  };
  return (
    <>
      <h1 className="m-5 text-xl font-semibold text-center">
        What you need / What you offer
      </h1>
      <div className="flex row-auto p-3">
        <input
          type="text"
          placeholder="What you offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          className="rounded-lg border-2 border-blue-500 p-3 m-2 w-full"
        />

        <input
          type="text"
          placeholder="What you need"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          className="rounded-lg border-2 border-red-500 p-3 m-2 w-full"
        />
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          className="rounded-md border border-blue-500 bg-white p-3 m-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select urgency</option>
          <option value="1">Today</option>
          <option value="2">Tomorrow</option>
          <option value="3">Next Week</option>
        </select>
        <select
          value={dsa}
          onChange={(e) => setDsa(e.target.value)}
          className="rounded-md border border-blue-500 bg-white p-3 m-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Swap</option>
          <option value="1">Skill Swap</option>
          <option value="2">DSA-Swap</option>
        </select>
        <button
          onClick={handlePost}
          className="rounded-lg border-2 border-red-500 px-4 py-2 hover:bg-red-50"
        >
          Post Swap
        </button>
      </div>{" "}
      <div className="m-5 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Skill Swaps */}
        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-blue-200 pb-3">
            <h2 className="text-xl font-bold text-blue-900">Skill Swaps</h2>
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              {swaps.filter((s) => s.category === "skill").length} Active
            </span>
          </div>
          {swaps.filter((s) => s.category === "skill").length === 0 ? (
            <p className="text-gray-500 italic bg-white p-6 rounded-xl border border-blue-100 text-center shadow-sm my-auto">
              No skill swaps posted yet. Use the form above to post the first
              one!
            </p>
          ) : (
            <div className="space-y-4">
              {swaps
                .filter((s) => s.category === "skill")
                .map((swap) => (
                  <div
                    key={swap.id}
                    className="p-5 bg-white shadow-sm rounded-xl border border-blue-100 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {swap.urgency}
                        </span>
                      </div>
                      <div className="text-sm text-amber-600 font-medium mb-4">
                        {swap.rating}
                      </div>
                      <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                        <p className="flex flex-col">
                          <span className="font-semibold text-blue-600 uppercase text-xs tracking-wider">
                            Offering
                          </span>
                          <span className="text-gray-700 mt-0.5">
                            {swap.offer}
                          </span>
                        </p>
                        <p className="flex flex-col pt-1">
                          <span className="font-semibold text-red-600 uppercase text-xs tracking-wider">
                            Seeking
                          </span>
                          <span className="text-gray-700 mt-0.5">
                            {swap.need}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column: DSA Swaps */}
        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-purple-200 pb-3">
            <h2 className="text-xl font-bold text-purple-900">DSA Swaps</h2>
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              {swaps.filter((s) => s.category === "dsa").length} Active
            </span>
          </div>
          {swaps.filter((s) => s.category === "dsa").length === 0 ? (
            <p className="text-gray-500 italic bg-white p-6 rounded-xl border border-purple-100 text-center shadow-sm my-auto">
              No DSA swaps posted yet. Use the form above to post the first one!
            </p>
          ) : (
            <div className="space-y-4">
              {swaps
                .filter((s) => s.category === "dsa")
                .map((swap) => (
                  <div
                    key={swap.id}
                    className="p-5 bg-white shadow-sm rounded-xl border border-purple-100 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {swap.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {swap.college} • {swap.year} Year
                          </p>
                        </div>
                        <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                          {swap.urgency}
                        </span>
                      </div>
                      <div className="text-sm text-amber-600 font-medium mb-4">
                        {swap.rating}
                      </div>
                      <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                        <p className="flex flex-col">
                          <span className="font-semibold text-blue-600 uppercase text-xs tracking-wider">
                            Offering
                          </span>
                          <span className="text-gray-700 mt-0.5">
                            {swap.offer}
                          </span>
                        </p>
                        <p className="flex flex-col pt-1">
                          <span className="flex font-semibold text-red-600 uppercase text-xs tracking-wider gap-[340px]">
                            Seeking
                            <button onClick={()=> navigate('/study-room')} className="cursor-pointer  bg-purple-600 text-white text-xs px-6 py-3 rounded-full font-semibold shadow-sm">Match</button>

                          </span>
                          <span className="text-gray-700 mt-0.5">
                            {swap.need}

                          </span>
                        </p>
                      </div>
                      
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default StudySwap;
