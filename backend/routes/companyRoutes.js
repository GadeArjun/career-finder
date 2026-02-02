const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/auth");


// owner routes
router.post("/", protect, controller.createCompany);
router.post("/:id", protect, controller.updateCompany);
router.delete("/:id", protect, controller.deleteCompany);
router.get("/my", protect, controller.getMyCompanies);

// public / admin
router.get("/:id", protect, controller.getCompanyById);
router.get("/", protect, controller.getAllCompanies);

module.exports = router;
