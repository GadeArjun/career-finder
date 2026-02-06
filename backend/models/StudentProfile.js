const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema(
  {
    /** 👤 USER LINK */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /** 🎓 ACADEMIC BACKGROUND */
    academic: {
      schoolName: String,
      board: String, // CBSE, ICSE, State
      stream: String, // Science, Commerce, Arts
      currentLevel: {
        type: String,
        enum: ["10th", "12th", "Diploma", "UG", "PG"],
      },
      marksPercentage: Number,
      cgpa: Number,
      graduationYear: Number,
      achievements: [String],
    },

    /** 🧠 AI COMPETENCY PROFILE */
    competencyProfile: {
      analytical: { type: Number, min: 0, max: 100, default: 50 },
      technical: { type: Number, min: 0, max: 100, default: 50 },
      creative: { type: Number, min: 0, max: 100, default: 50 },
      communication: { type: Number, min: 0, max: 100, default: 50 },
      leadership: { type: Number, min: 0, max: 100, default: 50 },
      research: { type: Number, min: 0, max: 100, default: 50 },
      social: { type: Number, min: 0, max: 100, default: 50 },
    },

    /** 🛠 SKILLS */
    skills: [String],
    toolsAndTech: [String], // Python, Figma, Excel, etc.
    certifications: [String],

    /** 🧩 PERSONALITY */
    personalityTraits: [
      {
        type: String,
        enum: [
          "Problem Solver",
          "Creative Thinker",
          "Leader",
          "Team Player",
          "Independent",
          "Fast Learner",
          "Research-Oriented",
        ],
      },
    ],

    learningStyle: {
      type: String,
      enum: ["Practical", "Research-Based", "Academic", "Industry-Oriented"],
    },

    workPreference: {
      type: String,
      enum: ["Fast-Paced", "Structured", "Creative", "Balanced"],
    },

    /** 🎯 CAREER INTERESTS */
    careerInterests: [
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

    preferredJobTypes: [
      {
        type: String,
        enum: ["Full-Time", "Internship", "Part-Time", "Remote"],
      },
    ],

    preferredLocations: [String],
    studyModePreference: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
    },

    /** 📚 COURSE MATCH HISTORY */
    interestedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
    enrolledCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    /** 💼 JOB MATCH HISTORY */
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],

    /** 🧪 TESTS & PSYCHOMETRICS */
    testHistory: [
      {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
        score: Number,
        domain: String, // aptitude, personality, coding
        dateTaken: Date,
      },
    ],

    /** 📊 PLATFORM AI METRICS */
    matchConfidenceScore: { type: Number, min: 0, max: 100, default: 50 },
    profileCompletion: { type: Number, min: 0, max: 100, default: 0 },
    activityScore: { type: Number, default: 0 },

    /** 🔒 STATUS */
    isProfilePublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/** 🔎 INDEXES FOR RECOMMENDATION ENGINE */
StudentProfileSchema.index({ skills: "text", careerInterests: "text" });
StudentProfileSchema.index({ "academic.stream": 1 });
StudentProfileSchema.index({ competencyProfile: 1 });

module.exports = mongoose.model("StudentProfile", StudentProfileSchema);
