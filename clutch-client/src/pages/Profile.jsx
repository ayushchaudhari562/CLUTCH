import { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { motion } from 'framer-motion';

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
    <div className="min-h-screen w-full bg-[#090A0F] text-white p-4 md:p-6 lg:px-12 font-sans">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile summary */}
        <motion.aside className="lg:col-span-4 bg-[#0E1115] p-6 rounded-2xl border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <div className="flex flex-col items-center text-center gap-4">
            {user && user.imageUrl ? (
              <img src={user.imageUrl} alt={fullName} className="w-28 h-28 rounded-full object-cover border border-emerald-500/20" />
            ) : (
              <div className="w-28 h-28 bg-emerald-500/10 text-[#10B981] rounded-full flex items-center justify-center text-3xl font-bold border border-emerald-500/20">{initials}</div>
            )}

            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-sm text-[#6B7280]">{dbUser?.collegeName || 'No college selected'}</p>

            <div className="mt-4 w-full">
              <div className="text-sm text-[#6B7280]">Total Likes</div>
              <motion.div className="text-3xl font-bold text-[#10B981]" key={totalLikes} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 220 }}>{totalLikes}</motion.div>
            </div>

            <div className="mt-5 w-full flex flex-col gap-3">
              {editingCollege ? (
                <div className="flex gap-2">
                  <input value={collegeInput} onChange={(e)=>setCollegeInput(e.target.value)} className="flex-1 bg-[#090A0F] px-4 py-2 rounded-full border border-white/5 text-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20" />
                  <button onClick={saveCollege} className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-medium transition-colors duration-200">Save</button>
                </div>
              ) : (
                <div className="flex gap-2 justify-center">
                  <button onClick={()=>setEditingCollege(true)} className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-medium transition-colors duration-200">Edit College</button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-[#6B7280]">
                <label>Year:</label>
                <select value={year} onChange={(e)=>setYear(e.target.value)} className="bg-[#090A0F] border border-white/5 px-4 py-1.5 rounded-full text-white focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/20">
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Right: Posts and activity (full height, scrollable) */}
        <main className="lg:col-span-8">
          <motion.div className="bg-[#0E1115] p-6 rounded-2xl border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] mb-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h3 className="text-sm text-[#6B7280] mb-3 font-medium">Posts by you</h3>
            {userPosts.length === 0 ? (
              <div className="text-sm text-[#6B7280]">No posts yet.</div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {userPosts.map((p, idx) => (
                  <motion.div key={p.id} className="flex items-center justify-between bg-[#12141C] p-4 rounded-2xl border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}> 
                    <div>
                      <div className="font-semibold text-white">{p.title}</div>
                      <div className="text-xs text-[#6B7280] mt-1">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-[#6B7280]">Likes: <span className="text-white font-semibold">{p.likes ? p.likes.length : 0}</span></div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="bg-[#0E1115] p-6 rounded-2xl border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <h3 className="text-sm text-[#6B7280] mb-3 font-medium">Account activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#12141C] rounded-2xl text-center border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs text-[#6B7280]">Posts</div>
                <div className="text-lg font-bold text-white mt-1">{userPosts.length}</div>
              </div>
              <div className="p-4 bg-[#12141C] rounded-2xl text-center border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs text-[#6B7280]">Total Likes</div>
                <div className="text-lg font-bold text-white mt-1">{totalLikes}</div>
              </div>
              <div className="p-4 bg-[#12141C] rounded-2xl text-center border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-xs text-[#6B7280]">Comments</div>
                <div className="text-lg font-bold text-white mt-1">—</div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Profile;