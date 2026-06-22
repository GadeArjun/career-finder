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
router.post(
  "/",
  protect,
  authorize("admin", "SuperAdmin"),
  createTest
);

// Get All Tests
router.get(
  "/",
  protect,
  authorize("admin", "SuperAdmin"),
  getAllTests
);

// Get Single Test
router.get(
  "/:testId",
  protect,
  authorize("admin", "SuperAdmin"),
  getTestById
);

// Update Test
router.put(
  "/:testId",
  protect,
  authorize("admin", "SuperAdmin"),
  updateTest
);

// Soft Delete Test
router.patch(
  "/:testId/soft-delete",
  protect,
  authorize("admin", "SuperAdmin"),
  softDeleteTest
);

// Restore Test
router.patch(
  "/:testId/restore",
  protect,
  authorize("admin", "SuperAdmin"),
  restoreTest
);

// Hard Delete Test
router.delete(
  "/:testId",
  protect,
  authorize("SuperAdmin"),
  deleteTest
);

module.exports = router;