const express = require("express");
const router = express.Router();
const prisma = require('../prisma');

router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.search || "";

        // Query the PostgreSQL database for matching colleges
        const colleges = await prisma.colleges.findMany({
            where: {
                name: {
                    contains: searchQuery,
                    mode: "insensitive" // Makes search case-insensitive
                }
            },
            take: 50 // Limit to 50 results so the frontend doesn't lag
        });

        res.json(colleges);
    } catch (error) {
        console.error("Error fetching colleges:", error);
        res.status(500).json({ error: "Failed to fetch colleges" });
    }
});

module.exports = router;
