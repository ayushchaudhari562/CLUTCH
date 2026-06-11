import React,{useState,useEffect} from "react";
import {useParams,useNavigate} from 'react-router-dom';

//..
//..
//..The main concept of the nested recursion;
//..
//..
const CommentSection = ()=>{
    const [showReplies,setShowReplies] = useState(false);
    return(
        <>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-300 shrink-0">
        U
      </div>

            </div>
        </>
    )
}
export default CommentSection;