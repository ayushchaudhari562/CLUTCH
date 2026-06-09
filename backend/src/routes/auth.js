const express = require("express");
const router = express.Router();
const prisma = require('../prisma.js');

router.post("/save-college", async (req, res) => {
    try {
        const { clerkId, collegeName,collegeId } = req.body;

        if (!clerkId || !collegeName) {
            return res.status(400).json({ error: "Missing clerkId or collegeName" });
        }

        // We use upsert to either update an existing user with this clerkId, 
        // or create a new user profile if this is their first time logging in!
        const user = await prisma.user.upsert({
            where: { clerkId: clerkId },
            update: {
                collegeName: collegeName,
                collegeId: collegeId
            },
            create: {
                clerkId: clerkId,
                collegeName: collegeName,
                collegeId: collegeId,
                // These are required fields in your Prisma schema that Clerk normally handles
                username: clerkId,
                email: clerkId + "@placeholder.com",
                passwordHash: "managed-by-clerk"
            }
        });

        res.status(200).json({ message: "College saved!", user });
    } catch (error) {
        console.error("Error saving college:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/user/:clerkId",async (req,res)=>{
    try{
        const {clerkId} = req.params;
        const user = await prisma.user.findUnique({
            where: {clerkId:clerkId}
        })
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }catch(error)
    {
        console.log("Error fetching user:",error);
        res.status(500).json({ error: "Internal server error" });
    };
})

module.exports = router;
