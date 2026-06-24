import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';

const Feedpost = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { user } = useUser();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !content) {
            alert('Please fill out title and content!');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (user) {
                formData.append('clerkId', user.id);
            }
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch(import.meta.env.VITE_API_URL + '/api/feed/create', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                onClose();
                window.location.reload();
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
            <div onClick={onClose} className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface z-50 p-6 rounded-[16px] border border-white/5 w-[90%] md:w-[600px] max-h-[90vh] shadow-xl text-white flex flex-col font-sans"
            >
                <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4 shrink-0">
                    <h3 className="text-md font-bold text-white">Create a Campus Post</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white bg-background border border-white/5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-xs"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="w-full bg-background text-white placeholder-slate-500 border border-white/5 rounded-[8px] px-4 py-3 focus:outline-none focus:border-google-blue transition-colors text-sm"
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-background text-white placeholder-slate-500 border border-white/5 rounded-[8px] p-4 min-h-[220px] focus:outline-none focus:border-google-blue transition-colors text-sm resize-none"
                        placeholder="What's on your mind?"
                    ></textarea>

                    <div className="space-y-1.5 pt-1">
                        <label className="text-xs text-slate-400 block font-bold">Attach an Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="text-slate-400 text-xs file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border file:border-google-green/20 file:text-xs file:font-semibold file:bg-google-green/10 file:text-google-green hover:file:bg-google-green/20 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-white/5 shrink-0">
                    <button 
                        onClick={onClose} 
                        className="bg-transparent hover:bg-white/5 text-slate-400 px-5 py-2 rounded-full font-bold transition-colors border border-white/5 text-xs cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="bg-google-blue hover:bg-google-blue/90 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold transition-colors border-0 shadow-md cursor-pointer text-xs"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Feedpost;