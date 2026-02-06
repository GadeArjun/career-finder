const Course = require("../models/Course");

// =======================================================
// 🟢 CREATE COURSE
// =======================================================
exports.createCourse = async (req, res) => {
  try {
    const data = req.body;

    if (!data.slug && data.title) {
      data.slug =
        data.title.toLowerCase().replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);
    }

    const course = await Course.create(data);

    res.status(201).json({
      success: true,
      message: "Course created successfully 🎓",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    const courses = await Course.find(filter)
      .populate("collegeId", "name logo location")
      .sort({ popularityScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

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
