// services/aiChat.service.js
const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.AI_API_KEY });

/**
 * Safely parse AI JSON, with auto-fix for common formatting issues
 */
function safeJsonParse(raw) {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch (err) {
    try {
      let fixed = raw
        // fix key=> value mistakes
        .replace(/(\w+)\s*>/g, '"$1":')
        .replace(/(\w+)=/g, '"$1":')
        .replace(/'/g, '"') // single → double quotes
        .replace(/\n/g, " ")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/\s+:\s+/g, ":");
      return JSON.parse(fixed);
    } catch (e) {
      console.error("JSON parse failed completely:", raw);
      return null;
    }
  }
}

/**
 * Compact last N chat messages
 */
function compactChatHistory(chatHistory = [], limit = 6) {
  return chatHistory.slice(-limit).map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content:
      typeof msg.content === "string"
        ? msg.content.slice(0, 1200)
        : JSON.stringify(msg.content).slice(0, 1200),
  }));
}

/**
 * Build safe compact user data
 */
function buildCompactUserData(userData = {}) {
  return {
    userProfile: userData.userProfile || {},
    recommendedCourses: Array.isArray(userData.recommendedCourses)
      ? userData.recommendedCourses.slice(0, 3)
      : [],
    recommendedJobs: Array.isArray(userData.recommendedJobs)
      ? userData.recommendedJobs.slice(0, 2)
      : [],
  };
}

/**
 * Build safe latest test info
 */
function buildCompactLatestTest(latestTest) {
  if (!latestTest) return null;

  const wrongAnswers = (latestTest.responses || [])
    .filter((r) => r.isCorrect === false)
    .slice(-5)
    .map((r) => ({
      questionText: r.questionId?.questionText || "",
      selectedOption: r.selectedOption ?? null,
      correctAnswer: r.questionId?.correctAnswer ?? null,
    }));

  return {
    testId: latestTest._id || null,
    testTitle: latestTest.testId?.title || null,
    category: latestTest.testId?.category || null,
    score: latestTest.percentage ?? null,
    totalQuestions: latestTest.totalPossible ?? null,
    wrongAnswers,
  };
}

/**
 * Run Groq LLM call
 */
async function runGroq(messages) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.6,
    max_tokens: 1500, // smaller for safer JSON
    response_format: { type: "json_object" },
  });

  return completion.choices?.[0]?.message?.content;
}

/**
 * Main AI chat function
 */
async function chatWithAI({
  userMessage,
  chatHistory = [],
  userData = {},
  latestTest = null,
}) {
  const compactUserData = buildCompactUserData(userData);
  const compactLatestTest = buildCompactLatestTest(latestTest);
  const recentHistory = compactChatHistory(chatHistory, 6);

  // SYSTEM PROMPT
  const systemPrompt = `
You are a career guidance AI assistant.
You guide user based on there 6D Competency score which is Analytical, Verbal, Creative, Scientific, Social, and Technical

⚠️ RULES:
- Respond ONLY with valid JSON using the keys: message, insights, recommendations, nextSteps, followUpQuestions
- All strings must use double quotes
- Arrays must be real arrays, not strings
- NEVER wrap arrays or objects inside strings
- Explain test mistakes using latest test info if provided
- FollowUpQuestions must be ACTION-BASED, short, practical, command-like (max 8-10 words)
- Generate 3–5 follow-up questions, start with verbs like: Show, Explain, Give, Suggest
- Avoid reflective questions ("what do you think...?", "are you interested...?")

`;

  // USER MESSAGE
  const messages = [
    { role: "system", content: systemPrompt },
    ...recentHistory,
    {
      role: "user",
      content: JSON.stringify({
        userMessage,
        userData: compactUserData,
        latestTest: compactLatestTest,
      }),
    },
  ];

  try {
    const raw = await runGroq(messages);
    const parsed = safeJsonParse(raw);

    if (!parsed) throw new Error("AI returned invalid JSON");

    // normalize fields safely
    return {
      message:
        typeof parsed?.message === "string"
          ? parsed.message
          : "Sorry, I couldn't generate a response right now.",
      insights: {
        strengths: Array.isArray(parsed?.insights?.strengths)
          ? parsed.insights.strengths
          : [],
        weaknesses: Array.isArray(parsed?.insights?.weaknesses)
          ? parsed.insights.weaknesses
          : [],
      },
      recommendations: {
        courses: Array.isArray(parsed?.recommendations?.courses)
          ? parsed.recommendations.courses
          : [],
        jobs: Array.isArray(parsed?.recommendations?.jobs)
          ? parsed.recommendations.jobs
          : [],
      },
      nextSteps: Array.isArray(parsed?.nextSteps) ? parsed.nextSteps : [],
      followUpQuestions: Array.isArray(parsed?.followUpQuestions)
        ? parsed.followUpQuestions.slice(0, 5)
        : [],
    };
  } catch (err) {
    console.error("AI Error:", err);
    return {
      message: "AI service is temporarily unavailable.",
      insights: { strengths: [], weaknesses: [] },
      recommendations: { courses: [], jobs: [] },
      nextSteps: [],
      followUpQuestions: [],
    };
  }
}

module.exports = { chatWithAI };
