// File: models/Recommendation.js
const mongoose = require("mongoose");

/* ------------------------------------------------------------------
   🔹 Recommended Item Schema (Course / Job)
-------------------------------------------------------------------*/
const RecommendedItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ["Course", "Job"],
      required: true,
      index: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "recommendedItems.itemType", // dynamic ref
    },

    similarityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      index: true,
    },

    rank: {
      type: Number,
      default: 0,
      index: true,
    },

    strength: {
      type: String,
      enum: ["very_high", "high", "medium", "low"],
      default: "medium",
      index: true,
    },

    reasoning: {
      type: String,
      trim: true,
      default: "",
    },

    matchedSkills: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/* ------------------------------------------------------------------
   🧠 Recommendation Schema
-------------------------------------------------------------------*/
const RecommendationSchema = new mongoose.Schema(
  {
    // 🔹 Ownership
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testResultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestResult",
      required: true,
      index: true,
    },

    /* ------------------------------------------------------------------
       🔹 Competency Snapshot
    -------------------------------------------------------------------*/
    competencyVector: {
      analytical: { type: Number, default: 0 },
      verbal: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      scientific: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
    },
    /* ------------------------------------------------------------------
       🔹 Recommendations (Courses + Jobs)
    -------------------------------------------------------------------*/
    recommendedItems: [RecommendedItemSchema],

    /* ------------------------------------------------------------------
       🔹 Summary
    -------------------------------------------------------------------*/
    topCompetencies: {
      type: [String],
      default: [],
      index: true,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    totalItems: {
      type: Number,
      default: 0,
    },

    /* ------------------------------------------------------------------
       🔹 Lifecycle
    -------------------------------------------------------------------*/
    version: {
      type: Number,
      default: 1,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiresAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "stale", "expired"],
      default: "active",
    },

    /* ------------------------------------------------------------------
       🔹 Metadata (AI + Debugging)
    -------------------------------------------------------------------*/
    meta: {
      filters: { type: Object },
      candidateCount: { type: Number, default: 0 },
      generationTimeMs: { type: Number, default: 0 },
      algorithm: { type: String, default: "cosine_similarity_v2" },
    },
  },
  { timestamps: true }
);

/* ------------------------------------------------------------------
   ⚙️ Middleware — Auto Processing
-------------------------------------------------------------------*/
RecommendationSchema.pre("save", function (next) {
  if (Array.isArray(this.recommendedItems) && this.recommendedItems.length) {
    // 🔹 Sort by score
    this.recommendedItems.sort((a, b) => b.similarityScore - a.similarityScore);

    // 🔹 Assign rank + strength
    this.recommendedItems.forEach((item, i) => {
      item.rank = i + 1;

      if (item.similarityScore >= 0.85) item.strength = "very_high";
      else if (item.similarityScore >= 0.7) item.strength = "high";
      else if (item.similarityScore >= 0.5) item.strength = "medium";
      else item.strength = "low";
    });

    // 🔹 Compute averages
    const top10 = this.recommendedItems.slice(0, 10);
    const avg =
      top10.reduce((sum, i) => sum + (i.similarityScore || 0), 0) /
      (top10.length || 1);

    this.averageScore = Number(avg.toFixed(4));
    this.totalItems = this.recommendedItems.length;
  } else {
    this.averageScore = 0;
    this.totalItems = 0;
  }

  next();
});

/* ------------------------------------------------------------------
   🧩 Indexes
-------------------------------------------------------------------*/
RecommendationSchema.index({ userId: 1, generatedAt: -1 });
RecommendationSchema.index({ testResultId: 1 });
RecommendationSchema.index({ averageScore: -1 });
RecommendationSchema.index({ "recommendedItems.similarityScore": -1 });

/* ------------------------------------------------------------------
   🔍 Methods
-------------------------------------------------------------------*/

// Vector magnitude (analytics / ML tuning)
RecommendationSchema.methods.vectorMagnitude = function () {
  const v = Object.values(this.competencyVector);
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
};

// Top N items
RecommendationSchema.methods.topItems = function (limit = 5) {
  return (this.recommendedItems || []).slice(0, limit);
};

// Filter by type (course/job)
RecommendationSchema.methods.getByType = function (type = "course") {
  return (this.recommendedItems || []).filter((item) => item.itemType === type);
};

// Mark stale
RecommendationSchema.methods.markStale = async function () {
  this.status = "stale";
  await this.save();
  return this;
};

/* ------------------------------------------------------------------
   ⏳ TTL Index (Auto Delete Expired Docs)
-------------------------------------------------------------------*/
RecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* ------------------------------------------------------------------
   ✅ Export
-------------------------------------------------------------------*/
module.exports = mongoose.model("Recommendation", RecommendationSchema);
