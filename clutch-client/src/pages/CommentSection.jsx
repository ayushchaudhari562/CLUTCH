import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from 'react-router-dom';

//..
//..
//..The main concept of the nested recursion;
//..
//..
const CommentSection = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  
  return (
    <>
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0">
          U
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-[#1c1c1c] p-4 rounded-xl border border-[#2d2d2d]">
            <h5 className="font-semibold text-gray-200 text-sm mb-1">
              {comment.author}
            </h5>
            {isEditing ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-[#141414] text-white px-3 py-2 rounded border border-[#2d2d2d] focus:border-indigo-500 outline-none"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      // Yahan Backend pe UPDATE call jayegi
                      console.log("Updated to:", editValue);
                      setIsEditing(false);
                    }}
                    className="text-xs bg-indigo-600 px-3 py-1 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-[15px]">{comment.text}</p>
            )}
          </div>
          <div className="flex gap-4 mt-2 ml-2">
            <button onClick={() => setIsReplying(!isReplying)} className="text-xs text-gray-400 hover:text-white font-medium">
        Reply
    </button>
    <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-gray-400 hover:text-indigo-400 font-medium">
        Edit
    </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {showReplies
                  ? "Hide Replies"
                  : `View ${comment.replies.length} Replies`}
              </button>
            )}
          </div>
          

          {isReplying && (
              <div className="mt-3 ml-2 flex gap-2">
                  <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="flex-1 bg-[#141414] text-xs text-white px-3 py-2 rounded-lg border border-[#2d2d2d] focus:border-indigo-500 outline-none"
                  />
                  <button onClick={() => {
                      if(!replyText.trim()) return;
                      
                      fetch(`http://localhost:5000/api/comments`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              // Note: We need postId. Since we don't have it directly in this component props, 
                              // we can grab it from the URL or pass it down. Grabbing from URL:
                              postId: window.location.pathname.split('/').pop(),
                              userId: 1, // Dummy user
                              content: replyText,
                              parentId: comment.id // THIS MAKES IT A REPLY!
                          })
                      })
                      .then(res => res.json())
                      .then(() => {
                          setReplyText("");
                          setIsReplying(false);
                          setShowReplies(true);
                          // Refresh page to see new reply (temporary simple solution)
                          window.location.reload(); 
                      });
                  }} className="text-xs bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors">Post</button>
              </div>
          )}

          {/*the main recursion part is here after clicking reply it will call again to this 
                    so it will age ka add krunga comments acche se */}
          {showReplies && comment.replies && (
            <div className="border-l-2 border-[#2d2d2d] pl-6 mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentSection key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentSection;
