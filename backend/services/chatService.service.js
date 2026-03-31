// services/chatService.js
const ChatSession = require("../models/ChatSession");
const TestResult = require("../models/TestResult");
const getCleanRecommendationsForAI = require("../utils/getCleanRecommendationsForAI");
const { chatWithAI } = require("./aiChat.service");

async function chatWithMemory(userId, userMessage) {
  /* =====================================================
     1️⃣ GET OR CREATE SESSION
  ===================================================== */
  // Fetch latest chat session for a user
  let session = await ChatSession.findOne({ userId }).sort({
    lastMessageAt: -1,
  });

  if (!session) {
    session = await ChatSession.create({
      userId,
      messages: [],
    });
  }

  // Keep only last 10 messages for AI context
  const chatHistory = session.messages.slice(-10);

  /* =====================================================
     2️⃣ GET USER AI DATA
  ===================================================== */
  const userData = await getCleanRecommendationsForAI(userId);

  const latestTest = await TestResult.findOne({ userId })
    .sort({ createdAt: -1 })
    .populate("responses.questionId", "questionText correctAnswer")
    .lean();

  if (latestTest) {
    // Only include wrong answers for AI context
    latestTest.responses = latestTest.responses
      .filter((r) => r.isCorrect === false)
      .map((r) => ({
        questionText: r.questionId?.questionText,
        selectedOption: r.selectedOption,
        correctAnswer: r.questionId?.correctAnswer,
      }))
      .slice(-10); // max 10 wrong questions
  }

  console.log({ latestTest });

  /* =====================================================
     3️⃣ CALL AI WITH HISTORY
  ===================================================== */
  const aiResponse = await chatWithAI({
    userMessage,
    chatHistory,
    userData,
    latestTest,
  });

  console.log({ aiResponse });

  /* =====================================================
     4️⃣ SAVE BOTH SIDES
  ===================================================== */
  session.addMessage({ role: "user", content: userMessage });
  session.addMessage({
    role: "assistant",
    content: JSON.stringify(aiResponse),
  });

  await session.save();

  return aiResponse;
}

module.exports = { chatWithMemory };
