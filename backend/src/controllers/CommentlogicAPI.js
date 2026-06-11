const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addComment = async (req,res)=>{
    try{
        const {postId,userId,content,parentId} = req.body;

        const newComment = await prisma.comment.create({
            data:{
                postId:parseInt(postId),
                userId:parseInt(userId),
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

    allComments.forEach(comment => {
      commentMap[comment.id] = { 
        id: comment.id,
        author: comment.user.username,
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

module.exports = {
  addComment,
  getPostComments
};