// controllers/chatController.js
const ChatSession = require("../models/ChatSession");
const { chatWithMemory } = require("../services/chatService.service");

exports.chat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await chatWithMemory(userId, message);

    return res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("Chat error:", err);

    res.status(500).json({
      success: false,
      message: "Chat failed",
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch latest session for the user
    let session = await ChatSession.findOne({ userId }).sort({
      lastMessageAt: -1,
    });

    if (!session) {
      return res.json({ success: true, data: [] });
    }

    // Parse stored AI messages (if stored as JSON string)
    const messages = session.messages.map((msg) => {
      if (msg.role === "assistant" && typeof msg.content === "string") {
        try {
          const parsed = JSON.parse(msg.content);
          return { ...msg, ...parsed, content: parsed.message || msg.content };
        } catch {
          return msg;
        }
      }
      return msg;
    });

    return res.json({ success: true, data: messages });
  } catch (err) {
    console.error("Chat history error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch history" });
  }
};
