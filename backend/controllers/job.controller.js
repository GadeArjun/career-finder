const Job = require("../models/Job");
const mongoose = require("mongoose");

// =======================================================
// 🟢 CREATE JOB
// =======================================================
exports.createJob = async (req, res) => {
  try {
    const data = req.body;

    // Auto generate slug
    if (!data.slug && data.title) {
      data.slug =
        data.title.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);
    }
    console.log(data);

    data.companyId = data.companyId; // from auth middleware
    data.recruiterId = req.user._id;

    const job = await Job.create(data);

    res.status(201).json({
      success: true,
      message: "Job created successfully 🚀",
      job,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🟡 UPDATE JOB
// =======================================================
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    console.log(job);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      success: true,
      message: "Job updated ✨",
      job: updatedJob,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🔴 DELETE JOB
// =======================================================
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    if (job.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🔍 GET ALL JOBS (SEARCH + FILTER + PAGINATION)
// =======================================================
exports.getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      type,
      domain,
      experienceLevel,
      remote,
      minSalary,
      maxSalary,
    } = req.query;

    let filter = { status: "open" };

    if (search) filter.$text = { $search: search };
    if (city) filter["location.city"] = city;
    if (type) filter.type = type;
    if (domain) filter.preferredDomains = domain;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (remote) filter["location.remoteAllowed"] = remote === "true";

    if (minSalary || maxSalary) {
      filter["salary.min"] = { $gte: Number(minSalary || 0) };
      if (maxSalary) filter["salary.max"] = { $lte: Number(maxSalary) };
    }

    const jobs = await Job.find(filter)
      .populate("companyId", "name logo")
      .sort({ priorityScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🏢 GET JOBS BY COMPANY
// =======================================================
exports.getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 📄 GET JOB BY ID
// =======================================================
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("companyId", "name logo website")
      .populate("recruiterId", "name email");

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
