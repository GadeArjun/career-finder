const mongoose = require("mongoose");
const Test = require("../models/Test");

/* =========================================================
   HELPERS
========================================================= */

const VALID_TEST_CATEGORIES = [
  "Aptitude",
  "Personality",
  "Technical",
  "Career Assessment",
];

const VALID_QUESTION_TYPES = [
  "MCQ",
  "TrueFalse",
  "Numeric",
  "Scenario",
  "Descriptive",
];

const VALID_QUESTION_CATEGORIES = [
  "Aptitude",
  "Personality",
  "Technical",
  "Analytical",
  "Creative",
];

const VALID_CAREER_TAGS = [
  "Engineering",
  "Medical",
  "Design",
  "Law",
  "Management",
  "Research",
  "Entrepreneurship",
  "Teaching",
  "Defense",
  "Civil Services",
  "Media",
  "AI",
  "Finance",
];

const VALID_PERSONALITY_IMPACTS = [
  "Leader",
  "Creative",
  "Analytical",
  "Empathetic",
  "Practical",
];

function toBoolean(v, fallback = false) {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return ["true", "1", "yes", "on"].includes(v.toLowerCase());
  return Boolean(v);
}

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function trimString(v, fallback = "") {
  return typeof v === "string" ? v.trim() : fallback;
}

function validateQuestion(question, index) {
  if (!question || typeof question !== "object") {
    throw new Error(`Question #${index + 1} is invalid.`);
  }

  const q = {
    questionText: trimString(question.questionText),
    type: VALID_QUESTION_TYPES.includes(question.type) ? question.type : "MCQ",
    correctAnswer: question.correctAnswer,
    marks: toNumber(question.marks, 1),
    difficulty:
      ["Easy", "Medium", "Hard"].includes(question.difficulty)
        ? question.difficulty
        : "Medium",
    questionCategory: question.questionCategory,
    isActive: toBoolean(question.isActive, true),
    competencies: {
      analytical: toNumber(question.competencies?.analytical, 0),
      verbal: toNumber(question.competencies?.verbal, 0),
      creative: toNumber(question.competencies?.creative, 0),
      scientific: toNumber(question.competencies?.scientific, 0),
      social: toNumber(question.competencies?.social, 0),
      technical: toNumber(question.competencies?.technical, 0),
    },
    personalityTraits: {
      leadership: toNumber(question.personalityTraits?.leadership, 0),
      teamwork: toNumber(question.personalityTraits?.teamwork, 0),
      riskTaking: toNumber(question.personalityTraits?.riskTaking, 0),
      discipline: toNumber(question.personalityTraits?.discipline, 0),
      adaptability: toNumber(question.personalityTraits?.adaptability, 0),
      creativity: toNumber(question.personalityTraits?.creativity, 0),
    },
    careerTags: Array.isArray(question.careerTags)
      ? question.careerTags.filter((tag) => VALID_CAREER_TAGS.includes(tag))
      : [],
    options: Array.isArray(question.options)
      ? question.options.map((opt) => ({
          text: trimString(opt.text),
          weight: toNumber(opt.weight, 1),
          isCorrect: toBoolean(opt.isCorrect, false),
          personalityImpact: VALID_PERSONALITY_IMPACTS.includes(opt.personalityImpact)
            ? opt.personalityImpact
            : undefined,
        }))
      : [],
  };

  if (!q.questionText) {
    throw new Error(`Question #${index + 1} must have questionText.`);
  }

  if (!VALID_QUESTION_CATEGORIES.includes(q.questionCategory)) {
    throw new Error(
      `Question #${index + 1} has invalid questionCategory.`
    );
  }

  if (q.marks < 0) {
    throw new Error(`Question #${index + 1} marks cannot be negative.`);
  }

  if ((q.type === "MCQ" || q.type === "TrueFalse") && q.options.length < 2) {
    throw new Error(
      `Question #${index + 1}: MCQ/TrueFalse must have at least 2 options.`
    );
  }

  if ((q.type === "Numeric" || q.type === "Descriptive") && q.options.length > 0) {
    q.options = [];
  }

  return q;
}

function sanitizeTestPayload(body, isUpdate = false) {
  const payload = {};

  if (!isUpdate || body.title !== undefined) payload.title = trimString(body.title);
  if (!isUpdate || body.description !== undefined) payload.description = body.description?.trim?.() || body.description || "";
  if (!isUpdate || body.category !== undefined) {
    payload.category = VALID_TEST_CATEGORIES.includes(body.category)
      ? body.category
      : "Career Assessment";
  }
  if (!isUpdate || body.duration !== undefined) payload.duration = toNumber(body.duration, 30);
  if (!isUpdate || body.randomizeQuestions !== undefined) {
    payload.randomizeQuestions = toBoolean(body.randomizeQuestions, true);
  }
  if (!isUpdate || body.isActive !== undefined) {
    payload.isActive = toBoolean(body.isActive, true);
  }

  if (body.questions !== undefined) {
    if (!Array.isArray(body.questions) || body.questions.length === 0) {
      throw new Error("Questions must be a non-empty array.");
    }

    payload.questions = body.questions.map((q, index) => validateQuestion(q, index));
    payload.questionCount = payload.questions.length;
  } else if (!isUpdate && body.questionCount !== undefined) {
    payload.questionCount = toNumber(body.questionCount, 0);
  }

  return payload;
}

/* =========================================================
   CREATE TEST (ADMIN)
========================================================= */
exports.createTest = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!["admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const payload = sanitizeTestPayload(req.body, false);

    if (!payload.title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (payload.questions.length < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one question is required.",
      });
    }

    const existing = await Test.findOne({
      title: payload.title,
    }).select("_id");

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A test with this title already exists.",
      });
    }

    const test = new Test({
      ...payload,
      createdBy: userId,
      questionCount: payload.questions.length,
      isActive: payload.isActive ?? true,
    });

    await test.save();

    return res.status(201).json({
      success: true,
      message: "Test created successfully.",
      data: test,
    });
  } catch (error) {
    console.error("createTest error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate test title.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create test.",
    });
  }
};

/* =========================================================
   UPDATE TEST (ADMIN)
   - Uses save() so pre-save aggregation runs again
========================================================= */
exports.updateTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID.",
      });
    }

    if (!["admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    const payload = sanitizeTestPayload(req.body, true);

    if (payload.title !== undefined) {
      const duplicate = await Test.findOne({
        title: payload.title,
        _id: { $ne: testId },
      }).select("_id");

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another test with this title already exists.",
        });
      }

      test.title = payload.title;
    }

    if (payload.description !== undefined) test.description = payload.description;
    if (payload.category !== undefined) test.category = payload.category;
    if (payload.duration !== undefined) test.duration = payload.duration;
    if (payload.randomizeQuestions !== undefined) {
      test.randomizeQuestions = payload.randomizeQuestions;
    }
    if (payload.isActive !== undefined) test.isActive = payload.isActive;

    if (payload.questions !== undefined) {
      test.questions = payload.questions;
      test.questionCount = payload.questions.length;
    }

    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test updated successfully.",
      data: test,
    });
  } catch (error) {
    console.error("updateTest error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update test.",
    });
  }
};

/* =========================================================
   SOFT DELETE TEST (ADMIN)
========================================================= */
exports.softDeleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID.",
      });
    }

    if (!["admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    if (!test.isActive) {
      return res.status(200).json({
        success: true,
        message: "Test is already inactive.",
      });
    }

    test.isActive = false;
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test soft deleted successfully.",
      data: {
        testId: test._id,
        isActive: test.isActive,
      },
    });
  } catch (error) {
    console.error("softDeleteTest error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to soft delete test.",
    });
  }
};

/* =========================================================
   RESTORE TEST (ADMIN)
========================================================= */
exports.restoreTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID.",
      });
    }

    if (!["admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    if (test.isActive) {
      return res.status(200).json({
        success: true,
        message: "Test is already active.",
      });
    }

    test.isActive = true;
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test restored successfully.",
      data: {
        testId: test._id,
        isActive: test.isActive,
      },
    });
  } catch (error) {
    console.error("restoreTest error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restore test.",
    });
  }
};

/* =========================================================
   HARD DELETE TEST (ADMIN)
========================================================= */
exports.deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID.",
      });
    }

    if (!["admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const deleted = await Test.findByIdAndDelete(testId).select("_id");

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test permanently deleted.",
    });
  } catch (error) {
    console.error("deleteTest error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete test.",
    });
  }
};

/* =========================================================
   GET ONE TEST (ADMIN)
========================================================= */
exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test ID.",
      });
    }

    const test = await Test.findById(testId)
      .populate("createdBy", "name email role")
      .lean();

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.error("getTestById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test.",
    });
  }
};

/* =========================================================
   GET ALL TESTS (ADMIN)
========================================================= */
exports.getAllTests = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive, category } = req.query;

    const query = {};

    if (isActive !== undefined) {
      query.isActive = toBoolean(isActive, true);
    }

    if (category && VALID_TEST_CATEGORIES.includes(category)) {
      query.category = category;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [tests, total] = await Promise.all([
      Test.find(query)
        .select(
          "title description category duration questionCount totalMarks isActive competencyProfile personalityProfile dominantCareerSignals analytics createdAt updatedAt"
        )
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        // .limit(limitNum)
        .lean(),

      Test.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tests,
    });
  } catch (error) {
    console.error("getAllTests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tests.",
    });
  }
};