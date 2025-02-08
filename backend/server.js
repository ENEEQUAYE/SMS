//backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs"); // Import bcrypt
const { User } = require("./models/User"); // Extract User model correctly
const eventRoutes = require("./routes/event");




const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve profile pictures from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", require("./routes/users"));
app.use("/api/events", eventRoutes);


//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    createDefaultAdmin();
})
.catch((err) => console.error('MongoDB connection error:', err));

async function createDefaultAdmin() {
    try {
        const adminEmail = 'eneequaye@cesstig.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('CST@eneequaye!#', 12);
            await User.create({
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
            console.log('Default admin account created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
