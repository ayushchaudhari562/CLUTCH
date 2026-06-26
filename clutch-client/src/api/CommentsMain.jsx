import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import CommentSection from "../pages/CommentSection";
import { MessageSquare, ArrowLeft } from "lucide-react";

const CommentMain = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const location = useLocation();

  const [dbUser, setDbUser] = useState(null);
  const [post, setPost] = useState(
    location.state?.post || {
      id: postId,
      title: "Loading...",
      content: "",
      author: "Unknown",
    },
  );

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");
  const [sidebarColleges, setSidebarColleges] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Error resolving user profile in CommentsMain:", err));
    }
  }, [user]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/feed/all`)
      .then((res) => res.json())
      .then((data) => {
        setSidebarColleges(data.topColleges || []);
      });
  }, [postId]);

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
        setPost(prevPost => {
          let updatedLikes = [...(prevPost.likes || [])];
          if (data.liked) {
            updatedLikes.push({ userId: dbUser.id, postId: prevPost.id });
          } else {
            updatedLikes = updatedLikes.filter(like => like.userId !== dbUser.id);
          }
          return { ...prevPost, likes: updatedLikes };
        });
      }
    } catch (error) {
      console.error("Failed to toggle post like:", error);
    }
  };

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userId: 1,
        clerkId: user ? user.id : null,
        content: newCommentText,
        parentId: null,
      }),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setNewCommentText("");
        
        const animals = ['Anon', 'Beluga', 'Owl', 'Tiger', 'Panda', 'Fox', 'Hawk', 'Wolf', 'Bear', 'Koala', 'Rabbit'];
        const id = newComment.user?.id || 0;
        const formattedComment = {
            id: newComment.id,
            author: `${animals[id % animals.length]}${id}`,
            text: newComment.content,
            parentId: newComment.parentId,
            replies: [],
            likesCount: 0,
            likedUserIds: []
        };

        setComments((prevComments) => [...prevComments, formattedComment]);
      });
  };

  const handleCollegeClick = (collegeId) => {
    navigate("/");
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feed/post/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/");
      } else {
        alert("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-white px-4 md:px-6 lg:px-12 pt-28 pb-12 font-sans">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar Colleges Filter */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-surface rounded-[16px] p-4 border border-white/5 shadow-md">
              <h2 className="text-slate-400 text-[10px] font-bold tracking-widest mb-3.5 uppercase">
                COLLEGES
              </h2>
              <ul className="space-y-1">
                <li
                  onClick={() => handleCollegeClick(null)}
                  className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-slate-500">
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
                    onClick={() => handleCollegeClick(college.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/5 text-slate-400 hover:text-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-slate-500 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                        </svg>
                      </div>
                      <span className="text-xs font-semibold">{college.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main post details */}
          <div className="lg:col-span-6 space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="text-google-blue mb-2 flex items-center gap-1.5 hover:text-google-blue/80 transition-colors text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </button>

            {/* Post Card */}
            <div className="bg-surface rounded-[16px] p-5 border border-white/5 shadow-md">
              <div className="flex justify-between items-start mb-3 gap-4">
                <h1 className="text-white text-xl font-extrabold leading-tight tracking-tight mt-1">
                  {post.title}
                </h1>
                {dbUser && post.authorId === dbUser.id && (
                  <button
                    onClick={handleDeletePost}
                    className="cursor-pointer bg-google-red/10 border border-google-red/20 hover:bg-google-red/20 text-google-red text-xs px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              {post.imageUrl && (
                <div className="rounded-[12px] overflow-hidden mb-4 border border-white/5 bg-background max-h-[400px]">
                  <img 
                    src={post.imageUrl.startsWith("http") ? post.imageUrl : `${import.meta.env.VITE_API_URL}${post.imageUrl}`} 
                    alt="Post content" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <p className="text-slate-200 text-xs font-medium leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={(e) => handlePostLike(post.id, e)}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold border ${
                    post.likes && dbUser && post.likes.some(like => like.userId === dbUser.id)
                      ? "bg-google-green/10 border-google-green/20 text-google-green"
                      : "bg-background border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  <span>{post.likes ? post.likes.length : 0}</span>
                </button>
              </div>
            </div>

            {/* Comments Card wrapper */}
            <div className="bg-surface rounded-[16px] p-5 border border-white/5 shadow-md">
              <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-google-blue" />
                Comments ({comments.length})
              </h3>
              
              <div className="flex gap-2.5 mb-6">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-background text-white placeholder-slate-500 px-4 py-2.5 rounded-full border border-white/5 focus:outline-none focus:border-google-blue transition-colors text-xs"
                />
                <button
                  onClick={handlePostComment}
                  className="bg-google-blue hover:bg-google-blue/90 text-white px-5 py-2.5 rounded-full font-bold transition-all border-0 shadow-md cursor-pointer text-xs"
                >
                  Post
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-google-blue text-xs font-bold animate-pulse text-center py-4">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-slate-500 text-xs font-bold text-center py-4">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                  <div className="divide-y divide-white/5 space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="pt-3 first:pt-0">
                        <CommentSection comment={comment} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-3"></div>
        </div>
      </div>
    </>
  );
};
export default CommentMain;
