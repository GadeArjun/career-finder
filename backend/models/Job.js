const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    /** 🏢 COMPANY INFO */
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /** 🧾 BASIC JOB INFO */
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true }, // for SEO/job page URL

    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
      default: "Full-Time",
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"],
      default: "Fresher",
    },

    openings: { type: Number, default: 1 },

    /** 📍 LOCATION */
    location: {
      city: String,
      state: String,
      country: { type: String, default: "India" },
      remoteAllowed: Boolean,
    },

    /** 💰 SALARY */
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
      isConfidential: { type: Boolean, default: false },
    },

    /** 📚 ELIGIBILITY */
    educationRequired: [
      {
        degree: String, // B.Tech, BCA, MBA
        field: String, // CSE, IT, AI, Mechanical
      },
    ],

    minCGPA: Number,

    graduationYearRange: {
      from: Number,
      to: Number,
    },

    certificationsPreferred: [String],

    /** 🛠 SKILLS */
    skillsRequired: [String],
    skillsNiceToHave: [String],

    toolsAndTech: [String], // React, Node, AWS, Figma

    /** 🧠 AI MATCHING CORE (THIS IS GOLD) */

    competencyWeights: {
      analytical: { type: Number, min: 0, max: 100, default: 50 },
      technical: { type: Number, min: 0, max: 100, default: 60 },
      creative: { type: Number, min: 0, max: 100, default: 30 },
      communication: { type: Number, min: 0, max: 100, default: 50 },
      leadership: { type: Number, min: 0, max: 100, default: 30 },
      research: { type: Number, min: 0, max: 100, default: 20 },
    },

    personalityFit: [
      {
        type: String,
        enum: [
          "Problem Solver",
          "Fast Learner",
          "Team Player",
          "Leader",
          "Independent",
          "Creative Thinker",
        ],
      },
    ],

    workStyleMatch: {
      type: String,
      enum: ["Fast-Paced", "Structured", "Creative", "Research-Oriented"],
    },

    /** 🎯 COURSE MATCHING */
    targetCourses: [
      {
        degree: String,
        branch: String,
        specialization: String,
      },
    ],

    preferredDomains: [
      "Software Development",
      "AI/ML",
      "Data Science",
      "Cybersecurity",
      "Cloud",
      "Product",
      "Design",
      "Marketing",
      "Finance",
      "Research",
    ],

    /** 📄 JOB DETAILS */
    responsibilities: [String],
    perks: [String],
    description: String,

    applicationDeadline: Date,

    /** 📊 PLATFORM METRICS */
    views: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
    shortlistedCount: { type: Number, default: 0 },

    /** ⭐ AI SCORE BOOST */
    priorityScore: { type: Number, min: 0, max: 100, default: 50 },

    /** 🔒 STATUS */
    status: {
      type: String,
      enum: ["draft", "open", "closed", "paused"],
      default: "open",
    },
  },
  { timestamps: true }
);

/** 🔎 INDEXES FOR MATCHING */
JobSchema.index({ title: "text", skillsRequired: "text", description: "text" });
JobSchema.index({ "location.city": 1, type: 1 });
JobSchema.index({ preferredDomains: 1 });
JobSchema.index({ "targetCourses.degree": 1, "targetCourses.branch": 1 });
JobSchema.index({ status: 1, applicationDeadline: 1 });

module.exports = mongoose.model("Job", JobSchema);
