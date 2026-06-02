import React, { useState } from "react";

const CampusFeed = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {/* FILTER */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-3">FILTER</h2>
            <ul className="space-y-1">
              {/* Active Item */}
              <li className="flex items-center justify-between bg-[#2d2d2d] px-3 py-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-purple-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> */}
                  </div>
                  <span className="font-medium">NIT baddies aka Jalandhar</span>
                </div>
                <span className="text-gray-400 text-sm">48</span>
              </li>
              {/* Other Items... */}
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-blue-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                  </div>
                  <span className="font-medium text-gray-300">IIT Indore</span>
                </div>
                <span className="text-gray-400 text-sm">84</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-cyan-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> */}
                  </div>
                  <span className="font-medium text-gray-300">IIIT Nagpur</span>
                </div>
                <span className="text-gray-400 text-sm">61</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-indigo-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> */}
                  </div>
                  <span className="font-medium text-gray-300">IIIT Gwalior</span>
                </div>
                <span className="text-gray-400 text-sm">43</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-pink-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> */}
                  </div>
                  <span className="font-medium text-gray-300">IIT BHU</span>
                </div>
                <span className="text-gray-400 text-sm">37</span>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-red-400">
                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg> */}
                  </div>
                  <span className="font-medium text-gray-300">Rants</span>
                </div>
                <span className="text-gray-400 text-sm">23</span>
              </li>
            </ul>
          </div>

          {/* COLLEGE */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-3">COLLEGE</h2>
            <ul className="space-y-1">
               <li className="flex items-center justify-between bg-[#2d2d2d] px-3 py-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-indigo-400">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                  </div>
                  <span className="font-medium">My College</span>
                </div>
              </li>
              <li className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-[#252525] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <span className="font-medium text-gray-300">All Colleges</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="md:col-span-6 space-y-4">
          
          {/* AI Campus Pulse */}
          <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <h3 className="text-purple-400 font-semibold">AI Campus Pulse</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-[15px]">
              Today's hot topics: DBMS viva prep, Amazon internship applications open, and a heated debate about the new attendance policy. 3 doubts solved via Study Swap today.
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-medium shrink-0">
                AK
              </div>
              <div className="flex-1">
                <div className="bg-[#141414] rounded-full px-4 py-2.5 text-gray-400 border border-[#2d2d2d] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                  <input type="text" name="" id="" placeholder="What's on your mind?" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar">
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Doubt</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="text-sm font-medium">Resource</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Meme</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Anonymous</span>
              </button>
            </div>
          </div>

          {/* Post 1 */}
          <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-medium shrink-0">
                RS
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-100">Rahul Sharma</h4>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">Doubt</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs ml-auto bg-[#2d2d2d] px-2 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
                    <span>IIIT Allahabad</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                  3rd Year CSE • 12 mins ago
                </div>
              </div>
            </div>
            <p className="text-gray-200 text-[15px] leading-relaxed font-medium mb-4">
              Can someone explain the difference between 2NF and 3NF with a real example? My DBMS viva is tomorrow and I keep getting confused between partial and transitive dependency 😭
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2d2d2d]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <button className="text-indigo-400 hover:bg-indigo-400/10 p-1 rounded transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  </button>
                  <span className="text-indigo-400 font-medium text-sm">24</span>
                  <button className="text-gray-500 hover:text-gray-400 hover:bg-[#2d2d2d] p-1 rounded transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  </button>
                </div>
                <button className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span className="text-sm">8 replies</span>
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                Find Swap Partner
              </button>
            </div>
          </div>

          {/* Post 2 */}
          <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-300 font-medium shrink-0">
                PK
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-100">Priya K</h4>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">Resource</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs ml-auto bg-[#2d2d2d] px-2 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path></svg>
                    <span>IIIT Allahabad</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xs mt-0.5">
                  4th Year CSE • 1 hr ago
                </div>
              </div>
            </div>
            <p className="text-gray-200 text-[15px] leading-relaxed font-medium mb-4">
              Dropping last 5 years CN PYQs with solutions — filtered by unit. Saved me 2 days of searching, hope it helps you guys too 🙏
            </p>
            <div className="flex justify-center -mt-2">
                <div className="w-8 h-8 rounded-full bg-[#2d2d2d] flex items-center justify-center text-gray-400 border border-[#3d3d3d] cursor-pointer hover:bg-[#3d3d3d] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {/* TRENDING TODAY */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-4">TRENDING TODAY</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-gray-500 font-medium">1</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">DBMS viva prep</h4>
                  <p className="text-gray-500 text-xs mt-0.5">24 posts</p>
                </div>
              </li>
              <li className="flex gap-3 pt-4 border-t border-[#2d2d2d]">
                <span className="text-gray-500 font-medium">2</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Amazon internship</h4>
                  <p className="text-gray-500 text-xs mt-0.5">18 posts</p>
                </div>
              </li>
              <li className="flex gap-3 pt-4 border-t border-[#2d2d2d]">
                <span className="text-gray-500 font-medium">3</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">Attendance policy</h4>
                  <p className="text-gray-500 text-xs mt-0.5">15 posts</p>
                </div>
              </li>
              <li className="flex gap-3 pt-4 border-t border-[#2d2d2d]">
                <span className="text-gray-500 font-medium">4</span>
                <div>
                  <h4 className="font-semibold text-gray-200 text-sm">CN PYQs dropped</h4>
                  <p className="text-gray-500 text-xs mt-0.5">11 posts</p>
                </div>
              </li>
            </ul>
          </div>

          {/* ACTIVE NOW */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-4">ACTIVE NOW</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-gray-200 text-sm font-medium">142 students online</span>
            </div>
            <p className="text-gray-400 text-xs ml-4.5">23 from your college</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampusFeed;
