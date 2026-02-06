const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, jobController.createJob);
router.post("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);

router.get("/", protect, jobController.getAllJobs);
router.get("/:companyId", protect, jobController.getJobsByCompany);
router.get("/:id/one", protect, jobController.getJobById);

module.exports = router;
