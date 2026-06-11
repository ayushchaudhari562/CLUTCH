import React,{useState,useEffect} from "react";
import { useParams,useNavigate } from "react-router-dom";

const CommentMain = ()=>{

    const {postId} = useParams();
    const navigate = useNavigate();

    //for data part these three hooks for data part only;
    //..
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
     useEffect(() => {
    // YAHAN BACKEND CALL AAYEGI! Abhi ke liye maine Dummy Data dal diya hai UI check karne ke liye:
    setTimeout(() => {
      setPost({
        id: postId,
        title: "Doubt in DBMS Normalization",
        content: "Bhai koi BCNF aur 3NF ke beech ka difference simple bhasha mein samjha do, kal viva hai!",
        author: "Ayush",
        createdAt: new Date().toISOString()
      });
      setComments([
        {
          id: 1, author: 'User A', text: '3NF mein transitive dependency nahi hoti, BCNF thoda aur strict hai...',
          replies: [
            { 
              id: 2, author: 'User B', text: 'Sahi baat hai, har BCNF 3NF hota hai par har 3NF BCNF nahi hota.', 
              replies: [
                 { id: 3, author: 'User A', text: 'Exactly bhai!' } // Nested ke andar nested!
              ] 
            }
          ]
        },
        {
           id: 4, author: 'User C', text: 'YouTube pe Gate Smashers ki video dekh le bhai',
           replies: []
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [postId])

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
              placeholder="Add a comment..." 
              className="flex-1 bg-[#1c1c1c] text-white px-4 py-3 rounded-lg border border-[#2d2d2d] focus:outline-none focus:border-indigo-500"
            />
            <button className="bg-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Post
            </button>
          </div>
          <div>
            {comments.map(comment =>(
                <CommentMain key={comment.id} comment={comment}/>
            ))}
          </div>
        </div>
        </div>

        
        </>
    )


}
export default CommentMain;