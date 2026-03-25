const Course = require("../models/Course");
const Job = require("../models/Job");
const Recommendation = require("../models/Recommendation");

const { cosineSimilarity } = require("../utils/similarity");
const {
  mapStudentToCourseVector,
  mapStudentToJobVector,
} = require("../utils/vectorMapper");

/* ------------------------------------------------------------------
   🧠 Get Top Competencies
-------------------------------------------------------------------*/
const getTopCompetencies = (vector, topN = 3) => {
  return Object.entries(vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key]) => key);
};

/* ------------------------------------------------------------------
   🧠 Skill Gap (FIXED LOGIC)
   Only show real weaknesses
-------------------------------------------------------------------*/
const getSkillGap = (studentVec, targetVec = {}) => {
  const gaps = [];

  for (const key in targetVec) {
    const studentVal = studentVec[key] || 0;
    const targetVal = targetVec[key] || 0;

    // Only if user is significantly weaker
    if (studentVal < targetVal * 0.6) {
      gaps.push(key);
    }
  }

  return gaps;
};

/* ------------------------------------------------------------------
   🧠 Better Reasoning (Human-like)
-------------------------------------------------------------------*/
const generateReasoning = ({ similarity, topSkills, gaps }) => {
  let reason = "";

  if (similarity >= 0.85) {
    reason += "Excellent match for your strengths. ";
  } else if (similarity >= 0.7) {
    reason += "Strong fit based on your abilities. ";
  } else if (similarity >= 0.5) {
    reason += "Decent option with some improvement needed. ";
  } else {
    reason += "Challenging path, requires significant upskilling. ";
  }

  if (topSkills.length) {
    reason += `You are strong in ${topSkills.join(", ")}. `;
  }

  if (gaps.length) {
    reason += `Improve: ${gaps.slice(0, 3).join(", ")}.`;
  } else {
    reason += "You already meet most key requirements.";
  }

  return reason.trim();
};

/* ------------------------------------------------------------------
   🧠 Strength Label
-------------------------------------------------------------------*/
const getStrengthLabel = (score) => {
  if (score >= 0.85) return "very_high";
  if (score >= 0.7) return "high";
  if (score >= 0.5) return "medium";
  return "low";
};

/* ------------------------------------------------------------------
   🚀 MAIN ENGINE
-------------------------------------------------------------------*/
exports.generateFullRecommendations = async ({ userId, testResult }) => {
  const start = Date.now();
  const student = testResult.competencyScores;

  const studentCourseVector = mapStudentToCourseVector(student);
  const studentJobVector = mapStudentToJobVector(student);

  /* ------------------------------------------------------------------
     ⚡ FETCH DATA (OPTIMIZED)
  -------------------------------------------------------------------*/
  const [courses, jobs] = await Promise.all([
    Course.find({ status: "active" }).lean(),
    Job.find({ status: "open" }).lean(),
  ]);

  const topSkills = getTopCompetencies(student, 3);

  /* =============================
     🎓 COURSE MATCHING
  ============================== */
  const courseResults = courses.map((course) => {
    const similarity = cosineSimilarity(
      studentCourseVector,
      course.skillOutcomeProfile || {}
    );

    const popularityBoost = (course.popularityScore || 50) / 100;
    const demandBoost = course.industryDemand || 0.5;

    // 🔥 Improved scoring
    let finalScore =
      similarity * 0.65 + popularityBoost * 0.15 + demandBoost * 0.2;

    // 🔥 Small randomness to avoid ties
    finalScore += Math.random() * 0.02;

    const gaps = getSkillGap(studentCourseVector, course.skillOutcomeProfile);

    const matchedSkills = (course.coreSkills || []).filter((skill) =>
      topSkills.includes(skill.toLowerCase())
    );

    return {
      itemType: "Course",
      itemId: course._id,
      similarityScore: Number(finalScore.toFixed(4)),
      strength: getStrengthLabel(finalScore),
      reasoning: generateReasoning({
        similarity: finalScore,
        topSkills,
        gaps,
      }),
      matchedSkills,
    };
  });

  /* =============================
     💼 JOB MATCHING
  ============================== */
  const jobResults = jobs.map((job) => {
    const similarity = cosineSimilarity(
      studentJobVector,
      job.competencyWeights || {}
    );

    const demandBoost =
      (job.marketDemandScore || job.priorityScore || 50) / 100;

    let finalScore = similarity * 0.7 + demandBoost * 0.2;

    // boost if technical user + dev job
    if (
      topSkills.includes("technical") &&
      job.title?.toLowerCase().includes("developer")
    ) {
      finalScore += 0.05;
    }

    finalScore += Math.random() * 0.02;

    const gaps = getSkillGap(studentJobVector, job.competencyWeights);

    const matchedSkills = (job.skillsRequired || []).filter((skill) =>
      topSkills.includes(skill.toLowerCase())
    );

    return {
      itemType: "Job",
      itemId: job._id,
      similarityScore: Number(finalScore.toFixed(4)),
      strength: getStrengthLabel(finalScore),
      reasoning: generateReasoning({
        similarity: finalScore,
        topSkills,
        gaps,
      }),
      matchedSkills,
    };
  });

  /* =============================
     🧠 MERGE + SORT
  ============================== */
  let allResults = [...courseResults, ...jobResults];

  allResults.sort((a, b) => b.similarityScore - a.similarityScore);

  /* =============================
     🧠 DIVERSITY CONTROL
  ============================== */
  const diversified = [];
  let courseCount = 0;
  let jobCount = 0;

  for (const item of allResults) {
    if (diversified.length >= 60) break;

    if (item.itemType === "Course" && courseCount < 30) {
      diversified.push(item);
      courseCount++;
    } else if (item.itemType === "Job" && jobCount < 30) {
      diversified.push(item);
      jobCount++;
    }
  }

  if (!diversified.length) {
    throw new Error("No recommendations generated");
  }

  /* =============================
     💾 SAVE
  ============================== */
  const recommendation = await Recommendation.create({
    userId,
    testResultId: testResult._id,
    competencyVector: student,

    recommendedItems: diversified,

    topCompetencies: topSkills,

    meta: {
      candidateCount: courses.length + jobs.length,
      generationTimeMs: Date.now() - start,
      algorithm: "intelligent_hybrid_v4",
    },
  });

  return recommendation;
};
