const prisma = require("../prisma");

const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: parseInt(authorId) || 1,
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const requestedCollegeId = parseInt(req.query.collegeId);
    
    const posts = await prisma.post.findMany({
      where: {
        author: {
          collegeId: requestedCollegeId,
        },
      },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

module.exports = { createPost, getAllPosts };
