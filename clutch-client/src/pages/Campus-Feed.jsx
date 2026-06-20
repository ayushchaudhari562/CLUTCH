import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import FeedPost from '../components/campus-feed/Feed-post';

const CampusFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null);

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

  //..
  //..
  //create state for storing the posts and for backend
  //..
  const [posts, setPosts] = useState([]);
  ////..fetching post form db
  //..
  //..to update the college like
  //  the which has most post it will so on top 
  const [sidebarColleges, setSidebarColleges] = useState([]);
  //..
  //..
  const [selectedCollegeId, setSelectedCollegeId] = useState(location.state?.selectedCollegeId || null);//demo ke liye but i guess i would remove it jb optimazation krunga tb remove krunga

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
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {/* COLLEGE */}
          <div className="bg-[#12141C] rounded-[12px] p-4 border border-white/5 shadow-none">
            <h2 className="text-[#6B7280] text-[11px] font-semibold tracking-wider mb-3 uppercase">COLLEGE</h2>
            <ul className="space-y-1">
              <li
                onClick={() => setSelectedCollegeId(null)}
                className={`flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors ${selectedCollegeId === null ? 'bg-emerald-500/10 text-[#10B981]' : 'hover:bg-white/5 text-[#6B7280]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#10B981]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <span className="font-medium">Global Feed</span>
                </div>
              </li>

              {sidebarColleges.map((college) => (
                <li
                  key={college.id}
                  onClick={() => setSelectedCollegeId(college.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors ${selectedCollegeId === college.id ? 'bg-emerald-500/10 text-[#10B981]' : 'hover:bg-white/5 text-[#6B7280]'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#10B981]/70">
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
          <div className="bg-[#12141C] rounded-[12px] p-5 border border-white/5 shadow-none">
            <p className="text-white leading-relaxed text-[15px]">
              Today's hot topics: leeeooo DBMS viva prep, Amazon internship applications open, and a heated debate about the new attendance policy. 3 doubts solved via Study Swap today.
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-[#12141C] rounded-[12px] p-4 border border-white/5 shadow-none">
            <div className="flex gap-3 mb-4">
              <div className="w-10 h-10 rounded-[50%] bg-emerald-500/10 flex items-center justify-center text-[#10B981] font-medium shrink-0">
                €
              </div>
              <div className="flex-1">
                <div onClick={() => setIsPostModalOpen(true)}
                  className="bg-[#090A0F] rounded-[8px] px-4 py-2.5 text-[#6B7280] border border-white/5 cursor-pointer hover:bg-emerald-500/10 hover:text-white transition-colors">
                  What's on your mind?
                </div>
              </div>
            </div>
            <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar">
              <button className="flex items-center gap-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Doubt</span>
              </button>
              <button className="flex items-center gap-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span className="text-sm font-medium">Resource</span>
              </button>
              <button className="flex items-center gap-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Meme</span>
              </button>
              <button className="flex items-center gap-2 text-[#6B7280] hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-medium">Anonymous</span>
              </button>
            </div>
          </div>

          {/* Dynamically Rendered Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} onClick={() => { navigate(`/post/${post.id}`, { state: { post } }); handlePostClick(post); }} className="bg-[#12141C] rounded-[12px] p-5 border border-white/5 cursor-pointer hover:border-[#10B981]/30 transition-colors shadow-none">
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
                      <div className="w-10 h-10 rounded-[50%] bg-emerald-500/10 flex items-center justify-center text-[#10B981] font-medium shrink-0 uppercase">
                        {anonName.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{anonName}</h4>
                          <span className="px-2.5 py-0.5 rounded-[20px] text-[11px] font-medium bg-emerald-500/10 text-[#10B981] border border-[#10B981]/20">Post</span>
                        </div>
                        <div className="text-white text-2xl font-bold mt-2 mb-1">
                          {post.title}
                        </div>
                        <div className="text-[#6B7280] text-xs mt-0.5">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Image Rendering */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl.startsWith("http") ? post.imageUrl : `${import.meta.env.VITE_API_URL}${post.imageUrl}`}
                    alt="Post content"
                    className="w-full max-h-96 object-cover rounded-[12px] mb-4 border border-white/5"
                  />
                )}

                {/* Content Rendering */}
                <p className="text-white text-[15px] leading-relaxed font-medium mb-4">
                  {post.content}
                </p>

                {/* Bottom Bar (Likes/Comments) */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handlePostLike(post.id, e)}
                        className={`p-1 rounded transition-colors cursor-pointer ${post.likes && dbUser && post.likes.some(like => like.userId === dbUser.id)
                          ? "text-[#10B981] hover:text-[#10B981]/80"
                          : "text-[#6B7280] hover:text-white"
                          }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                      </button>
                      <span className="text-[#6B7280] font-medium text-sm">
                        {post.likes ? post.likes.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 space-y-6">

          <div className="bg-[#12141C] rounded-[12px] p-4 border border-white/5 shadow-none">
            <h2 className="text-[#6B7280] text-[11px] font-semibold tracking-wider mb-4 uppercase">RECENTLY VIEWED</h2>
            <ul className="space-y-4">
              {recentlyViewed.map((item, index) => (
                <li key={item.id} className={`flex gap-3 ${index !== 0 ? 'pt-4 border-t border-white/5' : ''}`}>
                  <span className="text-[#6B7280] font-medium">{index + 1}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-[#6B7280] text-xs mt-0.5">Clicked recently</p>
                  </div>
                </li>
              ))}

              {recentlyViewed.length === 0 && (
                <p className="text-[#6B7280] text-sm">No recent clicks</p>
              )}
            </ul>
          </div>

          {/* ACTIVE NOW */}
          <div className="bg-[#12141C] rounded-[12px] p-4 border border-white/5 shadow-none">
            <h2 className="text-[#6B7280] text-[11px] font-semibold tracking-wider mb-4 uppercase">ACTIVE NOW</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-[50%] bg-[#10B981] shadow-none"></span>
              <span className="text-white text-sm font-medium">{Math.floor(Math.random() * 10) + 11} students online</span>
            </div>
            <p className="text-[#6B7280] text-xs ml-4.5">{Math.floor(Math.random() * 5) + 5} from your college</p>
          </div>
        </div>

      </div>
      {isPostModalOpen && <FeedPost onClose={() => setIsPostModalOpen(false)} />}
    </div>
  );
};

export default CampusFeed;
