const prisma = require('../prisma');

const createPost = async (req, res) => {
    try {
        // authorId is required by your schema!
        const { title, content, authorId } = req.body;
        
        // If a file was uploaded, multer puts its details in req.file
        let imageUrl = null;
        if (req.file) {
            // Create a URL path that the frontend can use to access the image
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Save to your database using Prisma
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl, // Save the file path in the DB
                authorId: parseInt(authorId) || 1 // Fallback to 1 for testing if not provided
            }
        });

        res.status(201).json({ 
            message: "Post created successfully", 
            post: newPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create post" });
    }
};

const getAllPosts = async (req,res)=>{
    try{
        //..
        //..
        //telling prisma to find post from the database prisma ke baare 
        //me aur pdhana hai for now i only know that its 
        // make easier to without querey
        //..
        const posts = await prisma.post.findMany({
            orderBy:{
                createdAt : 'desc' //for newer to older;..     
            }

        });
        //sending post to the frontend;
        res.status(200).json(posts);

    }caches
}

module.exports = { createPost };
