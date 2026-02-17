// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recCtrl = require("../controllers/recommendationController");
const { protect } = require("../middleware/auth");

// Students / authenticated users
router.post("/for-result", protect, recCtrl.recommendForTestResult);
router.post("/for-user", protect, recCtrl.recommendForUser);
router.get("/my", protect, recCtrl.getMyRecommendations);

// Admin
router.get("/analytics/top-courses", protect, recCtrl.topRecommendedCourses);
router.get("/:id", protect, recCtrl.getRecommendationById);
router.delete("/:id", protect, recCtrl.deleteRecommendation);

exports.recommendationRouter = router;
