import React from 'react';

const Feedpost = ({ onClose }) => {
    return(
        <>
            {/* Modal Overlay */}
            <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"></div>
            
            {/* Modal Content */}
            <div onClick={(e)=>e.stopPropagation()} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1c] z-50 p-6 rounded-xl border border-[#2d2d2d] w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-white">Create a Campus Post</h3>
                    
                    {/* Clean 'X' button to manually close the pop-up composition box */}
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition text-sm font-bold"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Placeholder for the rest of the post creation form */}
                <textarea 
                    className="w-full bg-[#141414] text-gray-200 border border-[#2d2d2d] rounded-lg p-3 min-h-[120px] focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="What's on your mind?"
                ></textarea>
                
                <div className="flex justify-end mt-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                        Post
                    </button>
                </div>
            </div>
        </>
    )
}

export default Feedpost;