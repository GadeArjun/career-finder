// models/ChatSession.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    title: {
      type: String,
      default: "Career Chat",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Always keep chat small (token control)
ChatSessionSchema.methods.addMessage = function (message) {
  this.messages.push(message);

  this.lastMessageAt = new Date();
};

module.exports = mongoose.model("ChatSession", ChatSessionSchema);
