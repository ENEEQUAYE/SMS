const express = require("express");
const Course = require("../models/Course");
const router = express.Router();

// Add a new course
router.post("/add", async (req, res) => {
    try {
        const { name, code } = req.body;

        // Check if course already exists
        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ message: "Course code already exists" });
        }

        const newCourse = new Course({ name, code });
        await newCourse.save();
        res.status(201).json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit a course
router.put("/edit/:id", async (req, res) => {
    try {
        const { name, code } = req.body;
        const course = await Course.findByIdAndUpdate(req.params.id, { name, code }, { new: true });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a course
router.delete("/delete/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
