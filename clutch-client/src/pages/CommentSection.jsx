import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

//..
//..
//..The main concept of the nested recursion;
//..
//..
const CommentSection = ({comment}) => {
    const [showReplies, setShowReplies] = useState(false);
    return (
        <>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0">
                    U
                </div>
                <div className="flex 1">
                    <div className="bg-[#1c1c1c] p-4 rounded-xl border border-[#2d2d2d]">
                        <h5 className="font-semibold text-gray-200 text-sm mb-1">
                            {comment.author}
                        </h5>
                        <p className="text-gray-300 text-[15px]">{comment.text}</p>

                    </div>
                    <div className="flex gap-4 mt-2 ml-2">
                        <button className="text-ts text-gray-400 havor:text-white font-medium">
                            Reply
                        </button>
                        
                        {comment.replies && comment.replies.length > 0 && (
                            <button 
                                onClick={()=>setShowReplies(!showReplies)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                                {showReplies ? 'Hide Replies' : `View ${comment.replies.length} Replies`}
                            </button>
                        )}
                    </div>
                    {/*the main recursion part is here after clicking reply it will call again to this 
                    so it will age ka add krunga comments acche se */}
                    {showReplies && comment.replies && (
                        <div className="border-l-2 border-[#2d2d2d] pl-6 mt-4 space-y-4">
                            {comment.replies.map(reply =>(
                                <CommentsSection key={reply.id} comment={reply}/>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </>
    )
};


export default CommentSection;