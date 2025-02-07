const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Lecturer, Student } = require("../models/User");

const router = express.Router();

// Add Lecturer
router.post("/add-lecturer", async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber, courses, department, qualifications, officeHours, specialization, bio } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Generate a unique lecturer ID
        const lecturerId = `LECT-${Math.floor(1000 + Math.random() * 9000)}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new lecturer
        const newLecturer = new Lecturer({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            courses,
            role: "Lecturer",
            department,
            lecturerId,
            qualifications,
            officeHours,
            specialization,
            bio,
        });

        await newLecturer.save();
        res.status(201).json({ message: "Lecturer added successfully", lecturer: newLecturer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all lecturers
router.get("/lecturers", async (req, res) => {
    try {
        const lecturers = await Lecturer.find().populate("courses", "name");
        res.json(lecturers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/delete-lecturer/:id", async (req, res) => {
    try {
        await Lecturer.findByIdAndDelete(req.params.id);
        res.json({ message: "Lecturer deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete user
router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



// Get all students
router.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add Student
router.post("/add-student", async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ message: "Student added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete student
router.delete("/delete-student/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
