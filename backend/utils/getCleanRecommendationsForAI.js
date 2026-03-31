// utils/getCleanRecommendationsForAI.js

const Recommendation = require("../models/Recommendation");
const TestResult = require("../models/TestResult");
const Course = require("../models/Course");
const Job = require("../models/Job");

async function getCleanRecommendationsForAI(userId) {
  /* =====================================================
     1️⃣ GET LATEST RECOMMENDATION ONLY (not 10)
  ===================================================== */
  const rec = await Recommendation.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  if (!rec) return null;

  /* =====================================================
     2️⃣ GET TEST RESULT (LIGHT)
  ===================================================== */
  const testResult = await TestResult.findById(rec.testResultId)
    .populate("testId", "title category")
    .lean();

  /* =====================================================
     3️⃣ COLLECT IDS
  ===================================================== */
  const courseIds = [];
  const jobIds = [];

  (rec.recommendedItems || []).forEach((item) => {
    if (item.itemType === "Course") courseIds.push(item.itemId);
    if (item.itemType === "Job") jobIds.push(item.itemId);
  });

  /* =====================================================
     4️⃣ FETCH DATA (ONLY REQUIRED FIELDS)
  ===================================================== */
  const [courses, jobs] = await Promise.all([
    Course.find({ _id: { $in: courseIds } })
      .populate("collegeId", "name location")
      .select(
        "title description duration coreSkills careerDomains placementStats.averagePackage"
      )
      .lean(),

    Job.find({ _id: { $in: jobIds } })
      .populate("companyId", "name")
      .select("title location salary skillsRequired type")
      .lean(),
  ]);

  const courseMap = {};
  courses.forEach((c) => (courseMap[c._id.toString()] = c));

  const jobMap = {};
  jobs.forEach((j) => (jobMap[j._id.toString()] = j));

  /* =====================================================
     5️⃣ BUILD CLEAN COURSES (TOP 3)
  ===================================================== */
  const cleanCourses = (rec.recommendedItems || [])
    .filter((i) => i.itemType === "Course")
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3)
    .map((item) => {
      const c = courseMap[item.itemId?.toString()];
      if (!c) return null;

      return {
        title: c.title,
        college: c.collegeId?.name,
        location: c.collegeId?.location?.city,
        duration: c.duration,
        description: c.description?.slice(0, 120),

        coreSkills: c.coreSkills?.slice(0, 4),
        careerDomains: c.careerDomains?.slice(0, 3),

        averagePackage: c.placementStats?.averagePackage,

        matchScore: item.similarityScore,
        reasoning: item.reasoning,
      };
    })
    .filter(Boolean);

  /* =====================================================
     6️⃣ BUILD CLEAN JOBS (TOP 2)
  ===================================================== */
  const cleanJobs = (rec.recommendedItems || [])
    .filter((i) => i.itemType === "Job")
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 2)
    .map((item) => {
      const j = jobMap[item.itemId?.toString()];
      if (!j) return null;

      return {
        title: j.title,
        company: j.companyId?.name,
        location: j.location?.city,

        salaryRange: j.salary
          ? `${j.salary.min || ""}-${j.salary.max || ""}`
          : null,

        skillsRequired: j.skillsRequired?.slice(0, 5),
        type: j.type,

        matchScore: item.similarityScore,
        reasoning: item.reasoning,
      };
    })
    .filter(Boolean);

  /* =====================================================
     7️⃣ FINAL AI PAYLOAD
  ===================================================== */
  return {
    userProfile: {
      score: testResult?.percentage,
      test: {
        title: testResult?.testId?.title,
        category: testResult?.testId?.category,
      },

      topCompetencies: rec.topCompetencies,
      competencies: rec.competencyVector,
    },

    recommendedCourses: cleanCourses,
    recommendedJobs: cleanJobs,
  };
}

module.exports = getCleanRecommendationsForAI;
