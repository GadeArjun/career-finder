const Course = require("../models/Course");
const Job = require("../models/Job");
const Recommendation = require("../models/Recommendation");

const { cosineSimilarity } = require("../utils/similarity");
const {
  mapStudentToCourseVector,
  mapStudentToJobVector,
} = require("../utils/vectorMapper");

exports.generateFullRecommendations = async ({ userId, testResult }) => {
  const start = Date.now();
  const student = testResult.competencyScores;

  /* =============================
     🎓 COURSE MATCHING
  ============================== */

  const studentCourseVector = mapStudentToCourseVector(student);
  const courses = await Course.find({ status: "active" }).lean();

  const courseResults = courses.map((course) => {
    const similarity = cosineSimilarity(
      studentCourseVector,
      course.skillOutcomeProfile
    );

    // boost by popularity
    const boost = (course.popularityScore || 50) / 100;

    const finalScore = similarity * 0.85 + boost * 0.15;

    return {
      courseId: course._id,
      collegeId: course.collegeId,
      similarityScore: Number(finalScore.toFixed(4)),
      reasoning: `Strong alignment with course skill profile.`,
    };
  });

  courseResults.sort((a, b) => b.similarityScore - a.similarityScore);

  /* =============================
     💼 JOB MATCHING
  ============================== */

  const studentJobVector = mapStudentToJobVector(student);
  const jobs = await Job.find({ status: "open" }).lean();

  const jobResults = jobs.map((job) => {
    const similarity = cosineSimilarity(
      studentJobVector,
      job.competencyWeights
    );

    const boost = (job.priorityScore || 50) / 100;

    const finalScore = similarity * 0.9 + boost * 0.1;

    return {
      jobId: job._id,
      similarityScore: Number(finalScore.toFixed(4)),
      reasoning: `Matches required competency strengths.`,
    };
  });

  jobResults.sort((a, b) => b.similarityScore - a.similarityScore);

  /* =============================
     🧠 SAVE RECOMMENDATION
  ============================== */

  const recommendation = await Recommendation.create({
    userId,
    testResultId: testResult._id,
    competencyVector: student,

    recommendedCourses: courseResults.slice(0, 30),
    recommendedJobs: jobResults.slice(0, 30),

    topCompetencies: Object.entries(student)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((c) => c[0]),

    meta: {
      candidateCount: courses.length + jobs.length,
      generationTimeMs: Date.now() - start,
      algorithm: "hybrid_cosine_boost_v2",
    },
  });

  return recommendation;
};
