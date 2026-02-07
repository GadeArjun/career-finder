const TestResult = require("../models/TestResult");
const Recommendation = require("../models/Recommendation");

exports.checkStudentOnboarding = async (userId) => {
  const testCount = await TestResult.countDocuments({ userId });

  if (testCount > 0) {
    const latestRecommendation = await Recommendation.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("recommendedCourses.courseId");

    return {
      hasTakenTest: true,
      recommendation: latestRecommendation,
    };
  }

  return {
    hasTakenTest: false,
    message: "Student must take career assessment",
  };
};
