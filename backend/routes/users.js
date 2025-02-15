//backend/routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { User, Lecturer, Student } = require("../models/User");
const { authenticate } = require("../middlewares/authMiddleware"); // Correct import
const path = require("path");
const Course = require("../models/Course");
const router = express.Router();

// ✅ Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// ✅ Upload Profile Picture Route
router.post("/upload-profile-pic", authenticate, upload.single("profilePicture"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profilePicturePath = `/uploads/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user.id, { profilePicture: profilePicturePath });

        res.json({ message: "Profile picture updated", profilePicture: profilePicturePath });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get User Profile (Requires Authentication)
router.get("/profile", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update Profile (Requires Authentication)
router.put("/update-profile", authenticate, async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, position } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, contactNumber, position },
            { new: true, select: "-password" }
        );

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get Profile Picture URL
router.get("/profile-pic/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: "Profile picture not found" });
        }

        res.json({ profilePicture: user.profilePicture });
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        res.status(500).json({ message: "Server error" });
    }
});
    
// Add New Admin User

router.post("/add-admin", async (req, res) => {
    try {
        const { firstName, lastName, email, position, contactNumber, password } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        

        // Generate a unique admin ID
        const adminId = `ADMIN-${Math.floor(1000 + Math.random() * 9000)}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            position,
            role: "Admin",
        });
        // Save new admin to database
        await newAdmin.save();
        res.json({ message: "Admin added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
            courses: courses || [],
            role: "Lecturer",
            department: department || "Unknown",
            lecturerId,
            qualifications: qualifications || [],
            officeHours: officeHours || "Not Set",
            specialization: specialization || "General",
            bio: bio || "No bio available",
        });

        await newLecturer.save();
        res.status(201).json({ message: "Lecturer added successfully", lecturer: newLecturer });
    } catch (error) {
        console.error("Error adding lecturer:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all lecturers
router.get("/lecturers", async (req, res) => {
    try {
        const lecturers = await Lecturer.find().populate("courses", "name");
        res.json(lecturers);
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE Lecturer (NEW ROUTE)
router.put("/edit-lecturer/:id", async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, courses, department, qualifications, officeHours, specialization, bio } = req.body;
        
        const lecturer = await Lecturer.findById(req.params.id);
        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        // Update fields (only if they are provided)
        if (firstName) lecturer.firstName = firstName;
        if (lastName) lecturer.lastName = lastName;
        if (email) lecturer.email = email;
        if (contactNumber) lecturer.contactNumber = contactNumber;
        if (courses) lecturer.courses = courses;
        if (department) lecturer.department = department;
        if (qualifications) lecturer.qualifications = qualifications;
        if (officeHours) lecturer.officeHours = officeHours;
        if (specialization) lecturer.specialization = specialization;
        if (bio) lecturer.bio = bio;

        await lecturer.save();
        res.json({ message: "Lecturer updated successfully", lecturer });
    } catch (error) {
        console.error("Error updating lecturer:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE Lecturer
router.delete("/delete-lecturer/:id", async (req, res) => {
    try {
        const lecturer = await Lecturer.findById(req.params.id);
        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        await Lecturer.findByIdAndDelete(req.params.id);
        res.json({ message: "Lecturer deleted successfully" });
    } catch (error) {
        console.error("Error deleting lecturer:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all users
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE User
router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/// Add Student
router.post("/add-student", async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber, dateOfBirth, gender, highestEducation, address, emergencyContact, coursesEnrolled } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Generate Student ID
        const studentId = `STU-${Math.floor(100000 + Math.random() * 900000)}`;

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student
        const newStudent = new Student({
            studentId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            contactNumber,
            dateOfBirth,
            gender,
            highestEducation,
            address,
            emergencyContact,
            coursesEnrolled,
            role: "Student",
        });

        await newStudent.save();
        res.status(201).json({ message: "Student added successfully", student: newStudent });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Students
router.get("/students", async (req, res) => {
    try {
        const students = await Student.find().populate("coursesEnrolled.courseId", "name");
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit Student
router.put("/edit-student/:id", async (req, res) => {
    try {
        const updatedData = req.body;
        if (updatedData.password) {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        }

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Student
router.delete("/delete-student/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Search Students by Name, ID, or Course
router.get("/search-students", async (req, res) => {
    try {
        const { query } = req.query;
        const students = await Student.find({
            $or: [
                { studentId: { $regex: query, $options: "i" } },
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
            ],
        }).populate("coursesEnrolled.courseId", "name");

        res.json(students);
    } catch (error) {
        console.error("Error searching students:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Dashboard Metrics: Get total students, lecturers, and courses
router.get("/dashboard-metrics", async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalLecturers = await Lecturer.countDocuments();
        const totalCourses = await Course.countDocuments(); // Ensure Course model is imported
        res.json({ totalStudents, totalLecturers, totalCourses });
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/lecturer/courses", authenticate, async (req, res) => {
    try {
        const lecturer = await Lecturer.findById(req.user.id).populate("courses", "name code description");
        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }
        res.json({ courses: lecturer.courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/lecturer/students", authenticate, async (req, res) => {
    try {
        const lecturer = await Lecturer.findById(req.user.id).populate("courses");
        if (!lecturer) {
            return res.status(404).json({ message: "Lecturer not found" });
        }

        const courses = lecturer.courses.map(course => course._id); // Extract course IDs
        const students = await Student.find({ "coursesEnrolled.courseId": { $in: courses } })
            .populate("coursesEnrolled.courseId", "name code");

        res.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get Student's Enrolled Courses
router.get("/student/courses", authenticate, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate("coursesEnrolled.courseId", "name description");
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json({ courses: student.coursesEnrolled.map(c => c.courseId) });
    } catch (error) {
        console.error("Error fetching student courses:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
