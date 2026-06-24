import React, { useState, useEffect } from "react";
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
  const [dbUser, setDbUser] = useState(null);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [likedUserIds, setLikedUserIds] = useState(comment.likedUserIds || []);

  useEffect(() => {
    if (user) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Error fetching db user details inside CommentSection:", err));
    }
  }, [user]);

  const handleCommentLike = async () => {
    if (!user) {
      alert("Please login to upvote comments!");
      return;
    }
    if (!dbUser) {
      alert("User profile is loading, please wait.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${comment.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: user.id })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.liked) {
          setLikesCount(prev => prev + 1);
          setLikedUserIds(prev => [...prev, dbUser.id]);
        } else {
          setLikesCount(prev => prev - 1);
          setLikedUserIds(prev => prev.filter(uid => uid !== dbUser.id));
        }
      }
    } catch (error) {
      console.error("Failed to toggle comment like:", error);
    }
  };

  const handleEditSave = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/comments/${comment.id}`, {
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
    if (!replyText.trim()) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
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
          replies: [],
          likesCount: 0,
          likedUserIds: []
        };

        setLocalReplies(prev => [...prev, formattedReply]);
      });
  };

  if (isCollapsed) {
    return (
      <div 
        className="flex gap-2 items-center text-[11px] mt-2 mb-1 bg-surface-elevated border border-white/5 px-3 py-1.5 rounded-full inline-flex cursor-pointer hover:bg-white/10 transition-colors" 
        onClick={() => setIsCollapsed(false)}
      >
        <div className="w-4 h-4 rounded-full bg-google-green/10 flex items-center justify-center text-google-green shrink-0 text-[8px] font-bold">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-white">{comment.author}</span>
        <span className="text-slate-500">• 2m ago</span>
        <span className="text-google-blue font-bold tracking-wide pl-1.5">+{localReplies.length + 1} replies collapsed</span>
      </div>
    );
  }

  return (
    <div className={`text-xs text-white font-sans w-full ${isReply ? 'pt-2' : 'mt-4'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-full bg-google-green/10 flex items-center justify-center text-google-green font-bold text-[10px] shrink-0 z-10 relative border border-google-green/20">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <span className="font-bold text-white cursor-pointer hover:underline text-[12px]">{comment.author}</span>
        <span className="text-slate-500 text-[10px]">• {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <div className="flex">
        <div className="w-6 flex justify-center shrink-0 relative z-0">
          {showReplies && localReplies.length > 0 && (
            <div className="w-[1.5px] bg-white/10 absolute top-0 bottom-0"></div>
          )}
        </div>

        <div className="flex-1 pl-3.5 pb-2">
          {isEditing ? (
            <div className="mb-2 mr-4">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-background text-white px-3 py-2 rounded-[8px] border border-white/5 focus:border-google-blue outline-none text-xs"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleEditSave} className="text-[10px] bg-google-blue hover:bg-google-blue/90 text-white px-3 py-1.5 rounded-full font-bold border-0 shadow-sm cursor-pointer">Save Edit</button>
                <button onClick={() => setIsEditing(false)} className="text-[10px] bg-transparent text-slate-400 border border-white/5 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/5 font-bold">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="text-slate-200 text-xs leading-relaxed mb-2 whitespace-pre-wrap mr-4 font-medium">
              {currentText}
            </div>
          )}

          {/* Action pill triggers */}
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-2 -ml-1">
            <button onClick={() => setIsCollapsed(true)} className="flex items-center justify-center w-5 h-5 rounded-full border border-white/5 hover:border-slate-400 text-slate-500 hover:text-white transition-all mr-1 cursor-pointer" title="Collapse thread">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
            </button>
            <button
              onClick={handleCommentLike}
              className={`flex items-center gap-1 hover:bg-white/5 px-2 py-1.5 rounded-full transition-all group cursor-pointer ${
                dbUser && likedUserIds.includes(dbUser.id) ? "text-google-green bg-google-green/10" : "text-slate-400"
              }`}
            >
              <svg className="w-4 h-4 group-hover:text-google-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
              <span>{likesCount}</span>
            </button>

            <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1.5 hover:bg-white/5 py-1.5 px-2.5 rounded-full transition-all ml-1 cursor-pointer text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
              <span>Reply</span>
            </button>

            <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-1.5 hover:bg-white/5 py-1.5 px-2.5 rounded-full transition-all cursor-pointer text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              <span>Edit</span>
            </button>
          </div>

          {/* Reply Text input */}
          {isReplying && (
            <div className="mt-1 flex gap-2 mb-3 mr-4">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.author}...`}
                className="flex-1 bg-background text-xs text-white px-3 py-2 border border-white/5 focus:border-google-blue rounded-[8px] outline-none"
              />
              <button onClick={handlePostReply} className="text-[10px] bg-google-blue hover:bg-google-blue/90 text-white px-4 py-2 rounded-full font-bold transition-all border-0 shadow-sm cursor-pointer">Reply</button>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies tree branching renderer */}
      {showReplies && localReplies.length > 0 && (
        <div className="pl-[11px] relative z-0">
          {localReplies.map((reply, idx) => {
            const isLast = idx === localReplies.length - 1;
            return (
              <div key={reply.id} className="relative">
                {!isLast && (
                  <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-white/10 z-0"></div>
                )}

                <div className="absolute top-0 left-0 w-[23px] h-[22px] border-l-2 border-b-2 border-white/10 rounded-bl-[12px] border-t-0 border-r-0 z-0"></div>

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
