const prisma = require('../prisma');

const addComment = async (req,res)=>{
    try{
        let {postId,userId,content,parentId} = req.body;
        
        // FAKE AUTH REMOVED
        // Fetch user based on actual clerkId from frontend
        const { clerkId } = req.body;
        let dbUser = await prisma.user.findFirst({ where: { clerkId: clerkId } });
        if(!dbUser && clerkId) {
            // Create user if doesn't exist
            dbUser = await prisma.user.create({
                data: {
                    clerkId: clerkId,
                    username: "user_" + Date.now(),
                    email: "dummy_" + Date.now() + "@example.com",
                    passwordHash: "dummy"
                }
            });
        }
        let finalUserId = dbUser ? dbUser.id : parseInt(userId);


        const newComment = await prisma.comment.create({
            data:{
                postId:parseInt(postId),
                userId:finalUserId,
                content:content,
                parentId:parentId?parseInt(parentId):null
            },
            include:{
                user:true
            }
        });
        res.status(201).json(newComment);
        
    }catch(error){
        console.error(error);
        res.status(500).json(error)
        
    }
}

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const allComments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });

    const commentMap = {};
    const nestedComments = [];

    const getAnonymousName = (user) => {
      const animals = ['Anon', 'Beluga', 'Owl', 'Tiger', 'Panda', 'Fox', 'Hawk', 'Wolf', 'Bear', 'Koala', 'Rabbit'];
      const id = user?.id || 0;
      const animal = animals[id % animals.length];
      return `${animal}${id}`;
    };

    allComments.forEach(comment => {
      commentMap[comment.id] = { 
        id: comment.id,
        author: getAnonymousName(comment.user),
        text: comment.content,
        parentId: comment.parentId,
        replies: [] 
      };
    });

    allComments.forEach(comment => {
      if (comment.parentId) {
        if(commentMap[comment.parentId]){
          commentMap[comment.parentId].replies.push(commentMap[comment.id]);
        }
      } else {
        nestedComments.push(commentMap[comment.id]);
      }
    });

    res.status(200).json(nestedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Comments load nahi hue!" });
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required to edit comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content: content }
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ error: "Failed to edit comment" });
  }
};

module.exports = {
  addComment,
  getPostComments,
  editComment
};