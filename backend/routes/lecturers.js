const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const Course = require("../models/Course");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 Add Lecturer
router.post("/add", authenticate, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, courseId } = req.body;

        // Check if lecturer already exists
        const existingLecturer = await Lecturer.findOne({ email });
        if (existingLecturer) return res.status(400).json({ message: "Lecturer already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new lecturer
        const newLecturer = new Lecturer({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            courseId,
        });

        await newLecturer.save();
        res.status(201).json({ message: "Lecturer added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Get All Lecturers
router.get("/", authenticate, async (req, res) => {
    try {
        const lecturers = await Lecturer.find().populate("courseId", "name");
        res.status(200).json(lecturers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Edit Lecturer
router.put("/edit/:id", authenticate, async (req, res) => {
    try {
        const { firstName, email, phone, courseId } = req.body;
        const updatedLecturer = await Lecturer.findByIdAndUpdate(
            req.params.id,
            { firstName, email, phone, courseId },
            { new: true }
        );

        if (!updatedLecturer) return res.status(404).json({ message: "Lecturer not found" });

        res.status(200).json({ message: "Lecturer updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Delete Lecturer
router.delete("/delete/:id", authenticate, async (req, res) => {
    try {
        const deletedLecturer = await Lecturer.findByIdAndDelete(req.params.id);
        if (!deletedLecturer) return res.status(404).json({ message: "Lecturer not found" });

        res.status(200).json({ message: "Lecturer deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
