import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, MessageSquare, Calendar } from "lucide-react";

const Profile = () => {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [commentLikesCount, setCommentLikesCount] = useState(0);
  const [postLikesCount, setPostLikesCount] = useState(0);
  const [editingCollege, setEditingCollege] = useState(false);
  const [collegeInput, setCollegeInput] = useState('');
  const [year, setYear] = useState('1st');

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
            setCollegeInput(data.collegeName || '');
          }
        })
        .catch(err => console.error("Error fetching db user details inside Profile:", err));
    }
  }, [user]);

  // Fetch all posts then filter posts authored by this DB user
  useEffect(() => {
    if (!dbUser) return;
    (async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_API_URL + '/api/feed/all');
        const json = await resp.json();
        const allPosts = json.posts || [];

        const myPosts = allPosts.filter(p => p.author && (p.author.clerkId === user.id || p.authorId === dbUser.id));
        setUserPosts(myPosts);

        const postsLikes = myPosts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);
        setPostLikesCount(postsLikes);

        // fetch comments authored by this db user to compute comment likes
        const cResp = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/user/${dbUser.id}`);
        if (cResp.ok) {
          const userComments = await cResp.json();
          const cLikes = userComments.reduce((s, c) => s + (c.likesCount || 0), 0);
          setCommentLikesCount(cLikes);
        }
      } catch (err) {
        console.error('Error loading posts/comments for profile:', err);
      }
    })();
  }, [dbUser, user]);

  const totalLikes = postLikesCount + commentLikesCount;
  const fullName = user ? (user.fullName || user.username) : "Student";

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  const initials = getInitials(fullName);

  const saveCollege = async () => {
    if (!user) return;
    try {
      const resp = await fetch(import.meta.env.VITE_API_URL + '/api/save-college', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkId: user.id, collegeName: collegeInput })
      });
      if (resp.ok) {
        const data = await resp.json();
        setDbUser(data.user || data);
        setEditingCollege(false);
      } else {
        alert('Failed to save college');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving college');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-white px-4 md:px-6 lg:px-12 pt-28 pb-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Profile Summary */}
        <motion.aside 
          className="lg:col-span-4 bg-surface p-6 rounded-[16px] border border-white/5 shadow-md flex flex-col items-center" 
          initial={{ opacity: 0, x: -15 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center text-center gap-4.5 w-full">
            {user && user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={fullName} 
                className="w-24 h-24 rounded-full object-cover border border-white/5 shadow-md" 
              />
            ) : (
              <div className="w-24 h-24 bg-google-blue/10 text-google-blue rounded-full flex items-center justify-center text-2xl font-extrabold border border-google-blue/20">
                {initials}
              </div>
            )}

            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white tracking-tight">{fullName}</h1>
              <p className="text-xs text-slate-400 font-semibold">{dbUser?.collegeName || 'No college selected'}</p>
            </div>

            {/* Total Likes Badge */}
            <div className="bg-background rounded-[12px] p-4 text-center border border-white/5 w-full flex items-center justify-center gap-3">
              <Award className="w-5 h-5 text-google-yellow" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reputation Likes</span>
                <motion.span 
                  className="text-lg font-extrabold text-google-yellow" 
                  key={totalLikes} 
                  initial={{ scale: 0.95, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {totalLikes}
                </motion.span>
              </div>
            </div>

            {/* Profile Settings Fields */}
            <div className="w-full flex flex-col gap-3.5 pt-2 border-t border-white/5">
              {editingCollege ? (
                <div className="flex flex-col gap-2">
                  <input 
                    value={collegeInput} 
                    onChange={(e) => setCollegeInput(e.target.value)} 
                    className="w-full bg-background px-3.5 py-2.5 rounded-full border border-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-google-blue" 
                    placeholder="Enter college name"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingCollege(false)} 
                      className="flex-1 px-4 py-2 bg-transparent text-slate-400 border border-white/5 rounded-full text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveCollege} 
                      className="flex-1 px-4 py-2 bg-google-blue hover:bg-google-blue/90 text-white rounded-full text-[10px] font-bold border-0"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingCollege(true)} 
                  className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold border border-white/5 cursor-pointer transition-colors"
                >
                  Edit College
                </button>
              )}

              <div className="flex items-center justify-between px-4 py-2 bg-background border border-white/5 rounded-full text-xs text-slate-400">
                <span className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-google-blue" />
                  Academic Year
                </span>
                <select 
                  value={year} 
                  onChange={(e) => setYear(e.target.value)} 
                  className="bg-transparent border-0 text-white font-bold cursor-pointer focus:outline-none"
                >
                  <option className="bg-surface text-white">1st</option>
                  <option className="bg-surface text-white">2nd</option>
                  <option className="bg-surface text-white">3rd</option>
                  <option className="bg-surface text-white">4th</option>
                </select>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Right Content Column: Stats & Post Listing */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* Stats widgets Banner */}
          <motion.div 
            className="bg-surface p-5 rounded-[16px] border border-white/5 shadow-md space-y-4"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.05 }}
          >
            <h3 className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">ACCOUNT ACTIVITY</h3>
            <div className="grid grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -2 }} className="p-4 bg-background border border-white/5 rounded-[12px] text-center flex flex-col justify-center items-center gap-1">
                <BookOpen className="w-4 h-4 text-google-blue" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Posts</span>
                <span className="text-xl font-extrabold text-white">{userPosts.length}</span>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }} className="p-4 bg-background border border-white/5 rounded-[12px] text-center flex flex-col justify-center items-center gap-1">
                <Heart className="w-4 h-4 text-google-green" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Likes Recd</span>
                <span className="text-xl font-extrabold text-google-green">{totalLikes}</span>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }} className="p-4 bg-background border border-white/5 rounded-[12px] text-center flex flex-col justify-center items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Comments</span>
                <span className="text-xl font-extrabold text-slate-500">—</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Posts History list */}
          <motion.div 
            className="bg-surface p-5 rounded-[16px] border border-white/5 shadow-md flex flex-col min-h-[300px]" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-4">POSTS BY YOU</h3>
            
            {userPosts.length === 0 ? (
              <div className="text-slate-500 text-xs italic my-auto text-center py-6 bg-background rounded-[12px] border border-white/5">
                No posts authored yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
                {userPosts.map((p, idx) => (
                  <motion.div 
                    key={p.id} 
                    className="flex items-center justify-between bg-background p-4 rounded-[12px] border border-white/5 hover:border-google-blue/30 transition-all duration-200" 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.03 }}
                  >
                    <div className="min-w-0 pr-4">
                      <h4 className="font-bold text-white text-xs truncate">{p.title}</h4>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/5 px-3 py-1 rounded-full shrink-0 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-google-green" />
                      <span>{p.likes ? p.likes.length : 0}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Profile;