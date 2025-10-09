// File: models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Basic Account Info
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "college", "admin"],
      default: "student",
    },

    avatar: {
      type: String, // URL to uploaded avatar image
      default: "",
    },

    profileCompletion: {
      type: Number, // percentage
      default: 0,
    },

    // Academic Details
    academicDetails: {
      schoolCollege: { type: String, trim: true },
      grade: { type: String, trim: true },
      stream: { type: String, trim: true },
      subjects: [{ type: String, trim: true }],
      achievements: { type: String, trim: true },
    },

    // Personal Information
    personalInfo: {
      name: { type: String },
      age: { type: Number },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      contact: { type: String, trim: true },
      address: { type: String, trim: true },
      notifications: { type: String, trim: true },
      theme: { type: String, trim: true },
    },

    // Skills & Interests
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],

    // Resume Upload
    resumeUrl: {
      type: String, // URL or file path to uploaded PDF
      default: "",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("User", UserSchema);
