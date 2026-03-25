const Job = require("../models/Job");
const mongoose = require("mongoose");
const TestResult = require("../models/TestResult");

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

exports.getJobByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // Extracted from your Auth middleware

    /* =====================================================
       1️⃣ DEEP DATA RETRIEVAL (Full Population)
    ===================================================== */
    const job = await Job.findById(id)
      .populate({
        path: "companyId",
        select:
          "name logo website industry description location size companyType hiringStats rating socialLinks perks workMode",
      })
      .populate({
        path: "recruiterId",
        select: "name email profileImage",
      })
      .lean();

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job post not found" });
    }

    /* =====================================================
       2️⃣ NON-BLOCKING ANALYTICS UPDATE
    ===================================================== */
    // Increment views silently
    Job.updateOne({ _id: id }, { $inc: { views: 1 } }).exec();

    /* =====================================================
       3️⃣ DERIVED INTELLIGENCE ENGINE (Backend Calculation)
    ===================================================== */

    // 💰 Smart Salary Logic
    const isConfidential = job.salary?.isConfidential;
    const salaryData = {
      raw: job.salary,
      formatted: isConfidential
        ? "Confidential"
        : `₹${(job.salary.min / 100000).toFixed(1)}L - ₹${(
            job.salary.max / 100000
          ).toFixed(1)}L`,
      currency: job.salary?.currency || "INR",
    };

    // 📍 Location & Remote Status
    const locationInfo = {
      full: `${job.location?.city || "Remote"}, ${job.location?.state || ""}`,
      isRemote: job.location?.remoteAllowed || false,
      country: job.location?.country || "India",
    };

    // 🧠 AI Difficulty Assessment
    const weights = Object.values(job.competencyWeights || {});
    const avgRequirement =
      weights.reduce((a, b) => a + b, 0) / (weights.length || 1);

    let complexity = "Standard";
    if (avgRequirement > 70) complexity = "Elite";
    else if (avgRequirement > 50) complexity = "Competitive";
    else complexity = "Entry-Friendly";

    // 🕒 Deadline & Urgency
    const daysLeft = job.applicationDeadline
      ? Math.ceil(
          (new Date(job.applicationDeadline) - new Date()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    /* =====================================================
       4️⃣ PERSONALIZED AI MATCHING (If User is Logged In)
    ===================================================== */
    let matchInsights = null;

    if (userId) {
      const latestTest = await TestResult.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

      if (latestTest) {
        const userScores = latestTest.competencyScores || {};
        const jobRequirements = job.competencyWeights || {};

        let totalMatchScore = 0;
        let attributeCount = 0;
        const gaps = [];
        const strengths = [];

        for (const attr in jobRequirements) {
          const required = jobRequirements[attr] || 0;
          const userHas = userScores[attr] || 0;

          // Calculate Match % for this specific skill
          const skillMatch = Math.min(100, (userHas / (required || 1)) * 100);
          totalMatchScore += skillMatch;
          attributeCount++;

          // Identify Gaps & Strengths
          if (userHas < required - 15) {
            gaps.push({ skill: attr, deficit: required - userHas });
          } else if (userHas >= required + 10) {
            strengths.push(attr);
          }
        }

        matchInsights = {
          overallMatch: (totalMatchScore / attributeCount).toFixed(1),
          strengths: strengths.slice(0, 3), // Top 3 strengths
          criticalGaps: gaps
            .sort((a, b) => b.deficit - a.deficit)
            .map((g) => g.skill),
          isEligible: job.minCGPA ? latestTest.cgpa >= job.minCGPA : true,
          suitabilityScore:
            totalMatchScore / attributeCount > 75 ? "High" : "Medium",
        };
      }
    }

    /* =====================================================
       5️⃣ STRUCTURED FINAL RESPONSE
    ===================================================== */
    return res.json({
      success: true,
      data: {
        _id: job._id,
        header: {
          title: job.title,
          slug: job.slug,
          company: job.companyId, // Populated from Company Schema
          postedAt: job.createdAt,
          deadline: job.applicationDeadline,
          daysLeft,
          status: job.status,
        },

        essentials: {
          type: job.type,
          experience: job.experienceLevel,
          openings: job.openings,
          location: locationInfo,
          salary: salaryData,
        },

        requirements: {
          education: job.educationRequired,
          minCGPA: job.minCGPA || "N/A",
          batchRange: job.graduationYearRange,
          mandatorySkills: job.skillsRequired,
          preferredSkills: job.skillsNiceToHave,
          techStack: job.toolsAndTech,
          certifications: job.certificationsPreferred,
        },

        jobDeepDive: {
          description: job.description,
          responsibilities: job.responsibilities,
          perks: job.perks || job.companyId?.perks, // Fallback to company perks
          preferredDomains: job.preferredDomains,
        },

        aiInsights: {
          complexity,
          priorityScore: job.priorityScore,
          competencyWeights: job.competencyWeights,
          personalityFit: job.personalityFit,
          workStyle: job.workStyleMatch,
          match: matchInsights, // Personalized data
        },

        liveMetrics: {
          views: job.views + 1,
          applicants: job.applicantsCount,
          shortlisted: job.shortlistedCount,
          competitionLevel: job.applicantsCount > 50 ? "High" : "Moderate",
        },
      },
    });
  } catch (error) {
    console.error("Critical Error in getJobByIdPublic:", error);
    return res.status(500).json({
      success: false,
      message: "An internal error occurred while fetching job intelligence.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
