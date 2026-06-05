const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // If a file was uploaded, multer puts its details in req.file
        let imageUrl = null;
        if (req.file) {
            // Create a URL path that the frontend can use to access the image
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Example: Save to your database (Prisma)
        /*
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl // Save the file path in the DB
            }
        });
        */

        res.status(201).json({ 
            message: "Post created successfully", 
            post: { title, content, imageUrl } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

module.exports = { createPost };
