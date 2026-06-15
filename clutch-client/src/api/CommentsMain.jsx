import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import CommentSection from "../pages/CommentSection";

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

  const [post] = useState(
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

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6 lg:px-12 font-sans pt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="hidden md:block md:col-span-3 space-y-6">
            <div className="bg-[#1c1c1c] rounded-xl p-4 border border-[#2d2d2d]">
              <h2 className="text-gray-400 text-xs font-semibold tracking-wider mb-3">
                COLLEGE
              </h2>
              <ul className="space-y-1">
                <li
                  onClick={() => handleCollegeClick(null)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#252525]`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-400">
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
                    <span className="font-medium text-gray-300">
                      Global Feed
                    </span>
                  </div>
                </li>

                {sidebarColleges.map((college) => (
                  <li
                    key={college.id}
                    onClick={() => handleCollegeClick(college.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#252525] text-gray-300`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-indigo-400">
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
              className="text-indigo-400 mb-4 flex items-center gap-2 hover:text-indigo-300 transition-colors font-medium"
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

            <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
              <h1 className="text-xl font-bold text-gray-100 mb-3">
                {post.title}
              </h1>
              {post.imageUrl && (
                <img 
                  src={`http://localhost:5000${post.imageUrl}`} 
                  alt="Post content" 
                  className="w-full max-h-[500px] object-contain rounded-lg mb-4 border border-[#2d2d2d]"
                />
              )}
              <p className="text-gray-300 leading-relaxed text-[15px]">
                {post.content}
              </p>
            </div>

            <div className="bg-[#1c1c1c] rounded-xl p-5 border border-[#2d2d2d]">
              <h3 className="text-gray-200 font-semibold mb-5">
                Comments ({comments.length})
              </h3>
              <div className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-[#141414] text-white px-4 py-3 rounded-lg border border-[#2d2d2d] focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handlePostComment}
                  className="bg-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Post
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-indigo-400 text-sm font-semibold animate-pulse text-center py-4">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</div>
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
