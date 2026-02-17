const TestResult = require("../models/TestResult");
const Test = require("../models/Test");
const { generateFullRecommendations } = require("./recommendationEngine");

/* =========================================================
   🧠 CREATE TEST CONTROLLER
========================================================= */
exports.createTest = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware

    const {
      title,
      description,
      category,
      duration,
      randomizeQuestions,
      questions,
    } = req.body;

    /* =====================================================
       🔍 BASIC VALIDATIONS
    ===================================================== */

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required",
      });
    }

    // Prevent duplicate title
    const existing = await Test.findOne({ title: title.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Test with this title already exists",
      });
    }

    /* =====================================================
       🧩 VALIDATE EACH QUESTION MANUALLY
    ===================================================== */

    const formattedQuestions = questions.map((q, index) => {
      if (!q.questionText) {
        throw new Error(`Question ${index + 1} text is required`);
      }

      if (!q.questionCategory) {
        throw new Error(`Question ${index + 1} category is required`);
      }

      // MCQ / TrueFalse must have options
      if (["MCQ", "TrueFalse"].includes(q.type)) {
        if (!q.options || q.options.length < 2) {
          throw new Error(`Question ${index + 1} must have at least 2 options`);
        }

        const correctCount = q.options.filter((o) => o.isCorrect).length;
        if (correctCount === 0) {
          throw new Error(
            `Question ${index + 1} must have at least one correct option`
          );
        }
      }

      // Numeric must have correctAnswer
      if (q.type === "Numeric" && q.correctAnswer === undefined) {
        throw new Error(`Question ${index + 1} requires correctAnswer`);
      }

      return {
        questionText: q.questionText,
        type: q.type || "MCQ",
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
        difficulty: q.difficulty || "Medium",
        competencies: q.competencies || {},
        personalityTraits: q.personalityTraits || {},
        careerTags: q.careerTags || [],
        options: q.options || [],
        questionCategory: q.questionCategory,
        isActive: true,
      };
    });

    /* =====================================================
       🚀 CREATE TEST DOCUMENT
    ===================================================== */

    const test = await Test.create({
      title: title.trim(),
      description,
      category,
      duration,
      randomizeQuestions,
      createdBy: userId,
      questions: formattedQuestions,
    });

    /* =====================================================
       📤 RESPONSE
    ===================================================== */

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: test,
    });
  } catch (err) {
    console.error("Create Test Error:", err.message);

    res.status(500).json({
      success: false,
      message: err.message || "Server error while creating test",
    });
  }
};

/* =========================================================
   ✏️ UPDATE TEST
========================================================= */
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const test = await Test.findById(id);
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Only creator or admin should update (optional rule)
    if (test.createdBy.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const {
      title,
      description,
      category,
      duration,
      randomizeQuestions,
      questions,
      isActive,
    } = req.body;

    // Prevent duplicate title
    if (title && title !== test.title) {
      const exists = await Test.findOne({ title });
      if (exists) {
        return res
          .status(400)
          .json({ success: false, message: "Title already exists" });
      }
      test.title = title;
    }

    if (description !== undefined) test.description = description;
    if (category) test.category = category;
    if (duration) test.duration = duration;
    if (randomizeQuestions !== undefined)
      test.randomizeQuestions = randomizeQuestions;
    if (isActive !== undefined) test.isActive = isActive;

    /* =====================================================
       🧩 UPDATE QUESTIONS (REBUILD)
    ===================================================== */
    if (questions && questions.length > 0) {
      test.questions = questions.map((q, index) => {
        if (!q.questionText)
          throw new Error(`Question ${index + 1} text missing`);

        if (["MCQ", "TrueFalse"].includes(q.type)) {
          if (!q.options || q.options.length < 2) {
            throw new Error(`Question ${index + 1} needs options`);
          }
        }

        return {
          questionText: q.questionText,
          type: q.type || "MCQ",
          correctAnswer: q.correctAnswer,
          marks: q.marks || 1,
          difficulty: q.difficulty || "Medium",
          competencies: q.competencies || {},
          personalityTraits: q.personalityTraits || {},
          careerTags: q.careerTags || [],
          options: q.options || [],
          questionCategory: q.questionCategory,
          isActive: q.isActive ?? true,
        };
      });
    }

    await test.save(); // 🔥 triggers AI aggregation again

    res.json({
      success: true,
      message: "Test updated successfully",
      data: test,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   📚 GET ALL TESTS
========================================================= */
exports.getAllTests = async (req, res) => {
  try {
    const { category, isActive = true, page = 1, limit = 10 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive;

    const tests = await Test.find(query)
      .select("-questions") // exclude heavy questions list
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Test.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      data: tests,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   🔍 GET SINGLE TEST
========================================================= */
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get random test
exports.getRandomTest = async (req, res) => {
  try {
    // 1️⃣ Pick ONE truly random active test using MongoDB aggregation
    const randomTestArr = await Test.aggregate([
      { $match: { isActive: true } }, // Only get active tests
      { $sample: { size: 1 } }, // Pick 1 random document
    ]);

    if (!randomTestArr.length) {
      return res.status(404).json({ message: "No active test found" });
    }

    const test = randomTestArr[0];
    let questions = [...test.questions];

    // 2️⃣ Fisher-Yates Shuffle for the questions
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // 3️⃣ Limit if questionCount is defined (e.g., test has 50 questions but you only want 25)
    // if (test.questionCount && questions.length > test.questionCount) {
    //   questions = questions.slice(0, test.questionCount);
    // }

    // 4️⃣ Sanitize data: Remove correct answers/weights before sending to frontend
    const safeQuestions = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      // We only send the text, hiding 'isCorrect', 'weight', and 'personalityImpact'
      options: q.options.map((opt) => ({
        text: opt.text,
        // _id: opt._id // Include if you need to track choice by ID
      })),
      questionCategory: q.questionCategory,
      difficulty: q.difficulty,
    }));

    // 5️⃣ Send response
    res.json({
      testId: test._id,
      title: test.title,
      description: test.description,
      duration: test.duration,
      totalQuestions: safeQuestions.length,
      questions: safeQuestions,
    });
  } catch (err) {
    console.error("Error fetching random test:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   ❌ DELETE TEST
========================================================= */
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    if (
      test.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await test.deleteOne();

    res.json({ success: true, message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// submit test and check the

exports.submitTestResult = async (req, res) => {
  try {
    const { testId, answers } = req.body; // 'answers' is the object from your previous prompt
    const userId = req.user.id; // Obtained from your auth middleware

    // 1. Fetch the master test to verify correct answers and competencies
    const masterTest = await Test.findById(testId);
    if (!masterTest) {
      return res.status(404).json({ message: "Master test not found" });
    }

    const responses = [];

    // 2. Map the master questions to the user's submissions
    masterTest.questions.forEach((question) => {
      const qId = question._id.toString();
      const userSubmission = answers[qId];

      if (userSubmission) {
        // Check correctness (handling both string and mixed types)
        const isCorrect =
          String(question.correctAnswer) === String(userSubmission.answer);

        // Calculate marks for this question
        const marksObtained = isCorrect ? question.marks || 1 : 0;

        // Build the response object for this specific question
        responses.push({
          questionId: question._id,
          selectedOption: userSubmission.answer,
          isCorrect: isCorrect,
          marksObtained: marksObtained,
          // Only pass competency points if they got it right (standard logic)
          // or pass raw values if you want to track "intended" vs "demonstrated"
          competencies: isCorrect
            ? question.competencies
            : {
                analytical: 0,
                verbal: 0,
                creative: 0,
                scientific: 0,
                social: 0,
                technical: 0,
              },
        });
      }
    });

    // 3. Create the TestResult document
    // The pre-save hook in your schema will automatically calculate:
    // totalScore, totalPossible, percentage, and competencyScores
    const newResult = new TestResult({
      userId,
      testId,
      responses,
      durationTaken: req.body.durationTaken || 0, // pass from frontend timer
    });

    await newResult.save();

    const recommendation = await generateFullRecommendations({
      userId,
      testResult: newResult,
    });

    // 4. Return the computed data (calculated by your pre-save hook)

    res.status(201).json({
      success: true,
      message: "Assessment completed successfully",
      result: {
        totalScore: newResult.totalScore,
        percentage: newResult.percentage,
        competencyProfile: newResult.competencyScores,
      },
      recommendation,
    });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
