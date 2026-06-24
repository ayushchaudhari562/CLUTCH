import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import FeedPost from '../components/campus-feed/Feed-post';
import { Sparkles, MessageSquare, AlertCircle, HelpCircle, FileText, Smile, Eye } from "lucide-react";

const CampusFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [sidebarColleges, setSidebarColleges] = useState([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState(location.state?.selectedCollegeId || null);

  // Recently viewed posts state
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const savedHistory = localStorage.getItem('recentlyViewedPosts');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Error fetching database user details:", err));
    }
  }, [user]);

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

  const handlePostLike = async (postId, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to upvote posts!");
      return;
    }
    if (!dbUser) {
      alert("User profile loading, please wait.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/post/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id })
      });
      const data = await response.json();
      if (response.ok) {
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p.id === parseInt(postId)) {
              let updatedLikes = [...(p.likes || [])];
              if (data.liked) {
                updatedLikes.push({ userId: dbUser.id, postId: p.id });
              } else {
                updatedLikes = updatedLikes.filter(like => like.userId !== dbUser.id);
              }
              return { ...p, likes: updatedLikes };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("Failed to toggle post like:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = selectedCollegeId
          ? `${import.meta.env.VITE_API_URL}/api/feed/all?collegeId=${selectedCollegeId}`
          : `${import.meta.env.VITE_API_URL}/api/feed/all`;

        fetch(url)
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
    <div className="min-h-screen bg-background text-white px-4 md:px-6 lg:px-12 pt-28 pb-12 font-sans">
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: NAVIGATION & FILTERING */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-[16px] p-4 border border-white/5 shadow-md">
            <h2 className="text-slate-400 text-[10px] font-bold tracking-widest mb-3.5 uppercase">COLLEGES</h2>
            <ul className="space-y-1">
              <li
                onClick={() => setSelectedCollegeId(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                  selectedCollegeId === null 
                    ? 'bg-google-blue/12 text-google-blue font-semibold' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={selectedCollegeId === null ? 'text-google-blue' : 'text-slate-500'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold">Global Feed</span>
                </div>
              </li>

              {sidebarColleges.map((college) => (
                <li
                  key={college.id}
                  onClick={() => setSelectedCollegeId(college.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                    selectedCollegeId === college.id 
                      ? 'bg-google-blue/12 text-google-blue font-semibold' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={selectedCollegeId === college.id ? 'text-google-blue' : 'text-slate-500 shrink-0'}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                      </svg>
                    </div>
                    <span className="text-xs font-semibold truncate">{college.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MIDDLE COLUMN: POST LIST & INPUTS */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* AI Campus Pulse (Linear style callout) */}
          <div className="bg-google-blue/5 rounded-[16px] p-5 border border-google-blue/15 shadow-sm flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-google-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-google-blue uppercase tracking-widest">Campus Pulse</span>
              <p className="text-white text-xs leading-relaxed font-medium">
                Today's hot topics: leeeooo DBMS viva prep, Amazon internship applications open, and a heated debate about the new attendance policy. 3 doubts solved via Study Swap today.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-surface rounded-[16px] p-4 border border-white/5 shadow-md space-y-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-google-green/10 flex items-center justify-center text-google-green text-sm font-bold shrink-0">
                €
              </div>
              <div className="flex-1">
                <div 
                  onClick={() => setIsPostModalOpen(true)}
                  className="bg-background rounded-full px-4 py-2 text-slate-500 hover:text-slate-300 border border-white/5 cursor-pointer hover:border-google-blue/30 transition-all text-xs flex items-center h-[36px]"
                >
                  What's on your mind?
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 px-1 overflow-x-auto no-scrollbar pt-1 border-t border-white/5">
              <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                <HelpCircle className="w-4 h-4 text-google-blue" />
                <span>Doubt</span>
              </button>
              <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                <FileText className="w-4 h-4 text-google-green" />
                <span>Resource</span>
              </button>
              <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                <Smile className="w-4 h-4 text-google-yellow" />
                <span>Meme</span>
              </button>
              <button onClick={() => setIsPostModalOpen(true)} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                <Eye className="w-4 h-4 text-google-red" />
                <span>Anonymous</span>
              </button>
            </div>
          </div>

          {/* Dynamically Rendered Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => { navigate(`/post/${post.id}`, { state: { post } }); handlePostClick(post); }} 
                className="bg-surface rounded-[16px] p-5 border border-white/5 cursor-pointer hover:border-white/10 transition-all duration-200 shadow-md flex flex-col justify-between"
              >
                {(() => {
                  const getAnonymousName = (user) => {
                    const animals = ["Anon", "Beluga", "Owl", "Tiger", "Panda", "Fox", "Hawk", "Wolf", "Bear", "Koala", "Rabbit"];
                    const id = user?.id || 0;
                    const animal = animals[id % animals.length];
                    return `${animal}${id}`;
                  };
                  const anonName = getAnonymousName(post.author);
                  return (
                    <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-google-blue/10 flex items-center justify-center text-google-blue font-bold text-sm shrink-0 uppercase border border-google-blue/20">
                        {anonName.substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-sm truncate">{anonName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-google-green/10 text-google-green border border-google-green/20 uppercase tracking-wider shrink-0">
                            Post
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Post Title */}
                <h3 className="text-lg font-extrabold text-white mb-2 leading-tight tracking-tight">
                  {post.title}
                </h3>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="rounded-[12px] overflow-hidden mb-4 border border-white/5 bg-background max-h-96">
                    <img
                      src={post.imageUrl.startsWith("http") ? post.imageUrl : `${import.meta.env.VITE_API_URL}${post.imageUrl}`}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-4">
                  {post.content}
                </p>

                {/* Bottom Bar: Likes and Replies stats */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handlePostLike(post.id, e)}
                      className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold border ${
                        post.likes && dbUser && post.likes.some(like => like.userId === dbUser.id)
                          ? "bg-google-green/10 border-google-green/20 text-google-green"
                          : "bg-background border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                      </svg>
                      <span>{post.likes ? post.likes.length : 0}</span>
                    </button>
                  </div>
                  
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open discussion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENTLY VIEWED & ACTIVE */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Recently Viewed */}
          <div className="bg-surface rounded-[16px] p-4 border border-white/5 shadow-md">
            <h2 className="text-slate-400 text-[10px] font-bold tracking-widest mb-4 uppercase">RECENTLY VIEWED</h2>
            <ul className="space-y-4">
              {recentlyViewed.map((item, index) => (
                <li key={item.id} className={`flex gap-3 ${index !== 0 ? 'pt-4 border-t border-white/5' : ''}`}>
                  <span className="text-slate-500 font-extrabold text-sm">{index + 1}</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs truncate hover:underline cursor-pointer">{item.title}</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Clicked recently</p>
                  </div>
                </li>
              ))}

              {recentlyViewed.length === 0 && (
                <p className="text-slate-500 text-xs italic">No recent clicks</p>
              )}
            </ul>
          </div>

          {/* Active Now widget */}
          <div className="bg-surface rounded-[16px] p-4 border border-white/5 shadow-md">
            <h2 className="text-slate-400 text-[10px] font-bold tracking-widest mb-4 uppercase">ACTIVE NOW</h2>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-google-green shadow-[0_0_8px_1px_rgba(52,168,83,0.3)] shrink-0 animate-pulse"></span>
              <span className="text-white text-xs font-bold">19 students online</span>
            </div>
            <p className="text-slate-500 text-[10px] ml-5">9 from your college</p>
          </div>
        </div>

      </div>
      {isPostModalOpen && <FeedPost onClose={() => setIsPostModalOpen(false)} />}
    </div>
  );
};

export default CampusFeed;
