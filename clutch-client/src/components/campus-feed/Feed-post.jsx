import React, { useState } from 'react';

const Feedpost = ({ onClose }) => {
    // State variables to store form data
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
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
            
            // If the user selected an image, append it to FormData.
            // 'image' must exactly match the field name expected by upload.single('image') in your backend route.
            if (image) {
                formData.append('image', image);
            }

            // Send POST request to backend multer endpoint
            const response = await fetch('http://localhost:5000/api/feed/create', {
                method: 'POST',
                // Note: Do NOT set Content-Type header manually when using FormData
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Success:", data);
                onClose(); // Close modal on successful post creation
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
            <div onClick={(e) => e.stopPropagation()} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1c] z-50 p-6 rounded-xl border border-[#2d2d2d] w-[90%]  h-[90%] shadow-2xl">
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

                <div className="flex flex-col gap-3">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="w-full bg-[#141414] text-gray-200 border border-[#2d2d2d] rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-[#141414] text-gray-200 border border-[#2d2d2d] rounded-lg p-3 min-h-[200%] focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="What's on your mind?"
                    ></textarea>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Attach an Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="text-gray-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-900/50 file:text-purple-300 hover:file:bg-purple-900/80 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Feedpost;