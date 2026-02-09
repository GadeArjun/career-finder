const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const testController = require("../controllers/test.controller");

router.post("/", protect, testController.createTest);
router.post("/:id", protect, testController.updateTest);
router.delete("/:id", protect, testController.deleteTest);
router.get("/", protect, testController.getAllTests);
router.get("/random", protect, testController.getRandomTest);
router.get("/:id", protect, testController.getTestById);

module.exports = router;
