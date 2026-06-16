import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import CommentSection from "../pages/CommentSection";
import FeedPost from '../components/campus-feed/Feed-post';

const CommentMain = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  //..
  //for data part these three hooks for data part only;
  //..
  const location = useLocation();
  //..
  //....
  // I used useLocation to optimize performance and reduce unnecessary database calls.
// When a user is on the Campus Feed, we've already fetched the post data 
// from the backend. Instead of throwing that data away when they click on a
//  post to read the comments, I pass the post object directly to the comments
//  page via React Router's navigate state.
// Inside the CommentsMain component, I catch that data using the useLocation() hook. 
// This allows the page to render the post's title and content instantly—creating 
// a seamless, zero-latency user experience. If I hadn't done this, the app would 
//have to make a redundant API call to the backend just to fetch data we already had,
//which would introduce loading spinners and increase server load
  //..
  //...

  const [dbUser, setDbUser] = useState(null);
  const [post, setPost] = useState(
    location.state?.post || {
      id: postId,
      title: "Loading...",
      content: "",
      author: "Unknown",
    },
  );

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Error resolving user profile in CommentsMain:", err));
    }
  }, [user]);

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
      const response = await fetch(`http://localhost:5000/api/feed/post/${postId}/like`, {
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

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState("");

 
  const [sidebarColleges, setSidebarColleges] = useState([]);

  useEffect(() => {
    
    fetch(`http://localhost:5000/api/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
//..
    //Fetch sidebar colleges
    //...
    fetch(`http://localhost:5000/api/feed/all`)
      .then((res) => res.json())
      .then((data) => {
        setSidebarColleges(data.topColleges || []);
      });
  }, [postId]);

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;

    fetch(`http://localhost:5000/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        userId: 1, // Fallback
        clerkId: user ? user.id : null,
        content: newCommentText,
        parentId: null,
      }),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setNewCommentText("");
        
        // Format the new comment to match the GET format so it displays correctly
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

        // Optimized UI update: append new comment directly without a second fetch
        setComments((prevComments) => [...prevComments, formattedComment]);
      });
  };

  const handleCollegeClick = (collegeId) => {
    // When a user clicks a college in the sidebar on the comments page,
    // they expect to see posts from that college. So we should navigate back to the feed.
    // For now, we can just navigate to the home feed. The feed handles its own state.
    navigate("/");
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/feed/post/${postId}`, {
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
      <div className="min-h-screen bg-transparent text-white p-4 md:p-6 lg:px-12 font-sans pt-24">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="hidden md:block md:col-span-3 space-y-6">
            <div className="bg-[#12141C] rounded-[12px] p-4 border border-white/5 shadow-none">
              <h2 className="text-[#6B7280] text-[11px] font-semibold tracking-wider mb-3 uppercase">
                COLLEGE
              </h2>
              <ul className="space-y-1">
                <li
                  onClick={() => handleCollegeClick(null)}
                  className="flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors hover:bg-white/5 text-[#6B7280]"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#10b981]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        ></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[#6B7280] hover:text-white">
                      Global Feed
                    </span>
                  </div>
                </li>

                {sidebarColleges.map((college) => (
                  <li
                    key={college.id}
                    onClick={() => handleCollegeClick(college.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-[8px] cursor-pointer transition-colors hover:bg-white/5 text-[#6B7280] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-[#10b981]/70">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l9-5-9-5-9 5 9 5z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                          ></path>
                        </svg>
                      </div>
                      <span className="font-medium">{college.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MIDDLE COLUMN - Main Content */}
          <div className="md:col-span-6 space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#10b981] mb-4 flex items-center gap-2 hover:text-[#10b981]/80 transition-colors font-medium cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Feed
            </button>

            <div className="bg-[#12141C] rounded-[12px] p-5 border border-white/5 shadow-none">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-xl font-bold text-white">
                  {post.title}
                </h1>
                {dbUser && post.authorId === dbUser.id && (
                  <button
                    onClick={handleDeletePost}
                    className="cursor-pointer bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-500 text-sm px-3 py-1.5 rounded-[8px] font-medium transition-colors"
                  >
                    Delete Post
                  </button>
                )}
              </div>
              {post.imageUrl && (
                <img 
                  src={`http://localhost:5000${post.imageUrl}`} 
                  alt="Post content" 
                  className="w-full max-h-[500px] object-contain rounded-[12px] mb-4 border border-white/5"
                />
              )}
              <p className="text-white leading-relaxed text-[15px] mb-4">
                {post.content}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handlePostLike(post.id, e)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        post.likes && dbUser && post.likes.some(like => like.userId === dbUser.id)
                          ? "text-[#10b981] hover:text-[#10b981]/80"
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

            <div className="bg-[#12141C] rounded-[12px] p-5 border border-white/5 shadow-none">
              <h3 className="text-white font-semibold mb-5">
                Comments ({comments.length})
              </h3>
              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#090A0F] text-white placeholder-[#6B7280] px-4 py-3 rounded-[8px] border border-white/5 focus:outline-none focus:border-[#10b981] transition-colors"
                />
                <button
                  onClick={handlePostComment}
                  className="bg-white hover:bg-slate-200 text-black px-6 py-3 rounded-[8px] font-medium transition-colors border-0 shadow-none cursor-pointer"
                >
                  Post
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-[#10b981] text-sm font-semibold animate-pulse text-center py-4">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-[#6B7280] text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                  comments.map((comment) => (
                    <CommentSection key={comment.id} comment={comment} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Empty for now */}
          <div className="hidden md:block md:col-span-3"></div>
        </div>
      </div>
    </>
  );
};
export default CommentMain;
