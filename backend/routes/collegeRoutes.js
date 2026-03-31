const express = require("express");
const router = express.Router();
const {
  addCollege,
  getMyColleges,
  getCollegeById,
  updateCollege,
  updateCollegeStatus,
  deleteCollege,
  getAllColleges,
} = require("../controllers/collegeController");
const { protect, authorize } = require("../middleware/auth");

// Owner
router.post("/", protect, authorize("college", "admin"), addCollege);
router.get("/my", protect, authorize("college", "admin"), getMyColleges);
router.get("/all", getAllColleges);
router.post("/:id", protect, authorize("college", "admin"), updateCollege);
router.delete("/:id", protect, authorize("college", "admin"), deleteCollege);

// Public
router.get("/:id", getCollegeById);

// Admin only
router.patch("/:id/status", protect, authorize("admin"), updateCollegeStatus);

exports.collegeRouter = router;
