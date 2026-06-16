const prisma = require("../prisma");

exports.getSwaps = async (req, res) => {
  try {
    const swaps = await prisma.swap.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch swaps" });
  }
};

//to create new swap::
exports.createSwap = async (req,res)=>{
  try{
    const {userId, offer , need,urgency,category} = req.body;
    const newSwap = await prisma.swap.create({
      data:{
        offer,
        need,
        urgency,
        category,
        user:{
          connect:{clerkId:userId}
        },
      },
      include: {user : true}
    })
    res.status(201).json(newSwap)
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Failed to create swap" })
  }
}

exports.deleteSwap = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.swap.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Swap deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete swap" });
  }
};