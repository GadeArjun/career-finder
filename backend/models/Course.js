const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    /** 🏫 COLLEGE LINK */
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    /** 📘 BASIC INFO */
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true }, // SEO friendly URL

    description: { type: String, trim: true },
    duration: { type: String, required: true, trim: true }, // 3 Years, 4 Years
    degreeType: {
      type: String,
      enum: ["Diploma", "UG", "PG", "PhD", "Certification"],
    },

    branch: String, // CSE, IT, AI, Mechanical
    specialization: String, // AI & ML, Cybersecurity, etc.

    intake: { type: Number, default: 0 },

    /** 💰 FEES */
    feeStructure: {
      perYear: { type: Number, default: 0 },
      totalEstimated: Number,
      scholarshipAvailable: Boolean,
    },

    /** 🎓 ELIGIBILITY */
    eligibility: {
      minQualification: String, // 12th, Diploma, UG
      minPercentage: Number,
      entranceExams: [String],
      requiredSubjects: [String], // Math, Physics
    },

    admissionProcess: String,

    /** 🧠 AI MATCHING CORE */

    // Skill areas developed by this course
    skillOutcomeProfile: {
      analytical: { type: Number, min: 0, max: 100, default: 60 },
      technical: { type: Number, min: 0, max: 100, default: 70 },
      creative: { type: Number, min: 0, max: 100, default: 40 },
      communication: { type: Number, min: 0, max: 100, default: 50 },
      research: { type: Number, min: 0, max: 100, default: 40 },
      leadership: { type: Number, min: 0, max: 100, default: 30 },
    },

    // Personality fit
    bestFor: [
      {
        type: String,
        enum: [
          "Problem Solvers",
          "Creative Minds",
          "Tech Enthusiasts",
          "Researchers",
          "Entrepreneurs",
          "Analytical Thinkers",
        ],
      },
    ],

    learningStyle: {
      type: String,
      enum: ["Practical", "Research-Based", "Industry-Oriented", "Academic"],
    },

    /** 🛠 SKILLS TAUGHT */
    coreSkills: [String], // DSA, Networking, AI, CAD
    toolsAndTech: [String], // Python, AWS, AutoCAD, Figma

    /** 🎯 CAREER MAPPING */
    careerDomains: [
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

    typicalJobRoles: [String], // Software Engineer, Data Analyst

    higherStudyPaths: [String], // M.Tech, MBA, MS

    /** 💼 PLACEMENT DATA */
    placementStats: {
      placementRate: { type: Number, min: 0, max: 100 },
      averagePackage: Number,
      highestPackage: Number,
      topRecruiters: [String],
    },

    internshipOpportunities: Boolean,
    industryProjects: Boolean,

    /** 🌍 MODE */
    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      default: "Offline",
    },

    approvedBy: String,
    tags: [String],

    /** 📊 PLATFORM ANALYTICS */
    views: { type: Number, default: 0 },
    interestedCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },

    /** ⭐ AI BOOST */
    popularityScore: { type: Number, min: 0, max: 100, default: 50 },

    /** 🔒 STATUS */
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

/** 🔎 INDEXES FOR RECOMMENDATION ENGINE */
CourseSchema.index({ title: "text", description: "text", coreSkills: "text" });
CourseSchema.index({ branch: 1, specialization: 1 });
CourseSchema.index({ careerDomains: 1 });
CourseSchema.index({ degreeType: 1 });
CourseSchema.index({ popularityScore: -1 });

module.exports = mongoose.model("Course", CourseSchema);
