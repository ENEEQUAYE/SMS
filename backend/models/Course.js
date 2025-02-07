//backend/models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },  
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Course", CourseSchema);
