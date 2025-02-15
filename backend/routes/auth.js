//backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(200).json({
            token,
            role: user.role, // Make sure this is sent in the response
            user: {
                userId: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                position: user.position,
                role: user.role,
                profilePicture: user.profilePicture,
                contactNumber: user.contactNumber,
                isActive: user.isActive,
                address: user.address,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                department: user.department,
                emergencyContact: user.emergencyContact,
                highestEducation: user.highestEducation,
            },
        });
    } catch (err) {
        console.error("Server error during login:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;