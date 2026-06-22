const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  updateUserStatus,
  updateUserVerification,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.admin.controller");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

/* =========================================================
   ADMIN USER MANAGEMENT ROUTES
========================================================= */

// Get all users
router.get("/", protect, authorize("admin"), getAllUsers);

// Get one user
router.get("/:userId", protect, authorize("admin"), getUserById);

// Full admin update
router.put("/:userId", protect, authorize("admin"), updateUserByAdmin);

// Update status only
router.patch("/:userId/status", protect, authorize("admin"), updateUserStatus);

// Update verification only
router.patch(
  "/:userId/verify",
  protect,
  authorize("admin"),
  updateUserVerification
);

// Update role only
router.patch("/:userId/role", protect, authorize("admin"), updateUserRole);

// Delete user
router.delete("/:userId", protect, authorize("admin"), deleteUser);

module.exports = router;