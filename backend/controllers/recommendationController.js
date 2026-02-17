// controllers/recommendationController.js
const mongoose = require("mongoose");
const TestResult = require("../models/TestResult");
const Course = require("../models/Course");
const College = require("../models/College");
const Recommendation = require("../models/Recommendation");
const Job = require("../models/Job");

// Optional: Redis cache (uncomment if you install redis client and provide client)
// const redisClient = require("../lib/redisClient");

/**
 * Helpers
 */

/**
 * Normalize a competency/vector object into an array ordered by keys.
 * Keys used must match Course.competencyProfile and TestResult.competencyScores keys.
 */
const competencyKeys = [
  "analytical",
  "verbal",
  "creative",
  "scientific",
  "social",
  "technical",
];

function vectorFromMap(obj) {
  // obj might be a Map or plain object
  const v = competencyKeys.map((k) => {
    const raw = obj?.[k] ?? (obj?.get && obj.get(k)) ?? 0;
    return Number(raw) || 0;
  });
  return v;
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function magnitude(a) {
  return Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
}

/** Cosine similarity in [0,1] (if one vector all zeros -> return 0) */
function cosineSimilarity(a, b) {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dot(a, b) / (magA * magB);
}

/** Safely compute percent similarity (0-100) */
function similarityPercent(a, b) {
  return Math.round(cosineSimilarity(a, b) * 10000) / 100; // 2 decimals
}

/**
 * Business ranking function.
 * Input: raw course docs + similarity score
 * Apply boosts for popularity, collegeRating, eligibility matches, recency etc.
 */
function applyBusinessBoosts(course, baseSimilarity, options = {}) {
  // options: { boostPopularity: boolean, boostCollegeRating: boolean, minBoost, weights: {popularity, rating, recency} }
  const weights = (options.weights = options.weights || {});
  const popularityW = weights.popularity ?? 0.12;
  const ratingW = weights.rating ?? 0.1;
  const recencyW = weights.recency ?? 0.05;
  const eligibilityW = weights.eligibility ?? 0.08;

  let score = baseSimilarity;

  // Popularity boost (e.g., enrollmentCount normalized)
  if (course.enrollmentCount && popularityW) {
    const popBoost = Math.log1p(course.enrollmentCount) / 10; // scales slowly
    score += popBoost * popularityW;
  }

  // College rating boost
  if (course.college && course.college.rating && ratingW) {
    // assume rating 0-5 -> normalized
    score += (course.college.rating / 5) * ratingW;
  }

  // recency: newer courses may get small bump
  if (course.createdAt && recencyW) {
    const days =
      (Date.now() - new Date(course.createdAt)) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - days / 365); // 1 => new, 0 => >1yr old
    score += recencyBoost * recencyW;
  }

  // eligibility matching example: if student has prerequisites match -> bump
  if (options.eligible) {
    score += eligibilityW;
  }

  return Math.max(0, score); // do not go negative
}

/**
 * Safe fetch courses to compare:
 * - Accept filters: domains (topics), mode, feeRange, collegeIds, etc.
 * - return populated college info (for boosts)
 */
async function fetchCandidateCourses(filters = {}, limit = 1000) {
  // Build query
  const q = { isActive: true };

  if (filters.topics && filters.topics.length)
    q.topics = { $in: filters.topics };
  if (filters.mode) q.mode = filters.mode; // e.g., 'Online' | 'Offline' | 'Hybrid'
  if (filters.minFee || filters.maxFee) {
    q.fee = {};
    if (filters.minFee) q.fee.$gte = filters.minFee;
    if (filters.maxFee) q.fee.$lte = filters.maxFee;
  }
  if (filters.collegeIds && filters.collegeIds.length)
    q.collegeId = { $in: filters.collegeIds };

  // Always include competencyProfile fields when fetching
  return await Course.find(q)
    .limit(limit)
    .populate("collegeId", "name rating location")
    .lean();
}

/**
 * Compute top N course recommendations for a competency vector
 * @param {Object} params
 *  - userId
 *  - competencyVector: plain object or Map
 *  - candidateFilters
 *  - topN
 *  - persist: boolean -> whether to save Recommendation doc
 */
async function computeRecommendations({
  userId,
  testResultId = null,
  competencyVector,
  candidateFilters = {},
  topN = 10,
  persist = true,
  debug = false,
}) {
  // Normalize to numeric vector
  const userVector = vectorFromMap(competencyVector);

  // Candidate courses (you can fine tune limit)
  const candidates = await fetchCandidateCourses(candidateFilters, 2000);

  if (!candidates || !candidates.length) {
    return { recommendations: [], reason: "no-candidate-courses" };
  }

  // Score each candidate
  const scored = candidates.map((c) => {
    const cp = vectorFromMap(c.competencyProfile || {});
    const baseSim = cosineSimilarity(userVector, cp); // 0..1
    // apply business boosts with some options
    const courseWithCollege = { ...c, college: c.collegeId || null };
    const boosted = applyBusinessBoosts(courseWithCollege, baseSim, {
      eligible: false, // TODO: compute eligibility rules later
    });

    return {
      courseId: c._id,
      title: c.courseName || c.title || "Unnamed Course",
      college: c.collegeId
        ? {
            id: c.collegeId._id,
            name: c.collegeId.name,
            rating: c.collegeId.rating,
          }
        : null,
      baseSimilarity: Math.round(baseSim * 10000) / 100,
      finalScore: Math.round(boosted * 10000) / 100,
      raw: c,
    };
  });

  // sort by finalScore desc, tiebreak by baseSimilarity then popularity
  scored.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.baseSimilarity !== a.baseSimilarity)
      return b.baseSimilarity - a.baseSimilarity;
    const popA = a.raw.enrollmentCount || 0;
    const popB = b.raw.enrollmentCount || 0;
    return popB - popA;
  });

  const top = scored.slice(0, topN);

  // persist as Recommendation document (if requested)
  let recDoc = null;
  if (persist) {
    // create or upsert
    const recPayload = {
      userId,
      testResultId,
      createdAt: new Date(),
      competencyVector,
      topCourses: top.map((t) => ({
        courseId: t.courseId,
        score: t.finalScore,
        baseSimilarity: t.baseSimilarity,
      })),
      meta: {
        candidateCount: candidates.length,
        filters: candidateFilters,
      },
    };

    // Upsert so we have one latest record per testResult or per user
    const query = testResultId ? { testResultId } : { userId };
    recDoc = await Recommendation.findOneAndUpdate(query, recPayload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  return { recommendations: top, persisted: recDoc !== null ? recDoc : null };
}

/* ============================================================
   Controller endpoints
   ============================================================ */

/**
 * POST /api/recommendations/for-result
 * Payload: { testResultId, topN?, candidateFilters? }
 * Protected: student or admin (whoever triggers)
 */
exports.recommendForTestResult = async (req, res) => {
  try {
    const { testResultId, topN = 10, candidateFilters = {} } = req.body;
    if (!testResultId)
      return res.status(400).json({ message: "testResultId required" });

    const result = await TestResult.findById(testResultId).lean();
    if (!result)
      return res.status(404).json({ message: "TestResult not found" });

    const competencyVector =
      result.competencyScores || result.topicScores || {};
    if (!competencyVector || Object.keys(competencyVector).length === 0) {
      return res
        .status(400)
        .json({ message: "No competency vector found on TestResult" });
    }

    const { recommendations, persisted } = await computeRecommendations({
      userId: result.userId,
      testResultId,
      competencyVector,
      candidateFilters,
      topN,
      persist: true,
    });

    return res.json({ success: true, recommendations, persisted });
  } catch (err) {
    console.error("recommendForTestResult error:", err);
    return res
      .status(500)
      .json({ message: "Server error generating recommendations" });
  }
};

/**
 * POST /api/recommendations/for-user
 * Payload: { userId?, topN?, candidateFilters? }
 * If userId not provided use req.user._id
 * This method looks up latest TestResult for user and generates recommendations.
 */
exports.recommendForUser = async (req, res) => {
  try {
    const userId = req.body.userId || req.user._id;
    const topN = Number(req.body.topN) || 10;
    const candidateFilters = req.body.candidateFilters || {};

    // find latest test result
    const latest = await TestResult.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!latest)
      return res.status(404).json({ message: "No TestResult found for user" });

    const competencyVector =
      latest.competencyScores || latest.topicScores || {};
    const { recommendations, persisted } = await computeRecommendations({
      userId,
      testResultId: latest._id,
      competencyVector,
      candidateFilters,
      topN,
      persist: true,
    });

    return res.json({ success: true, recommendations, persisted });
  } catch (err) {
    console.error("recommendForUser error:", err);
    return res
      .status(500)
      .json({ message: "Server error generating recommendations" });
  }
};

/**
 * GET /api/recommendations/my
 * Get latest persisted recommendation for current user (paginated)
 */

exports.getMyRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Get latest recommendation only
    const rec = await Recommendation.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!rec) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    /* =====================================================
       🎓 COURSE ENRICHMENT
    ====================================================== */

    const courseIds = rec.recommendedCourses.map((c) => c.courseId);

    const courses = await Course.find({
      _id: { $in: courseIds },
    })
      .populate("collegeId", "name rating location")
      .lean();

    const courseMap = {};
    courses.forEach((c) => (courseMap[c._id.toString()] = c));

    const enrichedCourses = rec.recommendedCourses.map((c) => ({
      ...c,
      course: courseMap[c.courseId.toString()] || null,
    }));

    /* =====================================================
       💼 JOB ENRICHMENT
    ====================================================== */

    const jobIds = rec.recommendedJobs?.map((j) => j.jobId);

    const jobs = await Job.find({
      _id: { $in: jobIds },
    })
      .populate("companyId", "name logo industry")
      .lean();
    console.log(rec);
    const jobMap = {};
    jobs.forEach((j) => (jobMap[j._id.toString()] = j));

    const enrichedJobs = rec.recommendedJobs?.map((j) => ({
      ...j,
      job: jobMap[j.jobId.toString()] || null,
    }));

    /* =====================================================
       📦 FINAL RESPONSE
    ====================================================== */

    return res.json({
      success: true,
      recommendationId: rec._id,
      topCompetencies: rec.topCompetencies,
      courses: enrichedCourses,
      jobs: enrichedJobs,
      meta: rec.meta,
    });
  } catch (err) {
    console.error("getMyRecommendations error:", err);
    return res.status(500).json({
      message: "Server error fetching recommendations",
    });
  }
};

/**
 * GET /api/recommendations/:id
 * Admin: get a recommendation document and expanded results
 */
exports.getRecommendationById = async (req, res) => {
  try {
    const rec = await Recommendation.findById(req.params.id).lean();
    if (!rec)
      return res.status(404).json({ message: "Recommendation not found" });

    const courseIds = rec.topCourses.map((t) => t.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } })
      .populate("collegeId", "name rating location")
      .lean();

    const byId = {};
    courses.forEach((c) => (byId[c._id.toString()] = c));
    const enriched = rec.topCourses.map((t) => ({
      ...t,
      course: byId[t.courseId.toString()] || null,
    }));

    return res.json({ success: true, recommendation: rec, results: enriched });
  } catch (err) {
    console.error("getRecommendationById error:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching recommendation" });
  }
};

/**
 * DELETE /api/recommendations/:id
 * Admin or owner can delete
 */
exports.deleteRecommendation = async (req, res) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec)
      return res.status(404).json({ message: "Recommendation not found" });

    // only admin or owner
    if (
      req.user.role !== "admin" &&
      rec.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await rec.deleteOne();
    return res.json({ success: true, message: "Recommendation removed" });
  } catch (err) {
    console.error("deleteRecommendation error:", err);
    return res
      .status(500)
      .json({ message: "Server error deleting recommendation" });
  }
};

/**
 * Admin analytics: GET /api/recommendations/analytics/top-courses
 * Returns most recommended courses across all users (aggregated)
 */
exports.topRecommendedCourses = async (req, res) => {
  try {
    // aggregate through Recommendation.topCourses array
    const pipeline = [
      { $unwind: "$topCourses" },
      {
        $group: {
          _id: "$topCourses.courseId",
          timesRecommended: { $sum: 1 },
          avgScore: { $avg: "$topCourses.score" },
        },
      },
      { $sort: { timesRecommended: -1, avgScore: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseId: "$_id",
          title: "$course.courseName",
          collegeId: "$course.collegeId",
          timesRecommended: 1,
          avgScore: 1,
        },
      },
    ];

    const rows = await Recommendation.aggregate(pipeline);
    return res.json({ success: true, rows });
  } catch (err) {
    console.error("topRecommendedCourses error:", err);
    return res.status(500).json({ message: "Server error fetching analytics" });
  }
};

/* Export the compute helper if other modules want to call it directly */
exports.computeRecommendations = computeRecommendations;
