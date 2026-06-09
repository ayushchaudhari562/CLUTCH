const prisma = require("../prisma");

const createPost = async (req, res) => {
  try {
    const { title, content, clerkId } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

///..
//..
    let finalAuthorId = 1;
    if(clerkId){
      const user = await prisma.user.findUnique({
        where: {clerkId: clerkId}

      });
      if(user){
        finalAuthorId = user.id;
      }
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: finalAuthorId,
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
   //..isse bhi achha ho ske hai ye isko optimize krna abhi isko nhi
    //... Frontend se filter karne ke liye collegeId aayegi (agar click kiya toh)
    const filterCollegeId = req.query.collegeId ? parseInt(req.query.collegeId) : null;
    
     // Agar filterCollegeId hai toh filter lagao, warna khali chhod do (jisse sab aa jayenge)
    const queryCondition = filterCollegeId ? {
        author: {
          collegeId: filterCollegeId,
        }
    } : {};
    // Posts nikalna (Filter condition ke hisaab se)
    const posts = await prisma.post.findMany({
      where: queryCondition, // Yahan hamara dynamic filter lag raha hai
      include: { author: true },
      orderBy: { createdAt: "desc" },})
    
    const topCollegeData = await prisma.$queryRaw`
      SELECT u."collegeId", COUNT(p.id) as "postCount"
      FROM "Post" p
      JOIN "User" u ON p."authorId" = u.id
      WHERE u."collegeId" IS NOT NULL
      GROUP BY u."collegeId"
      ORDER BY "postCount" DESC
      LIMIT 5
    `;

    const collegeIds = topCollegeData.map(c => c.collegeId);

    let topColleges = [];
    if (collegeIds.length > 0) {
        topColleges = await prisma.colleges.findMany({
            where: {
                id: { in: collegeIds }
            }
        });
    }

    if (topColleges.length === 0) {
        topColleges = await prisma.colleges.findMany({ take: 5 });
    }

    res.status(200).json({ posts, topColleges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

module.exports = { createPost, getAllPosts };
