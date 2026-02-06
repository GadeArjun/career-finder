const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, courseController.createCourse);
router.post("/:id", protect, courseController.updateCourse);
router.delete("/:id", protect, courseController.deleteCourse);

router.get("/", protect, courseController.getAllCourses);
router.get(
  "/college/:collegeId",
  protect,
  courseController.getCoursesByCollege
);
router.get("/:id", protect, courseController.getCourseById);

module.exports = router;
