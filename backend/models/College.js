const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema(
  {
    /** BASIC INFO */
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, default: "India" },
    },

    logo: String,
    bannerImage: String,
    description: String,
    accreditation: String,
    establishedYear: Number,

    collegeType: {
      type: String,
      enum: ["Private", "Government", "Deemed", "Autonomous"],
    },

    website: String,
    email: String,

    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
      twitter: String,
    },

    /** 🔥 AI MATCHING CORE */

    // How well different skill types succeed in this college
    competencyProfile: {
      analytical: { type: Number, min: 0, max: 100, default: 50 },
      verbal: { type: Number, min: 0, max: 100, default: 50 },
      creative: { type: Number, min: 0, max: 100, default: 50 },
      scientific: { type: Number, min: 0, max: 100, default: 50 },
      social: { type: Number, min: 0, max: 100, default: 50 },
      technical: { type: Number, min: 0, max: 100, default: 50 },
    },

    // Academic domains the college is strong in
    focusAreas: [
      {
        type: String,
        enum: [
          "Engineering",
          "Medical",
          "Design",
          "Arts",
          "Commerce",
          "Law",
          "Management",
          "Research",
          "Vocational",
          "Technology",
          "AI",
          "Data Science",
          "Media",
          "Healthcare",
        ],
      },
    ],

    // Teaching orientation
    teachingStyle: {
      type: String,
      enum: [
        "Practical",
        "Research",
        "Industry-Oriented",
        "Academic",
        "Balanced",
      ],
    },

    // Ideal student type
    bestFor: [
      {
        type: String,
        enum: [
          "High Achievers",
          "Average Students",
          "Creative Minds",
          "Research Oriented",
          "Career Focused",
          "Entrepreneurs",
          "First-Generation Learners",
        ],
      },
    ],

    /** 💼 PLACEMENT & CAREER STRENGTH */
    placementStats: {
      averagePackage: Number,
      highestPackage: Number,
      placementRate: { type: Number, min: 0, max: 100 },
      topRecruiters: [String],
    },

    /** 💰 FEES (for budget matching) */
    feeRange: {
      min: Number,
      max: Number,
    },

    /** 🌍 CAMPUS LIFE */
    campusType: {
      type: String,
      enum: ["Urban", "Semi-Urban", "Rural"],
    },

    hostelAvailable: Boolean,
    internationalExposure: Boolean,

    facilities: [String], // labs, library, sports, incubation center, etc.

    /** 🏆 REPUTATION / RANKING METRICS */
    rating: { type: Number, min: 0, max: 5, default: 3.5 },
    nirfRank: Number,
    researchScore: { type: Number, min: 0, max: 100 },
    industryCollaborationScore: { type: Number, min: 0, max: 100 },

    /** 📊 PLATFORM METRICS (for boosting) */
    totalStudents: Number,
    totalCourses: Number,
    enrollmentCount: { type: Number, default: 0 }, // how many users chose this college

    /** ADMIN STATUS */
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { timestamps: true }
);

/** 🔎 INDEXES FOR FAST SEARCH & RECOMMENDATION */
CollegeSchema.index({ name: "text", description: "text", focusAreas: 1 });
CollegeSchema.index({ "location.city": 1, "location.state": 1 });
CollegeSchema.index({ rating: -1 });
CollegeSchema.index({ nirfRank: 1 });

module.exports = mongoose.model("College", CollegeSchema);
