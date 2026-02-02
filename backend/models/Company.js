const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    /** BASIC INFO */
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true },

    industry: {
      type: String,
      enum: [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Media",
        "Retail",
        "Consulting",
        "Government",
        "Startup",
        "Research",
        "E-commerce",
        "Telecommunications",
      ],
    },

    website: String,
    logo: String,

    location: {
      city: String,
      state: String,
      country: { type: String, default: "India" },
    },

    description: String,

    companyType: {
      type: String,
      enum: ["Startup", "SME", "MNC", "Enterprise", "Government"],
    },

    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
    },

    foundedYear: Number,

    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
    },

    /** 🔥 AI MATCHING CORE */

    // What skill profile succeeds in this company
    competencyProfile: {
      analytical: { type: Number, min: 0, max: 100, default: 50 },
      verbal: { type: Number, min: 0, max: 100, default: 50 },
      creative: { type: Number, min: 0, max: 100, default: 50 },
      scientific: { type: Number, min: 0, max: 100, default: 50 },
      social: { type: Number, min: 0, max: 100, default: 50 },
      technical: { type: Number, min: 0, max: 100, default: 50 },
    },

    // Roles / career domains
    hiringDomains: [
      {
        type: String,
        enum: [
          "Software Development",
          "AI/ML",
          "Data Science",
          "Design",
          "Marketing",
          "Sales",
          "Finance",
          "Operations",
          "HR",
          "Cybersecurity",
          "Cloud",
          "Product Management",
          "Research",
        ],
      },
    ],

    // Work style match
    workStyle: {
      type: String,
      enum: [
        "Fast-Paced",
        "Structured",
        "Creative",
        "Research-Oriented",
        "Balanced",
      ],
    },

    // Ideal employee type
    bestFor: [
      {
        type: String,
        enum: [
          "High Achievers",
          "Problem Solvers",
          "Creative Thinkers",
          "Team Players",
          "Leaders",
          "Independent Workers",
          "Fresh Graduates",
        ],
      },
    ],

    /** 💼 HIRING & CAREER STRENGTH */

    hiringStats: {
      fresherHiring: { type: Boolean, default: true },
      internshipAvailable: { type: Boolean, default: true },
      avgSalary: { type: Number, default: 0 },
      maxSalary: { type: Number, default: 0 },
      hiringRate: { type: Number, min: 0, max: 100 }, // how often they hire
    },

    /** 🌍 WORK ENVIRONMENT */

    workMode: {
      type: String,
      enum: ["Onsite", "Hybrid", "Remote"],
    },

    internationalPresence: Boolean,

    perks: [String], // health insurance, stock options, flexible hours, etc.

    /** 🏆 REPUTATION & IMPACT */

    rating: { type: Number, min: 0, max: 5, default: 3.5 },
    innovationScore: { type: Number, min: 0, max: 100 },
    growthScore: { type: Number, min: 0, max: 100 },
    workCultureScore: { type: Number, min: 0, max: 100 },

    /** 📊 PLATFORM METRICS */

    totalHires: { type: Number, default: 0 },
    totalInterns: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },

    /** ADMIN STATUS */

    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

/** 🔎 INDEXES FOR SEARCH & MATCHING */
CompanySchema.index({ name: "text", description: "text", industry: 1 });
CompanySchema.index({ "location.city": 1, industry: 1 });
CompanySchema.index({ rating: -1 });
CompanySchema.index({ growthScore: -1 });

module.exports = mongoose.model("Company", CompanySchema);
