const Company = require("../models/Company");

/**
 * CREATE COMPANY
 * POST /api/companies
 * Body: full company object
 */
exports.createCompany = async (req, res) => {
  try {
    const ownerId = req.user._id; // from auth middleware

    const companyData = {
      ...req.body,
      ownerId,
    };

    const company = await Company.create(companyData);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    console.error("createCompany error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * UPDATE COMPANY
 * PUT /api/companies/:id
 * Body: full company object
 */
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // only owner or admin
    if (
      req.user.role !== "admin" &&
      company.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(company, req.body);

    await company.save();

    res.json({
      success: true,
      message: "Company updated",
      company,
    });
  } catch (err) {
    console.error("updateCompany error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE COMPANY
 * DELETE /api/companies/:id
 */
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (
      req.user.role !== "admin" &&
      company.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await company.deleteOne();

    res.json({ success: true, message: "Company deleted" });
  } catch (err) {
    console.error("deleteCompany error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET COMPANY BY ID
 * GET /api/companies/:id
 */
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.json({ success: true, company });
  } catch (err) {
    console.error("getCompanyById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL COMPANIES OF CURRENT USER
 * GET /api/companies/my
 */
exports.getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, count: companies.length, companies });
  } catch (err) {
    console.error("getMyCompanies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: GET ALL COMPANIES
 * GET /api/companies
 */
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("ownerId", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: companies.length, companies });
  } catch (err) {
    console.error("getAllCompanies error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
