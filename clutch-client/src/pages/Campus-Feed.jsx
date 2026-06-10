import React, { useState ,useEffect} from "react";
import FeedPost from '../components/campus-feed/Feed-post';

const CampusFeed = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  //..
  //..
  //create state for storing the posts and for backend
  //..
  const [posts,setPosts] = useState([]);
  ////..fetching post form db
  //..
  //..to update the college like
  //  the which has most post it will so on top 
  const [sidebarColleges,setSidebarColleges] = useState([]);
  //..
  //..
   const [selectedCollegeId, setSelectedCollegeId] = useState(null);//demo ke liye but i guess i would remove it jb optimazation krunga tb remove krunga

  // Recently viewed posts state
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from local storage on mount
  //...
  //...
  useEffect(() => {
    const savedHistory = localStorage.getItem('recentlyViewedPosts');
    if (savedHistory) {
      try {
        setRecentlyViewed(JSON.parse(savedHistory));
      } catch(e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Handle post click
  const handlePostClick = (post) => {
    const viewedPost = {
      id: post.id,
      title: post.title,
      viewedAt: Date.now()
    };

    setRecentlyViewed((prevHistory) => {
      const filteredHistory = prevHistory.filter(p => p.id !== post.id);
      const updatedHistory = [viewedPost, ...filteredHistory].slice(0, 5);
      localStorage.setItem('recentlyViewedPosts', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedCollegeId 
            ? `http://localhost:5000/api/feed/all?collegeId=${selectedCollegeId}` 
            : `http://localhost:5000/api/feed/all`;
                    
        fetch(url)// i will add comment later here ig i need more change here y
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts || []); 
                setSidebarColleges(data.topColleges || []); 
            });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    
    fetchPosts();
  }, [selectedCollegeId]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {/* FILTER */}
          

          {/* COLLEGE */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-3">COLLEGE</h2>
            <ul className="space-y-1">
              <li 
                onClick={() => setSelectedCollegeId(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedCollegeId === null ? 'bg-[#2d2d2d]' : 'hover:bg-[#252525]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <span className="font-medium text-gray-300">Global Feed</span>
                </div>
              </li>

              {sidebarColleges.map((college) => (
                <li 
                  key={college.id}
                  onClick={() => setSelectedCollegeId(college.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedCollegeId === college.id ? 'bg-[#2d2d2d] text-white' : 'hover:bg-[#252525] text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-indigo-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                    </div>
                    <span className="font-medium">{college.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="md:col-span-6 space-y-4">
          
          {/* AI Campus Pulse */}
          <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
            {/* <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <h3 className="text-purple-400 font-semibold">AI Campus Pulse</h3>
            </div> */}
            <p className="text-gray-300 leading-relaxed text-[15px]">
              Today's hot topics: leeeooo DBMS viva prep, Amazon internship applications open, and a heated debate about the new attendance policy. 3 doubts solved via Study Swap today.
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-medium shrink-0">
                AK
              </div>
              <div className="flex-1">
                <div  onClick={() => setIsPostModalOpen(true)}
                      className="bg-[#141414] rounded-full px-4 py-2.5 text-gray-400 border border-[#2d2d2d] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                  What's on your mind?
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

                    {/* Dynamically Rendered Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)} className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d] cursor-pointer hover:border-gray-600 transition-colors">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 font-medium shrink-0">
                    U1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-100">{post.title}</h4> {/* <-- Dynamic Title */}
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50">Post</span>
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                       {new Date(post.createdAt).toLocaleDateString()} {/* <-- Dynamic Date */}
                    </div>
                  </div>
                </div>
                
                {/* Image Rendering */}
                {post.imageUrl && (
                  <img 
                    src={`http://localhost:5000${post.imageUrl}`} 
                    alt="Post content" 
                    className="w-full max-h-96 object-cover rounded-lg mb-4 border border-[#2d2d2d]"
                  />
                )}

                {/* Content Rendering */}
                <p className="text-gray-200 text-[15px] leading-relaxed font-medium mb-4">
                  {post.content} {/* <-- Dynamic Content */}
                </p>
                
                {/* Bottom Bar (Likes/Comments) */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2d2d2d]">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-500 hover:text-indigo-400 p-1 rounded transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                      </button>
                      <span className="text-gray-400 font-medium text-sm">0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
            <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-4">RECENTLY VIEWED</h2>
            <ul className="space-y-4">
              {recentlyViewed.map((item, index) => (
                <li key={item.id} className={`flex gap-3 ${index !== 0 ? 'pt-4 border-t border-[#2d2d2d]' : ''}`}>
                  <span className="text-gray-500 font-medium">{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">Clicked recently</p>
                  </div>
                </li>
              ))}
              
              {recentlyViewed.length === 0 && (
                <p className="text-gray-500 text-sm">No recent clicks</p>
              )}
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
      {isPostModalOpen && <FeedPost onClose={() => setIsPostModalOpen(false)} />}
    </div>
  );
};

export default CampusFeed;
