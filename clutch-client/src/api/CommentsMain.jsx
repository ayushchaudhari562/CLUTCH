import React,{useState,useEffect} from "react";
import { useParams,useNavigate, useLocation } from "react-router-dom";
import CommentSection from "../pages/CommentSection";
import dummyComments from "../data/comments.json";

const CommentMain = ()=>{

    const {postId} = useParams();
    const navigate = useNavigate();

    //for data part these three hooks for data part only;
    const location = useLocation();
    
    // Get the post passed from Campus-Feed or fallback to empty object if refreshed
    const [post, setPost] = useState(location.state?.post || {
        id: postId,
        title: "Loading...",
        content: "",
        author: "Unknown"
    });
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCommentText, setNewCommentText] = useState("");

    useEffect(() => {
      // REAL BACKEND CALL to get comments for this real post
      fetch(`http://localhost:5000/api/comments/${postId}`)
        .then(res => res.json())
        .then(data => {
            setComments(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching comments:", err);
            setLoading(false);
        });
  }, [postId])

  const handlePostComment = () => {
      if(!newCommentText.trim()) return;
      
      fetch(`http://localhost:5000/api/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              postId,
              userId: 1, // Abhi ke liye 1 de rahe hain, auth aane pe change hoga
              content: newCommentText,
              parentId: null
          })
      })
      .then(res => res.json())
      .then(newComment => {
          setNewCommentText("");
          // UI update karne ke liye wapas fetch kar lo
          fetch(`http://localhost:5000/api/comments/${postId}`)
            .then(res => res.json())
            .then(data => setComments(data));
      });
  };

  if(loading) return(<>
    <div className="text-white text-center mt-20 text-xl font-semibold animate-pulse">Loading Post...</div>;

  </>)

    return(
        <>
        <div className="min-h-screen bg-[#0d0d0d] text-gray-100 p-4 md:p-6 lg:px-12 font-sans pt-24">
            <button onClick={() => navigate(-1)} className="text-indigo-400 mb-6 flex items-center gap-2 hover:text-indigo-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Feed
        </button> 
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
        <div>
           <h3>Comments ({comments.length})</h3> 
           <div className="flex gap-3 mb-8">
            <input 
              type="text" 
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add a comment..." 
              className="flex-1 bg-[#1c1c1c] text-white px-4 py-3 rounded-lg border border-[#2d2d2d] focus:outline-none focus:border-indigo-500"
            />
            <button onClick={handlePostComment} className="bg-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Post
            </button>
          </div>
          <div>
            {comments.map(comment =>(
                <CommentSection key={comment.id} comment={comment}/>
            ))}
          </div>
        </div>
        </div>

        
        </>
    )


}
export default CommentMain;