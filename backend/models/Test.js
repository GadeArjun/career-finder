const mongoose = require("mongoose");

/* =========================================================
   🔹 OPTION SCHEMA
========================================================= */
const OptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },

    // Multiplier for scoring (for advanced scoring logic)
    weight: { type: Number, default: 1 },

    // Whether correct (for knowledge-based questions)
    isCorrect: { type: Boolean, default: false },

    // Personality influence (optional)
    personalityImpact: {
      type: String,
      enum: ["Leader", "Creative", "Analytical", "Empathetic", "Practical"],
    },
  },
  { _id: false }
);

/* =========================================================
   🔹 QUESTION SCHEMA
========================================================= */
const QuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["MCQ", "TrueFalse", "Numeric", "Scenario", "Descriptive"],
      default: "MCQ",
    },

    correctAnswer: mongoose.Schema.Types.Mixed,

    marks: { type: Number, default: 1 },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    /* 🧠 CORE: Competency Contribution */
    competencies: {
      analytical: { type: Number, default: 0 },
      verbal: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      scientific: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
    },

    /* 🧩 Personality Trait Mapping */
    personalityTraits: {
      leadership: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      riskTaking: { type: Number, default: 0 },
      discipline: { type: Number, default: 0 },
      adaptability: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
    },

    /* 🎯 Career Signals (Optional) */
    careerTags: [
      {
        type: String,
        enum: [
          "Engineering",
          "Medical",
          "Design",
          "Law",
          "Management",
          "Research",
          "Entrepreneurship",
          "Teaching",
          "Defense",
          "Civil Services",
          "Media",
          "AI",
          "Finance",
        ],
      },
    ],

    options: [OptionSchema],
    questionCategory: {
      type: String,
      enum: ["Aptitude", "Personality", "Technical", "Analytical", "Creative"],
      required: true,
      validate: {
        validator: function (v) {
          if (this.type === "MCQ" || this.type === "TrueFalse") {
            return v.length >= 2;
          }
          return true;
        },
        message: "MCQ/TrueFalse must have at least 2 options",
      },
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* =========================================================
   🔹 TEST SCHEMA
========================================================= */
const TestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    description: String,

    category: {
      type: String,
      enum: ["Aptitude", "Personality", "Technical", "Career Assessment"],
      default: "Career Assessment",
    },

    duration: { type: Number, default: 30 },
    questionCount: { type: Number, default: 25 },
    totalMarks: { type: Number, default: 0 },

    randomizeQuestions: { type: Boolean, default: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: {
      type: [QuestionSchema],
      validate: (arr) => arr.length > 0,
    },

    isActive: { type: Boolean, default: true },

    /* =====================================================
       🧠 AGGREGATED PROFILES (AUTO-CALCULATED)
    ===================================================== */

    competencyProfile: {
      analytical: { type: Number, default: 0 },
      verbal: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      scientific: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
    },

    personalityProfile: {
      leadership: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      riskTaking: { type: Number, default: 0 },
      discipline: { type: Number, default: 0 },
      adaptability: { type: Number, default: 0 },
      creativity: { type: Number, default: 0 },
    },

    dominantCareerSignals: [String], // auto-derived

    analytics: {
      timesTaken: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// /* =========================================================
//    ⚙️ PRE-SAVE AI AGGREGATION
// ========================================================= */
// TestSchema.pre("save", function (next) {
//   this.totalMarks = this.questions.reduce((s, q) => s + (q.marks || 1), 0);

//   const compTotals = {
//     analytical: 0,
//     verbal: 0,
//     creative: 0,
//     scientific: 0,
//     social: 0,
//     technical: 0,
//   };

//   const persTotals = {
//     leadership: 0,
//     teamwork: 0,
//     riskTaking: 0,
//     discipline: 0,
//     adaptability: 0,
//     creativity: 0,
//   };

//   const careerCount = {};

//   this.questions.forEach((q) => {
//     for (const k in compTotals) compTotals[k] += q.competencies[k] || 0;
//     for (const k in persTotals) persTotals[k] += q.personalityTraits[k] || 0;

//     q.careerTags?.forEach((tag) => {
//       careerCount[tag] = (careerCount[tag] || 0) + 1;
//     });
//   });

//   const count = this.questions.length || 1;

//   for (const k in compTotals)
//     this.competencyProfile[k] = +(compTotals[k] / count).toFixed(2);

//   for (const k in persTotals)
//     this.personalityProfile[k] = +(persTotals[k] / count).toFixed(2);

//   this.dominantCareerSignals = Object.entries(careerCount)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 5)
//     .map((e) => e[0]);

//   next();
// });

/* =========================================================
   ⚙️ PRE-SAVE AI AGGREGATION (Normalized Competencies)
========================================================= */
TestSchema.pre("save", function (next) {
  // Total marks
  this.totalMarks = this.questions.reduce((s, q) => s + (q.marks || 1), 0);

  // Initialize totals
  const compTotals = {
    analytical: 0,
    verbal: 0,
    creative: 0,
    scientific: 0,
    social: 0,
    technical: 0,
  };

  const persTotals = {
    leadership: 0,
    teamwork: 0,
    riskTaking: 0,
    discipline: 0,
    adaptability: 0,
    creativity: 0,
  };

  const careerCount = {};

  // Track max per competency (for normalization)
  const maxPerComp = {
    analytical: 0,
    verbal: 0,
    creative: 0,
    scientific: 0,
    social: 0,
    technical: 0,
  };

  // Aggregate all questions
  this.questions.forEach((q) => {
    for (const k in compTotals) {
      const val = q.competencies[k] || 0;
      compTotals[k] += val;
      if (val > maxPerComp[k]) maxPerComp[k] = val;
    }

    for (const k in persTotals) {
      persTotals[k] += q.personalityTraits[k] || 0;
    }

    q.careerTags?.forEach((tag) => {
      careerCount[tag] = (careerCount[tag] || 0) + 1;
    });
  });

  const questionCount = this.questions.length || 1;

  // Normalize competency scores to 0–100
  for (const k in compTotals) {
    // average per question
    const avg = compTotals[k] / questionCount;
    // optional: normalize relative to max score per question (if desired)
    // Here we assume max per question is maxPerComp[k], prevent division by zero
    const normalized = maxPerComp[k] > 0 ? (avg / maxPerComp[k]) * 100 : avg;
    this.competencyProfile[k] = +Math.min(normalized, 100).toFixed(2);
  }

  // Personality averages (can normalize too if needed)
  for (const k in persTotals) {
    this.personalityProfile[k] = +(persTotals[k] / questionCount).toFixed(2);
  }

  // Top 5 career signals
  this.dominantCareerSignals = Object.entries(careerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((e) => e[0]);

  next();
});
/* =========================================================
   📊 INDEXES FOR AI MATCHING SPEED
========================================================= */
TestSchema.index({ title: "text", description: "text" });
TestSchema.index({ category: 1 });
TestSchema.index({ isActive: 1 });
TestSchema.index({ "competencyProfile.technical": 1 });
TestSchema.index({ "competencyProfile.analytical": 1 });

module.exports = mongoose.model("Test", TestSchema);
