const Course = require("../models/Course");
const { getYouTubeCourses } = require("../services/youtube.service");

// =======================================================
// 🟢 CREATE COURSE
// =======================================================
exports.createCourse = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Generate slug
    if (!data.slug && data.title) {
      data.slug =
        data.title.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);
    }

    // ✅ Fetch YouTube videos based on course title
    let youtubeVideos = [];
    if (data.title) {
      const videos = await getYouTubeCourses(data.title);

      if (videos && videos.length > 0) {
        youtubeVideos = videos;
      }
    }

    // ✅ Attach videos to course
    data.youtubeVideos = youtubeVideos;

    // ✅ Create course
    const course = await Course.create(data);

    res.status(201).json({
      success: true,
      message: "Course created successfully 🎓",
      course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================================
// 🟡 UPDATE COURSE
// =======================================================
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });

    res.json({ success: true, message: "Course updated ✨", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🔴 DELETE COURSE
// =======================================================
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    if (course.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await course.deleteOne();

    res.json({ success: true, message: "Course deleted 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🔍 GET ALL COURSES (SEARCH + FILTER + PAGINATION)
// =======================================================
exports.getAllCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      degreeType,
      domain,
      branch,
      mode,
    } = req.query;

    let filter = { status: "active" };

    if (search) filter.$text = { $search: search };
    if (degreeType) filter.degreeType = degreeType;
    if (branch) filter.branch = branch;
    if (mode) filter.mode = mode;
    if (domain) filter.careerDomains = domain;
    const filterCount = Object.keys(filter).length;
    let courses = [];

    if (filterCount === 1) {
      courses = await Course.find(filter)
        .populate("collegeId", "name logo location")
        .sort({ popularityScore: -1, createdAt: -1 });
    } else {
      courses = await Course.find(filter)
        .populate("collegeId", "name logo location")
        .sort({ popularityScore: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 🏫 GET COURSES BY COLLEGE
// =======================================================
exports.getCoursesByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const courses = await Course.find({ collegeId }).sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================
// 📄 GET COURSE BY ID
// =======================================================
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "collegeId",
      "name logo website location"
    );

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Increment view counter
    course.views += 1;
    await course.save();

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    /* =====================================================
       1️⃣ FETCH COURSE + COLLEGE (LEAN + FAST)
    ===================================================== */
    const course = await Course.findById(id)
      .populate({
        path: "collegeId",
        select: `
          name logo bannerImage website email
          location accreditation establishedYear collegeType
          socialLinks competencyProfile focusAreas teachingStyle bestFor
          placementStats feeRange campusType hostelAvailable
          internationalExposure facilities rating nirfRank
          researchScore industryCollaborationScore
          totalStudents totalCourses enrollmentCount
        `,
      })
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    /* =====================================================
       2️⃣ NON-BLOCKING VIEW INCREMENT
    ===================================================== */
    Course.updateOne({ _id: id }, { $inc: { views: 1 } }).exec();

    const college = course.collegeId || {};

    /* =====================================================
       3️⃣ DERIVED DATA ENGINE
    ===================================================== */

    // 💰 Fee Formatting
    const fees = course.feeStructure || {};
    const feeText = fees?.perYear
      ? `₹${(fees.perYear / 1000).toFixed(0)}k / year`
      : "Not Available";

    const totalFeeText = fees?.totalEstimated
      ? `₹${(fees.totalEstimated / 100000).toFixed(1)}L total`
      : null;

    // 📍 Location
    const locationText = college?.location
      ? `${college.location.city || ""}, ${college.location.state || ""}`.trim()
      : "N/A";

    // 📊 Skill Analysis
    const skillProfile = course.skillOutcomeProfile || {};
    const skillValues = Object.values(skillProfile);

    const skillAvg = skillValues.length
      ? skillValues.reduce((a, b) => a + b, 0) / skillValues.length
      : 0;

    let difficulty = "Medium";
    if (skillAvg >= 70) difficulty = "High";
    else if (skillAvg <= 40) difficulty = "Easy";

    // 🔥 Skill Highlights
    const strongestSkills = Object.entries(skillProfile)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key]) => key);

    const weakestSkills = Object.entries(skillProfile)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([key]) => key);

    // 🏷️ Tags Engine
    const tags = [
      course.degreeType,
      course.branch,
      course.specialization,
      course.learningStyle,
      ...(course.careerDomains || []),
    ].filter(Boolean);

    /* =====================================================
       4️⃣ YOUTUBE VIDEO OPTIMIZATION
    ===================================================== */

    const youtubeVideos = (course.youtubeVideos || []).sort(
      (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    );

    /* =====================================================
       5️⃣ MATCH ENGINE (SMART AI)
    ===================================================== */

    let matchInsights = null;

    if (userId) {
      const TestResult = require("../models/TestResult");

      const latest = await TestResult.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

      if (latest?.competencyScores) {
        const userComp = latest.competencyScores;
        const courseComp = skillProfile;

        let totalScore = 0;
        let count = 0;

        const gaps = [];
        const strengths = [];

        for (const key in courseComp) {
          const cVal = courseComp[key] || 0;
          const uVal = userComp[key] || 0;

          const diff = uVal - cVal;

          totalScore += Math.max(0, 100 - Math.abs(diff));
          count++;

          if (diff < -20) gaps.push(key);
          if (diff > 15) strengths.push(key);
        }

        const matchScore = count
          ? Math.min(100, (totalScore / count).toFixed(1))
          : 0;

        matchInsights = {
          matchScore,
          strengths,
          gaps,
          recommendation:
            matchScore > 75
              ? "Excellent fit 🚀"
              : matchScore > 50
              ? "Good fit 👍"
              : "Needs improvement ⚠️",
          suggestion:
            gaps.length > 0
              ? `Improve: ${gaps.join(", ")}`
              : "You are well aligned with this course",
        };
      }
    }

    /* =====================================================
       6️⃣ SMART INSIGHTS ENGINE
    ===================================================== */

    const insights = {
      difficulty,
      popularityScore: course.popularityScore,

      careerReadiness:
        course.industryProjects && course.internshipOpportunities
          ? "High"
          : "Medium",

      demandLevel: course.careerDomains?.includes("Software Development")
        ? "High"
        : "Medium",

      roiLevel:
        fees.totalEstimated && course.placementStats?.averagePackage
          ? course.placementStats.averagePackage * 100000 > fees.totalEstimated
            ? "High ROI 💰"
            : "Moderate ROI"
          : "Unknown",
    };

    /* =====================================================
       7️⃣ FINAL RESPONSE
    ===================================================== */

    return res.json({
      success: true,

      course: {
        _id: course._id,

        /* BASIC */
        title: course.title,
        description: course.description,
        duration: course.duration,
        degreeType: course.degreeType,
        branch: course.branch,
        specialization: course.specialization,

        /* COLLEGE */
        college,
        collegeName: college.name,
        locationText,
        rating: college.rating,

        /* FEES */
        feeStructure: course.feeStructure,
        feeText,
        totalFeeText,

        /* ELIGIBILITY */
        eligibility: course.eligibility,
        admissionProcess: course.admissionProcess,

        /* SKILLS */
        coreSkills: course.coreSkills,
        toolsAndTech: course.toolsAndTech,
        skillOutcomeProfile: skillProfile,
        strongestSkills,
        weakestSkills,

        /* CAREER */
        careerDomains: course.careerDomains,
        typicalJobRoles: course.typicalJobRoles,
        higherStudyPaths: course.higherStudyPaths,

        /* PLACEMENTS */
        placementStats: course.placementStats,

        /* FEATURES */
        internshipOpportunities: course.internshipOpportunities,
        industryProjects: course.industryProjects,

        /* MEDIA */
        youtubeVideos,

        /* META */
        mode: course.mode,
        approvedBy: course.approvedBy,
        tags,

        /* ANALYTICS */
        views: (course.views || 0) + 1,
        interestedCount: course.interestedCount,
        enrollmentCount: course.enrollmentCount,

        /* AI */
        insights,
        match: matchInsights,
      },
    });
  } catch (error) {
    console.error("getCourseByIdPublic error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
