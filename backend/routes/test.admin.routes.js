const express = require("express");

const {
  createTest,
  updateTest,
  softDeleteTest,
  restoreTest,
  deleteTest,
  getTestById,
  getAllTests,
} = require("../controllers/test.admin.controller");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/* =========================================================
   ADMIN TEST MANAGEMENT
========================================================= */

// Create Test
router.post("/", protect, authorize("admin"), createTest);

// Get All Tests
router.get("/", protect, authorize("admin"), getAllTests);

// Get Single Test
router.get("/:testId", protect, authorize("admin"), getTestById);

// Update Test
router.put("/:testId", protect, authorize("admin"), updateTest);

// Soft Delete Test
router.patch(
  "/:testId/soft-delete",
  protect,
  authorize("admin"),
  softDeleteTest
);

// Restore Test
router.patch("/:testId/restore", protect, authorize("admin"), restoreTest);

// Hard Delete Test
router.delete("/:testId", protect, authorize("admin"), deleteTest);

module.exports = router;
