const mongoose = require("mongoose");

const TestResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  overallScore: Number,
  sectionScores: [
    {
      section: String,
      score: Number,
    },
  ],
  careerRecommendations: [
    {
      title: String,
      match: Number,
      description: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestResult", TestResultSchema);
