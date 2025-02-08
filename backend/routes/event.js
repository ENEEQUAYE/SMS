const express = require("express");
const router = express.Router();
const Event = require("../models/Event"); // Ensure you have an Event model

// Get upcoming events
router.get("/upcoming-events", async (req, res) => {
    try {
        const today = new Date();
        const upcomingEvents = await Event.find({ date: { $gte: today } }).sort("date").limit(5);
        res.json(upcomingEvents);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
