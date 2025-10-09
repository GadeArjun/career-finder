const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseName: String,
  collegeName: String,
  collegeLogo: String,
  duration: String,
  fee: String,
  mode: String,
  tags: [String],
  overview: String,
  eligibility: String,
  admissionProcess: String,
});

module.exports = mongoose.model("Course", CourseSchema);
