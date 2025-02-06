//backend/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Admin } = require("./models/User");

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected...");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

// Seed Admin User
const seedAdmin = async () => {
    await connectDB();

    try {
        const adminExists = await Admin.findOne({ email: "eneequaye@cesstig.com" });

        if (adminExists) {
            console.log("Admin user already exists.");
        } else {
            const hashedPassword = await bcrypt.hash("CST@eneequaye!#", 10); // Default password
            const admin = new Admin({
                userId: "ADMIN001",
                email: "eneequaye@cesstig.com",
                password: hashedPassword,
                firstName: "Emmanuel",
                lastName: "Neequaye",
                position: "System Administrator",
                role: "Admin",
                profilePicture: null,
                contactNumber: "0559340192",
                department: "System Administration",
                permissions: ["ManageUsers", "EditCourses", "ViewReports"],
            });

            await admin.save();
            console.log("Default admin user created successfully!");
        }
    } catch (err) {
        console.error("Error creating admin user:", err.message);
    } finally {
        mongoose.connection.close();
    }
};

seedAdmin();
