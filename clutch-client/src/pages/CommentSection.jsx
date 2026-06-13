import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const CommentSection = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(true); // Show replies by default
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  const handleEditSave = () => {
    fetch(`http://localhost:5000/api/comments/${comment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editValue })
    })
    .then(res => res.json())
    .then(() => {
        setIsEditing(false);
        window.location.reload(); 
    });
  };

  const handlePostReply = () => {
    if(!replyText.trim()) return;
    fetch(`http://localhost:5000/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            postId: window.location.pathname.split('/').pop(),
            userId: 1, // Dummy user fallback
            clerkId: user ? user.id : null,
            content: replyText,
            parentId: comment.id
        })
    })
    .then(res => res.json())
    .then(() => {
        setReplyText("");
        setIsReplying(false);
        setShowReplies(true);
        window.location.reload(); 
    });
  };

  if (isCollapsed) {
    return (
      <div className="flex gap-2 items-center text-xs text-gray-400 mt-3 mb-1">
        <button onClick={() => setIsCollapsed(false)} className="hover:bg-[#252525] text-indigo-400 rounded-full w-5 h-5 flex items-center justify-center font-bold">
          +
        </button>
        <div className="w-5 h-5 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0 text-[10px] font-bold">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-gray-300">{comment.author}</span>
        <span>•</span>
        <span>just now</span>
        <span>•</span>
        <span className="italic">{comment.replies ? comment.replies.length : 0} more replies</span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex text-sm text-gray-300 font-sans">
      {/* LEFT SIDE: Avatar & Vertical Thread Line */}
      <div className="flex flex-col items-center mr-3 relative">
        <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0 font-bold text-sm mb-1 z-10 cursor-pointer">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <div 
          className="w-[2px] bg-[#343536] flex-1 hover:bg-gray-500 transition-colors cursor-pointer mt-1" 
          onClick={() => setIsCollapsed(true)}
          title="Collapse thread"
        ></div>
      </div>
      
      {/* RIGHT SIDE: Content */}
      <div className="flex-1 pb-2">
        {/* Header: Username & Time */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-gray-200 cursor-pointer hover:underline">{comment.author}</span>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-500 text-xs">just now</span>
        </div>
        
        {/* Comment Text or Edit Input */}
        {isEditing ? (
          <div className="mb-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full bg-[#141414] text-white px-3 py-2 rounded border border-[#2d2d2d] focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleEditSave} className="text-xs bg-indigo-600 px-3 py-1.5 rounded-full text-white font-semibold">Save Edit</button>
              <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 font-semibold hover:text-white">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-[#d7dadc] text-[14px] leading-relaxed mb-1.5">{comment.text}</p>
        )}

        {/* Action Bar (Upvote, Downvote, Reply, Edit, Share) */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mb-2">
          <button className="flex items-center gap-1 hover:bg-[#2a2a2b] p-1.5 rounded transition-colors group">
            <svg className="w-5 h-5 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
          <span>Vote</span>
          <button className="flex items-center gap-1 hover:bg-[#2a2a2b] p-1.5 rounded transition-colors group">
            <svg className="w-5 h-5 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1.5 hover:bg-[#2a2a2b] py-1.5 px-2 rounded transition-colors ml-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
            Reply
          </button>

          <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 hover:bg-[#2a2a2b] py-1.5 px-2 rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Edit
          </button>

          <button className="flex items-center gap-1.5 hover:bg-[#2a2a2b] py-1.5 px-2 rounded transition-colors hidden sm:flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            Share
          </button>
        </div>

        {/* Reply Input Box */}
        {isReplying && (
          <div className="mt-1 flex gap-2 mb-3">
              <input 
                  type="text" 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author}...`}
                  className="flex-1 bg-[#1a1a1b] text-sm text-white px-3 py-2 rounded border border-[#343536] focus:border-gray-400 outline-none"
              />
              <button onClick={handlePostReply} className="text-sm bg-[#d7dadc] hover:bg-white text-black px-4 py-2 rounded-full font-bold transition-colors">Reply</button>
          </div>
        )}

        {/* Nested Replies Recursion */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map((reply) => (
              <CommentSection key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
