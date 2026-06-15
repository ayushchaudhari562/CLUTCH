const prisma = require("../prisma");

const getUserIdFromClerk = async(clerkID) => {
    if(!clerkID) return null;
    const user= await prisma.user.findUnique({
        where: {clerkId: clerkID}
    })
    return user?.id || null;

};
const togglePostLike = async(req, res) => {
    try{
        const {postId} = req.params;
        const {clerkId} = req.body;
        const userId = await getUserIdFromClerk(clerkId);
        if(!userId) return res.status(403).json({error: "Please login"});
        
        const targetPostId = parseInt(postId);
        const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: targetPostId,
          userId: userId
        }
      }
    });
if (existingLike){
    await prisma.like.delete({
        where: {
            id: existingLike.id
        }
    });
    return res.status(200).json({liked: false});
} else {
    await prisma.like.create({
        data: {
            postId: targetPostId,
            userId: userId
        }
    });
    return res.status(200).json({liked: true});
}

    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
}


const toggleCommentLike = async(req,res)=>{
    try{
        const {commentId} = req.params;
        const {clerkId} = req.body;
        const userId = await getUserIdFromClerk(clerkId);
        if(!userId) return res.status(403).json({error:"Please login"})
        
            const targetCommentId = parseInt(commentId);
            const existingLike = await prisma.commentLike.findUnique({
              where: {
                commentId_userId:{
                    commentId: targetCommentId,
                    userId: userId
                }
              }  
            });
            if (existingLike){
                await prisma.commentLike.delete({
                    where:{
                        id: existingLike.id
                    }
                });
                return res.status(201).json({liked: false});
            } else{
                await prisma.commentLike.create({
                    data:{
                        commentId: targetCommentId,
                        userId: userId
                    }
                });
                return res.status(201).json({liked: true});
            }
            
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
}

module.exports = {
    togglePostLike,
    toggleCommentLike
}