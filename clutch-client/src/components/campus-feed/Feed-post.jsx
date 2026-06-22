import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';

const Feedpost = ({ onClose }) => {
    // State variables to store form data
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    

    //..
    //..
    const {user} = useUser();
    // State to store the uploaded image file (Multer needs a File object)
    const [image, setImage] = useState(null);
    
    // Loading state to disable button while uploading
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Basic validation to ensure required fields are filled
        if (!title || !content) {
            alert('Please fill out title and content!');
            return;
        }

        setLoading(true);
        try {
            // FormData is required when uploading files via fetch/axios
            // It automatically formats the request as 'multipart/form-data'
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            //...
            //..
            if(user){
                formData.append('clerkId',user.id);
            }
            // If the user selected an image, append it to FormData.
            // 'image' must exactly match the field name expected by upload.single('image') in your backend route.
            if (image) {
                formData.append('image', image);
            }

            // Send POST request to backend multer endpoint
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/feed/create', {
                method: 'POST',
                // Note: Do NOT set Content-Type header manually when using FormData
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Success:", data);
                onClose(); 
            } else {
                console.error("Failed to post");
                alert("Failed to post");
            }
        } catch (error) {
            console.error("Error uploading:", error);
            alert("Error uploading post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Modal Overlay */}
            <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"></div>

            {/* Modal Content */}
            {/* e.stopPropagation() is crucial: In HTML/React, 
            events "bubble up". If you click an element, that 
            click event also fires on its parent elements. If
             you didn't have e.stopPropagation() here, clicking 
             inside the white modal box would "bubble up" and also
              trigger the click event on the background overlay
               (which would call onClose).

                By calling e.stopPropagation(), you are telling the
                 browser: "Hey, I clicked inside the content box. 
                 Do whatever is inside the box, but stop this click
                  event from traveling up to the parent elements." 
                  This ensures clicking inside the modal doesn't 
                  accidentally close it. */}
            <div onClick={(e) => e.stopPropagation()} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#12141C] z-50 p-6 rounded-[12px] border border-white/10 w-[90%] h-[90%] shadow-none text-white flex flex-col font-sans">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4 shrink-0">
                    <h3 className="text-lg font-semibold text-white">Create a Campus Post</h3>
                    
                    {/* Clean 'X' button to manually close the pop-up composition box */}
                    <button
                        onClick={onClose}
                        className="text-[#6B7280] hover:text-white bg-[#090A0F] hover:bg-white/5 border border-white/5 w-8 h-8 rounded-[50%] flex items-center justify-center transition-colors text-sm font-bold cursor-pointer shadow-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="w-full bg-[#090A0F] text-white placeholder-[#6B7280] border border-white/5 rounded-[8px] p-3 focus:outline-none focus:border-[#10b981] transition-colors"
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-[#090A0F] text-white placeholder-[#6B7280] border border-white/5 rounded-[8px] p-3 min-h-[300px] focus:outline-none focus:border-[#10b981] transition-colors resize-none"
                        placeholder="What's on your mind?"
                    ></textarea>

                    <div className="pt-2">
                        <label className="text-sm text-[#6B7280] block mb-1">Attach an Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="text-[#6B7280] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-[20px] file:border file:border-emerald-500/20 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-[#10b981] hover:file:bg-emerald-500/20 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-white/5 shrink-0">
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="bg-white hover:bg-slate-200 disabled:opacity-50 text-black px-6 py-2.5 rounded-[8px] font-medium transition-colors border-0 shadow-none cursor-pointer"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Feedpost;