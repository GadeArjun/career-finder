const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/auth");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private (Authenticated)
router.get("/profile", protect, getUserProfile);
router.post("/profile", protect, updateUserProfile);

// Admin-only
router.get("/", protect, authorize("admin"), getAllUsers);
router.delete("/:id", protect, authorize("admin"), deleteUser);

exports.userRouter = router;
