
        //backend/models/User.js
        const mongoose = require("mongoose")
        const { Schema } = mongoose

        // User Schema
        const UserSchema = new mongoose.Schema(
        {
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            role: { type: String, enum: ["Admin", "Lecturer", "Student"], required: true },
            dateOfBirth: { type: Date },
            gender: { type: String, enum: ["Male", "Female", "Other"] },
            contactNumber: { type: String },
            address: { type: String },
            emergencyContact: {
            name: String,
            phone: String,
            },
            department: { type: String },
            profilePicture: { type: String, default: null },
            isActive: { type: Boolean, default: true },
        },
        { timestamps: true, discriminatorKey: "role" },
        )

        // Base User Model
        const User = mongoose.model("User", UserSchema)

        // Admin Schema
        const AdminSchema = new Schema({
        permissions: [{ type: String }], // e.g., ['ManageUsers', 'EditCourses']
        position: { type: String },
        })

        // Lecturer Schema
        const LecturerSchema = new Schema({
        lecturerId: { type: String, unique: true },
        qualifications: [String],
        position: { type: String },
        officeHours: { type: String },
        courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
        specialization: { type: String },
        bio: { type: String },
        })

        // Student Schema
        const StudentSchema = new Schema({
        studentId: { type: String, unique: true },
        enrollmentDate: { type: Date },
        academicYear: { type: String },
        coursesEnrolled: [
            {
            courseId: { type: Schema.Types.ObjectId, ref: "Course" },
            status: { type: String, enum: ["Active", "Completed", "Dropped"], default: "Active" },
            progress: { type: Number, default: 0 }, // Course completion percentage
            },
        ],
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String },
        },
        })

        // Discriminator Models
        const Admin = User.discriminator("Admin", AdminSchema)
        const Lecturer = User.discriminator("Lecturer", LecturerSchema)
        const Student = User.discriminator("Student", StudentSchema)

        module.exports = { User, Admin, Lecturer, Student }
