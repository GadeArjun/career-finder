const mongoose = require("mongoose");

const LearningPathSchema = new mongoose.Schema({
  title: String,
  steps: [
    {
      stepName: String,
      progress: Number,
    },
  ],
  resources: [
    {
      title: String,
      type: String,
      duration: String,
      tag: String,
    },
  ],
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);
