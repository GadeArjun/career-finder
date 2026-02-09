const Test = require("../models/Test");
const mongoose = require("mongoose");

/* =====================================================================
   🧠 TEST CONTROLLER — FULLY PRODUCTION READY
   ===================================================================== */

/* ---------------------------------------------------------------------
   1️⃣ CREATE TEST  (Admin Only)
   --------------------------------------------------------------------- */
exports.createTest = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Test must include at least one question." });
    }

    const test = new Test({
      title,
      description,
      duration,
      questions,
      createdBy: req.user._id,
    });

    await test.save();

    res.status(201).json({
      success: true,
      message: "Test created successfully.",
      test,
    });
  } catch (err) {
    console.error("❌ Error creating test:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Test title already exists." });
    res.status(500).json({ message: "Server error creating test." });
  }
};

/* ---------------------------------------------------------------------
   2️⃣ GET ALL TESTS (Public - paginated, filtered)
   --------------------------------------------------------------------- */
exports.getAllTests = async (req, res) => {
  try {
    const { search, isActive, limit = 20, page = 1 } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search)
      filter.$text = {
        $search: search,
      };

    const skip = (page - 1) * limit;

    const [tests, total] = await Promise.all([
      Test.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-questions.correctAnswer"),
      Test.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      tests,
    });
  } catch (err) {
    console.error("❌ Error fetching tests:", err);
    res.status(500).json({ message: "Failed to fetch tests." });
  }
};

/* ---------------------------------------------------------------------
   3️⃣ GET SINGLE TEST BY ID (with or without correct answers)
   --------------------------------------------------------------------- */
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const includeAnswers = req.query.includeAnswers === "true";

    const projection = includeAnswers ? {} : { "questions.correctAnswer": 0 };

    const test = await Test.findById(id, projection);

    if (!test) return res.status(404).json({ message: "Test not found." });

    res.json({
      success: true,
      test,
    });
  } catch (err) {
    console.error("❌ Error fetching test:", err);
    res.status(500).json({ message: "Server error fetching test." });
  }
};

/* ---------------------------------------------------------------------
   4️⃣ UPDATE TEST (Admin Only)
   --------------------------------------------------------------------- */
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const test = await Test.findById(id);
    if (!test) return res.status(404).json({ message: "Test not found." });

    Object.assign(test, updates);
    await test.save();

    res.json({
      success: true,
      message: "Test updated successfully.",
      test,
    });
  } catch (err) {
    console.error("❌ Error updating test:", err);
    res.status(500).json({ message: "Server error updating test." });
  }
};

/* ---------------------------------------------------------------------
   5️⃣ DELETE TEST (Admin Only)
   --------------------------------------------------------------------- */
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id);
    if (!test) return res.status(404).json({ message: "Test not found." });

    await test.deleteOne();

    res.json({
      success: true,
      message: "Test deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Error deleting test:", err);
    res.status(500).json({ message: "Failed to delete test." });
  }
};

/* ---------------------------------------------------------------------
   6️⃣ GET RANDOMIZED TEST QUESTIONS (For Students)
   --------------------------------------------------------------------- */
exports.getRandomizedTest = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test || !test.isActive)
      return res.status(404).json({ message: "Test not found or inactive." });

    let questions = [...test.questions];

    if (test.randomizeQuestions)
      questions = questions.sort(() => Math.random() - 0.5);

    // Hide correct answers for fairness
    const safeQuestions = questions.map((q) => {
      const qObj = q.toObject();
      delete qObj.correctAnswer;
      return qObj;
    });

    res.json({
      success: true,
      title: test.title,
      duration: test.duration,
      totalQuestions: safeQuestions.length,
      questions: safeQuestions,
    });
  } catch (err) {
    console.error("❌ Error fetching randomized test:", err);
    res.status(500).json({ message: "Failed to load test questions." });
  }
};

/* ---------------------------------------------------------------------
   7️⃣ ACTIVATE / DEACTIVATE TEST (Admin Only)
   --------------------------------------------------------------------- */
exports.toggleTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const test = await Test.findByIdAndUpdate(id, { isActive }, { new: true });

    if (!test) return res.status(404).json({ message: "Test not found." });

    res.json({
      success: true,
      message: `Test ${isActive ? "activated" : "deactivated"} successfully.`,
      test,
    });
  } catch (err) {
    console.error("❌ Error toggling test status:", err);
    res.status(500).json({ message: "Failed to update test status." });
  }
};

/* ---------------------------------------------------------------------
   8️⃣ GET TESTS BY COMPETENCY (For analytics or recommendations)
   --------------------------------------------------------------------- */
exports.getTestsByCompetency = async (req, res) => {
  try {
    const { competency, minValue = 0 } = req.query;

    if (
      ![
        "analytical",
        "verbal",
        "creative",
        "scientific",
        "social",
        "technical",
      ].includes(competency)
    ) {
      return res.status(400).json({ message: "Invalid competency key." });
    }

    const filter = {};
    filter[`competencyProfile.${competency}`] = { $gte: Number(minValue) };

    const tests = await Test.find(filter).select("title competencyProfile");

    res.json({
      success: true,
      total: tests.length,
      tests,
    });
  } catch (err) {
    console.error("❌ Error filtering tests:", err);
    res.status(500).json({ message: "Failed to fetch tests by competency." });
  }
};
