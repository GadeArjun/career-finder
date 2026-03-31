const Groq = require("groq-sdk");
require("dotenv").config();

/* ===================================================== 
   🔑 Initialize GROQ SDK
===================================================== */
const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

/**
 * chatWithAI
 * @param {Object} params
 * @param {String} params.userMessage - User's current message
 * @param {Array} params.chatHistory - Array of previous messages [{role, content}]
 * @param {Object} params.userData - Clean user profile / context (from getCleanRecommendationsForAI)
 * @param {Object} params.latestTest - Optional: last test details including attempted questions, answers, correct answers
 * @returns {Object} AI JSON response (strict format)
 */
exports.chatWithAI = async ({
  userMessage,
  chatHistory = [],
  userData,
  latestTest,
}) => {
  try {
    /* =====================================================
       1️⃣ SYSTEM PROMPT (STRICT JSON MODE, TEST CONTEXT INCLUDED)
    ===================================================== */
    // system prompt snippet
    let systemPrompt = `
You are a career guidance AI.

⚠️ RULES:
- ALWAYS respond in STRICT JSON
- DO NOT add any fields other than: message, insights, recommendations, nextSteps, followUpQuestions
- JSON must be valid and parsable
- Use latest test context only to explain mistakes and suggest improvements
- Do NOT repeat previous static recommendations
- Limit details to what fits in the message field; do NOT create extra arrays

📦 RESPONSE FORMAT:
{
  "message": "Detailed guidance including test analysis",
  "insights": { "strengths": [], "weaknesses": [] },
  "recommendations": { "courses": [], "jobs": [] },
  "nextSteps": [],
  "followUpQuestions": []
}
`;

    //  Inject user data
    if (userData) {
      systemPrompt += `\nUSER PROFILE:\n${JSON.stringify(userData)}`;
    }

    // inject trimmed latestTest
    if (latestTest) {
      // only last 5 incorrect questions
      latestTest.responses = (latestTest.responses || [])
        .filter((r) => r.isCorrect === false)
        .slice(-5)
        .map((r) => ({
          questionText: r.questionId?.questionText,
          selectedOption: r.selectedOption,
          correctAnswer: r.questionId?.correctAnswer,
        }));

      systemPrompt += `\nLATEST TEST CONTEXT:\n${JSON.stringify(latestTest)}\n
Use this to explain mistakes and suggest improvements, but ONLY populate the predefined JSON fields.`;
    }

    /* =====================================================
       2️⃣ BUILD MESSAGES WITH HISTORY
    ===================================================== */
    const messages = [
      { role: "system", content: systemPrompt },
      // Last 6 messages from history for context
      ...chatHistory.slice(-6),
      { role: "user", content: userMessage },
    ];

    /* =====================================================
       3️⃣ CALL GROQ AI
    ===================================================== */
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;

    /* =====================================================
       4️⃣ SAFE PARSE & FALLBACK
    ===================================================== */
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse failed:", raw);

      parsed = {
        message:
          "Sorry, something went wrong. Please try again. Make sure your question is related to your assessment.",
        insights: { strengths: [], weaknesses: [] },
        recommendations: { courses: [], jobs: [] },
        nextSteps: [],
        followUpQuestions: [
          "What specific topic should I improve?",
          "Can you explain my weak areas in detail?",
          "Which concepts did I answer incorrectly?",
        ],
      };
    }

    return parsed;
  } catch (error) {
    console.error("AI Error:", error);

    return {
      message: "AI service is temporarily unavailable.",
      insights: { strengths: [], weaknesses: [] },
      recommendations: { courses: [], jobs: [] },
      nextSteps: [],
      followUpQuestions: [],
    };
  }
};
