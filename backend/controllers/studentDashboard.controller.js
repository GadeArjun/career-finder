// const User = require("../models/User");
// const TestResult = require("../models/TestResult");
// const Recommendation = require("../models/Recommendation");
// const Test = require("../models/Test");

// /**
//  * @desc Get Professional AI-Powered Dashboard Insights
//  * @route GET /api/student/dashboard
//  * @access Private/Student
//  */
// exports.getDashboardInsights = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 1. Parallel Data Fetching for Performance
//     const [user, latestTestResult, latestRecommendation, testCount] =
//       await Promise.all([
//         User.findById(userId).select("-password"),
//         TestResult.findOne({ userId })
//           .sort({ completedAt: -1 })
//           .populate("testId", "title category"),
//         Recommendation.findOne({ userId }).sort({ generatedAt: -1 }).populate({
//           path: "recommendedItems.itemId",
//           select: "title name company duration essentials level",
//         }),
//         TestResult.countDocuments({ userId }),
//       ]);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Identity not verified." });
//     }

//     // 2. --- NARRATIVE ENGINE (The "AI Coach" Logic) ---
//     let aiMessage = "";
//     let status = "info";
//     let nextStep = {
//       label: "Explore Dashboard",
//       route: "/dashboard",
//       priority: "low",
//     };

//     if (testCount === 0) {
//       // Logic: No tests taken yet
//       aiMessage = `Welcome, ${
//         user.name.split(" ")[0]
//       }! Your career path is currently a 'Blank Canvas'. Take your first Career Assessment to let our AI map your competencies.`;
//       status = "warning";
//       nextStep = {
//         label: "Take First Test",
//         route: "/student/aptitude-test",
//         priority: "critical",
//       };
//     } else if (user.profileCompletion < 70) {
//       // Logic: Tests taken but profile is weak
//       aiMessage = `Great progress on your tests! However, your 'Profile Strength' is low. Recruiters prioritize complete profiles. Add your skills to boost match accuracy.`;
//       status = "action_required";
//       nextStep = {
//         label: "Complete Profile",
//         route: "/student/profile",
//         priority: "high",
//       };
//     } else if (
//       latestRecommendation &&
//       latestRecommendation.averageScore < 0.5
//     ) {
//       // Logic: Low similarity with current market items (Skill Gap)
//       aiMessage = `We've detected a 'Competency Gap' between your test results and market requirements. We recommend specific bridge courses to increase your employability.`;
//       status = "info";
//       nextStep = {
//         label: "Bridge Skill Gaps",
//         route: "/student/recommendations",
//         priority: "medium",
//       };
//     } else {
//       // Logic: Optimal status
//       aiMessage = `You're in the 'Elite Tier'! Your competency profile matches 85% of high-growth roles in your sector. Keep your activity high to stay visible to top companies.`;
//       status = "success";
//       nextStep = {
//         label: "View Best Matches",
//         route: "/student/recommendations",
//         priority: "low",
//       };
//     }

//     // 3. --- COMPETENCY AGGREGATION ---
//     // Extract scores from the latest test or provide default "baseline" scores
//     const competencies = latestTestResult
//       ? latestTestResult.competencyScores
//       : {
//           analytical: 0,
//           verbal: 0,
//           creative: 0,
//           scientific: 0,
//           social: 0,
//           technical: 0,
//         };

//     // 4. --- TREND ANALYSIS (Simple Mock Logic) ---
//     // In a real AI app, you'd compare current TestResult vs Previous TestResult
//     const topTrait = Object.entries(competencies).sort(
//       ([, a], [, b]) => b - a
//     )[0][0];

//     // 5. --- CONSTRUCT THE PROFESSIONAL RESPONSE ---
//     const dashboardData = {
//       // User Identity
//       user: {
//         id: user._id,
//         name: user.name,
//         avatar: user.avatar,
//         role: user.role,
//         isVerified: user.isVerified,
//         profileCompletion: user.profileCompletion,
//       },

//       // Vital Metrics
//       metrics: {
//         matchConfidence: latestRecommendation
//           ? Math.round(latestRecommendation.averageScore * 100)
//           : 0,
//         profileCompletion: user.profileCompletion || 0,
//         activityScore: Math.min(
//           100,
//           testCount * 15 + user.profileCompletion / 2
//         ),
//         totalTestsTaken: testCount,
//         marketPercentile: testCount > 0 ? 88 : 0, // Mocked logic: would use aggregation against all users
//       },

//       // AI Narrative Section
//       aiCoach: {
//         message: aiMessage,
//         status: status,
//         nextStep: nextStep,
//         dominantTrait: topTrait,
//         insights: [
//           `Your strongest pillar is ${topTrait.toUpperCase()}.`,
//           testCount > 1
//             ? "Your analytical score has improved by 12% this month."
//             : "Complete more tests to see trend analysis.",
//           latestRecommendation
//             ? `Found ${latestRecommendation.totalItems} potential career matches.`
//             : "Matches will appear after your next test.",
//         ],
//       },

//       // Competency Radar Data
//       competencyData: competencies,

//       // Precision Recommendations
//       recommendations: {
//         jobs: latestRecommendation
//           ? latestRecommendation.getByType("Job").slice(0, 3)
//           : [],
//         courses: latestRecommendation
//           ? latestRecommendation.getByType("Course").slice(0, 3)
//           : [],
//         summary: {
//           totalMatched: latestRecommendation
//             ? latestRecommendation.totalItems
//             : 0,
//           topSector: latestRecommendation?.topCompetencies[0] || "General",
//         },
//       },

//       // Activity Feed (Real-time events)
//       recentActivity: [
//         latestTestResult && {
//           type: "TEST_COMPLETED",
//           title: `Completed ${latestTestResult.testId?.title || "Assessment"}`,
//           date: latestTestResult.completedAt,
//           score: `${latestTestResult.percentage}%`,
//         },
//         latestRecommendation && {
//           type: "MATCH_FOUND",
//           title: "New AI Job Match Found",
//           date: latestRecommendation.generatedAt,
//           score: "High",
//         },
//       ].filter(Boolean),
//     };

//     return res.status(200).json({
//       success: true,
//       timestamp: new Date(),
//       data: dashboardData,
//     });
//   } catch (error) {
//     console.error("Dashboard Engine Critical Failure:", error);
//     return res.status(500).json({
//       success: false,
//       message: "The AI Insights engine is currently undergoing maintenance.",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };


const User = require("../models/User");
const TestResult = require("../models/TestResult");
const Recommendation = require("../models/Recommendation");
const Test = require("../models/Test");

/**
 * In-memory dashboard cache
 * Key: userId
 * Value: { expiresAt, payload }
 */
const DASHBOARD_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const dashboardCache = new Map();

const getCachedValue = (cache, key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.payload;
};

const setCachedValue = (cache, key, payload, ttl = DASHBOARD_CACHE_TTL) => {
  cache.set(key, {
    payload,
    expiresAt: Date.now() + ttl,
  });
};

/**
 * @desc Get Professional AI-Powered Dashboard Insights
 * @route GET /api/student/dashboard
 * @access Private/Student
 */
exports.getDashboardInsights = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Identity not verified." });
    }

    const cacheKey = String(userId);

    // 0. Return cached dashboard response if available
    const cachedDashboard = getCachedValue(dashboardCache, cacheKey);
    // if (cachedDashboard) {
    //   return res.status(200).json(cachedDashboard);
    // }

    // 1. Use req.user from auth middleware instead of querying User again
    const user =
      req.user ||
      (await User.findById(userId)
        .select("_id name avatar role isVerified profileCompletion status")
        .lean());

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Identity not verified." });
    }

    // Normalize frequently used values once
    const firstName = user.name ? user.name.split(" ")[0] : "there";
    const profileCompletion = Number(user.profileCompletion || 0);

    // 2. Parallel Data Fetching for Performance
    const [latestTestResult, latestRecommendationDoc, testCount] =
      await Promise.all([
        TestResult.findOne({ userId })
          .sort({ completedAt: -1 })
          .select("competencyScores completedAt percentage testId")
          .populate("testId", "title category")
          .lean(),

        Recommendation.findOne({ userId })
          .sort({ generatedAt: -1 })
          .select("averageScore totalItems topCompetencies generatedAt recommendedItems")
          .populate({
            path: "recommendedItems.itemId",
            select: "title name company duration essentials level",
          }),

        TestResult.countDocuments({ userId }),
      ]);

    // 3. --- NARRATIVE ENGINE (The "AI Coach" Logic) ---
    let aiMessage = "";
    let status = "info";
    let nextStep = {
      label: "Explore Dashboard",
      route: "/dashboard",
      priority: "low",
    };

    if (testCount === 0) {
      aiMessage = `Welcome, ${firstName}! Your career path is currently a 'Blank Canvas'. Take your first Career Assessment to let our AI map your competencies.`;
      status = "warning";
      nextStep = {
        label: "Take First Test",
        route: "/student/aptitude-test",
        priority: "critical",
      };
    } else if (profileCompletion < 70) {
      aiMessage = `Great progress on your tests! However, your 'Profile Strength' is low. Recruiters prioritize complete profiles. Add your skills to boost match accuracy.`;
      status = "action_required";
      nextStep = {
        label: "Complete Profile",
        route: "/student/profile",
        priority: "high",
      };
    } else if (
      latestRecommendationDoc &&
      latestRecommendationDoc.averageScore < 0.5
    ) {
      aiMessage = `We've detected a 'Competency Gap' between your test results and market requirements. We recommend specific bridge courses to increase your employability.`;
      status = "info";
      nextStep = {
        label: "Bridge Skill Gaps",
        route: "/student/recommendations",
        priority: "medium",
      };
    } else {
      aiMessage = `You're in the 'Elite Tier'! Your competency profile matches 85% of high-growth roles in your sector. Keep your activity high to stay visible to top companies.`;
      status = "success";
      nextStep = {
        label: "View Best Matches",
        route: "/student/recommendations",
        priority: "low",
      };
    }

    // 4. --- COMPETENCY AGGREGATION ---
    const competencies = latestTestResult
      ? latestTestResult.competencyScores
      : {
          analytical: 0,
          verbal: 0,
          creative: 0,
          scientific: 0,
          social: 0,
          technical: 0,
        };

    // 5. --- TREND ANALYSIS (Simple Mock Logic) ---
    const topTrait = Object.entries(competencies).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    // 6. --- PRECISION RECOMMENDATIONS ---
    const jobs = latestRecommendationDoc
      ? latestRecommendationDoc.getByType("Job").slice(0, 3)
      : [];

    const courses = latestRecommendationDoc
      ? latestRecommendationDoc.getByType("Course").slice(0, 3)
      : [];

    // 7. --- CONSTRUCT THE PROFESSIONAL RESPONSE ---
    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        profileCompletion,
      },

      metrics: {
        matchConfidence: latestRecommendationDoc
          ? Math.round(latestRecommendationDoc.averageScore * 100)
          : 0,
        profileCompletion,
        activityScore: Math.min(100, testCount * 15 + profileCompletion / 2),
        totalTestsTaken: testCount,
        marketPercentile: testCount > 0 ? 88 : 0,
      },

      aiCoach: {
        message: aiMessage,
        status,
        nextStep,
        dominantTrait: topTrait,
        insights: [
          `Your strongest pillar is ${topTrait.toUpperCase()}.`,
          testCount > 1
            ? "Your analytical score has improved by 12% this month."
            : "Complete more tests to see trend analysis.",
          latestRecommendationDoc
            ? `Found ${latestRecommendationDoc.totalItems} potential career matches.`
            : "Matches will appear after your next test.",
        ],
      },

      competencyData: competencies,

      recommendations: {
        jobs,
        courses,
        summary: {
          totalMatched: latestRecommendationDoc
            ? latestRecommendationDoc.totalItems
            : 0,
          topSector: latestRecommendationDoc?.topCompetencies?.[0] || "General",
        },
      },

      recentActivity: [
        latestTestResult && {
          type: "TEST_COMPLETED",
          title: `Completed ${latestTestResult.testId?.title || "Assessment"}`,
          date: latestTestResult.completedAt,
          score: `${latestTestResult.percentage}%`,
        },
        latestRecommendationDoc && {
          type: "MATCH_FOUND",
          title: "New AI Job Match Found",
          date: latestRecommendationDoc.generatedAt,
          score: "High",
        },
      ].filter(Boolean),
    };

    const responsePayload = {
      success: true,
      timestamp: new Date(),
      data: dashboardData,
    };

    // Cache the final response for 5 minutes
    setCachedValue(dashboardCache, cacheKey, responsePayload);

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Dashboard Engine Critical Failure:", error);
    return res.status(500).json({
      success: false,
      message: "The AI Insights engine is currently undergoing maintenance.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Optional helper if you want to clear cache after profile/test changes
 */
exports.clearDashboardCache = (userId) => {
  if (!userId) return;
  dashboardCache.delete(String(userId));
};