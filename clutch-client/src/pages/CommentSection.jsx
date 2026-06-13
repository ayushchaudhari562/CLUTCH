import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

const CommentSection = ({ comment, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(true); 
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(comment.text);
  const [editValue, setEditValue] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localReplies, setLocalReplies] = useState(comment.replies || []);
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
        setCurrentText(editValue);
    });
  };

  const handlePostReply = () => {
    if(!replyText.trim()) return;
    fetch(`http://localhost:5000/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            postId: window.location.pathname.split('/').pop(),
            userId: 1, 
            clerkId: user ? user.id : null,
            content: replyText,
            parentId: comment.id
        })
    })
    .then(res => res.json())
    .then((newReply) => {
        setReplyText("");
        setIsReplying(false);
        setShowReplies(true);
        
        const animals = ['Anon', 'Beluga', 'Owl', 'Tiger', 'Panda', 'Fox', 'Hawk', 'Wolf', 'Bear', 'Koala', 'Rabbit'];
        const id = newReply.user?.id || 0;
        const formattedReply = {
           id: newReply.id,
           author: `${animals[id % animals.length]}${id}`,
           text: newReply.content,
           parentId: newReply.parentId,
           replies: []
        };
        
        setLocalReplies(prev => [...prev, formattedReply]);
    });
  };

  if (isCollapsed) {
    return (
      <div className="flex gap-2 items-center text-xs mt-3 mb-1 bg-[#1a1a1b] p-1.5 rounded-full inline-flex cursor-pointer hover:bg-[#2a2a2b] transition-colors" onClick={() => setIsCollapsed(false)}>
        <div className="w-5 h-5 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0 text-[10px] font-bold">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-gray-300">{comment.author}</span>
        <span className="text-gray-500">• 2y ago</span>
        <span className="text-gray-400 italic px-2">+{localReplies.length + 1} collapsed</span>
      </div>
    );
  }

  return (
    <div className={`text-sm text-gray-300 font-sans w-full ${isReply ? 'pt-2' : 'mt-4'}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0 z-10 relative">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-gray-200 cursor-pointer hover:underline text-[13px]">{comment.author}</span>
        <span className="text-gray-500 text-xs">•{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
      
      <div className="flex">
        <div className="w-7 flex justify-center shrink-0 relative z-0">
           {showReplies && localReplies.length > 0 && (
              <div className="w-[2px] bg-[#343536] absolute top-0 bottom-0"></div>
           )}
        </div>
        
        <div className="flex-1 pl-2 pb-2">
           {isEditing ? (
             <div className="mb-2 mr-4">
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
             <div className="text-[#d7dadc] text-[14px] leading-relaxed mb-1.5 whitespace-pre-wrap mr-4">
                {currentText}
             </div>
           )}
           
           {/* Action Bar */}
           <div className="flex items-center gap-1 text-xs text-gray-400 font-bold mb-2 -ml-1">
              <button onClick={() => setIsCollapsed(true)} className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-[#343536] hover:border-gray-300 text-[#343536] hover:text-gray-300 transition-colors mr-1 cursor-pointer" title="Collapse">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg>
              </button>
           
              <button className="flex items-center gap-1 hover:bg-[#2a2a2b] p-1.5 rounded transition-colors group cursor-pointer">
                <svg className="w-5 h-5 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
              </button>
              <span className="font-medium text-[13px]">6</span>
              <button className="flex items-center gap-1 hover:bg-[#2a2a2b] p-1.5 rounded transition-colors group cursor-pointer">
                <svg className="w-5 h-5 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1.5 hover:bg-[#2a2a2b] py-1.5 px-2 rounded transition-colors ml-1 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                Reply
              </button>

              <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 hover:bg-[#2a2a2b] py-1.5 px-2 rounded transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Edit
              </button>
           </div>
           
           {/* Reply Input Box */}
           {isReplying && (
             <div className="mt-1 flex gap-2 mb-3 mr-4">
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
        </div>
      </div>

      {/* Replies Container (Tree Branching Logic) */}
      {showReplies && localReplies.length > 0 && (
        <div className="pl-[13px] relative z-0">
           {localReplies.map((reply, idx) => {
              const isLast = idx === localReplies.length - 1;
              return (
                 <div key={reply.id} className="relative">
                    {!isLast && (
                       <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[#343536] z-0"></div>
                    )}
                    
                    <div className="absolute top-0 left-0 w-[23px] h-[22px] border-l-2 border-b-2 border-[#343536] rounded-bl-[12px] border-t-0 border-r-0 z-0"></div>
                    
                    <div className="pl-[23px]">
                       <CommentSection comment={reply} isReply={true} />
                    </div>
                 </div>
              );
           })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
