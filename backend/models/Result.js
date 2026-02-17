const mongoose = require("mongoose")

const ResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    score: Number,
    categoryScores: {
      aptitude: Number,
      technical: Number,
      analytical: Number,
      creative: Number,
    },
    competencyProfile: Object, // Final calculated values
    personalityProfile: Object, // Final calculated values
    suggestedCareers: [String],
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", ResultSchema);

module.exports = Result;

