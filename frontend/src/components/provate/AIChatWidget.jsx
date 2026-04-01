import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CornerDownLeft,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Target,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! I'm your Career AI — powered with complete intelligence. I analyze your Professional Path Mastery Assessment and give you actionable guidance.\n\nAsk me anything about your results, skills, courses, jobs, or next steps!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load chat history on open
  useEffect(() => {
    if (open) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/ai/history`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (res.data.success) {
            setMessages(res.data.data);
          }
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      };

      fetchHistory();
    }
  }, [open]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      //   textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  // ⚡ Upgraded Logic: Instantly sends the clicked question to the model
  const handleFollowUpClick = (question) => {
    if (loading) return;
    sendMessage(question);
  };

  const sendMessage = async (overrideInput = null) => {
    const activeInput = overrideInput || input;
    if (!activeInput.trim() || loading) return;

    const userInput = activeInput.trim();
    const userMessage = { role: "user", content: userInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        { message: userInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const aiData = res.data?.data || {};

      /**
       * Safely normalize AI response to prevent React crashes
       */
      const normalizeAIData = (aiData = {}) => {
        const safeString = (value) => {
          if (value === null || value === undefined) return "";
          if (typeof value === "string") return value;
          if (typeof value === "number" || typeof value === "boolean")
            return String(value);
          try {
            return JSON.stringify(value, null, 2);
          } catch {
            return "[Unrenderable content]";
          }
        };

        const safeArray = (arr) => {
          if (!Array.isArray(arr)) return [];
          return arr.map((item) => safeString(item));
        };

        const safeJobsArray = (arr) => {
          if (!Array.isArray(arr)) return [];
          return arr.map((job) => {
            if (typeof job === "string") return job;
            if (typeof job === "object" && job !== null) {
              return `${job.title || "Unknown Role"}${
                job.company ? " at " + job.company : ""
              }${job.location ? " (" + job.location + ")" : ""}`;
            }
            return safeString(job);
          });
        };

        return {
          role: "ai",
          content:
            safeString(aiData?.message) ||
            "Sorry, I couldn't generate a response right now.",
          insights: {
            strengths: safeArray(aiData?.insights?.strengths),
            weaknesses: safeArray(aiData?.insights?.weaknesses),
          },
          recommendations: {
            courses: safeArray(aiData?.recommendations?.courses),
            jobs: safeJobsArray(aiData?.recommendations?.jobs),
          },
          nextSteps: safeArray(aiData?.nextSteps),
          followUpQuestions: safeArray(aiData?.followUpQuestions).slice(0, 5), // max 5
        };
      };

      // Usage:
      const aiMessage = normalizeAIData(aiData);

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Connection lost. Please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Normalize AI message to prevent React errors and safely render all content.
   * Converts objects to readable strings, ensures arrays exist, slices follow-ups.
   */
  const normalizeAIMessage = (msg = {}) => {
    // Helper: safely stringify any value (object/array/string/number)
    const safeString = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string") return value;
      if (typeof value === "number" || typeof value === "boolean")
        return String(value);
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return "[Unrenderable content]";
      }
    };

    // Helper: safely process array, fallback to empty array, map to strings if needed
    const safeArray = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => safeString(item));
    };

    return {
      content:
        safeString(msg.content) ||
        "Sorry, I couldn't generate a response right now.",
      insights: {
        strengths: safeArray(msg?.insights?.strengths),
        weaknesses: safeArray(msg?.insights?.weaknesses),
      },
      recommendations: {
        courses: safeArray(msg?.recommendations?.courses),
        // For jobs: if object, stringify nicely
        jobs: (msg?.recommendations?.jobs || []).map((job) => {
          if (typeof job === "string") return job;
          if (typeof job === "object" && job !== null) {
            // Custom display: title + company
            return `${job.title || "Unknown Role"}${
              job.company ? " at " + job.company : ""
            }`;
          }
          return safeString(job);
        }),
      },
      nextSteps: safeArray(msg.nextSteps),
      followUpQuestions: safeArray(msg.followUpQuestions).slice(0, 5),
    };
  };

  // Rich structured AI message renderer (perfectly matches your JSON format)
  const renderStructuredAIMessage = (msg) => {
    // Normalize msg safely
    const safeMsg = normalizeAIMessage(msg);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="flex gap-3 max-w-[88%]">
          {/* AI Avatar */}
          <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Bot size={18} className="text-white" />
          </div>

          <div className="flex-1 space-y-4">
            {/* Main Message */}
            <div className="px-4 py-3 bg-slate-900/90 border border-white/5 rounded-2xl rounded-tl-none text-slate-200 text-sm leading-relaxed whitespace-pre-line shadow-xl">
              {safeMsg.content}
            </div>

            {/* Insights */}
            {safeMsg.insights.strengths.length > 0 ||
            safeMsg.insights.weaknesses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                    Core Assessment Metrics
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="flex items-center gap-1 text-emerald-400 font-semibold mb-2 text-xs uppercase tracking-wide">
                      <Award size={14} /> Strengths
                    </p>
                    <ul className="space-y-1.5 text-slate-300">
                      {safeMsg.insights.strengths.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[13px]"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500 mt-0.5 flex-shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-orange-400 font-semibold mb-2 text-xs uppercase tracking-wide">
                      <ShieldCheck size={14} /> To Improve
                    </p>
                    <ul className="space-y-1.5 text-slate-300">
                      {safeMsg.insights.weaknesses.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[13px]"
                        >
                          <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Recommendations */}
            {(safeMsg.recommendations.courses.length > 0 ||
              safeMsg.recommendations.jobs.length > 0) && (
              <div className="space-y-3">
                {/* Courses */}
                {safeMsg.recommendations.courses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={16} className="text-blue-400" />
                      <span className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                        Tailored Learning Paths
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {safeMsg.recommendations.courses.map((course, i) => (
                        <span
                          key={i}
                          className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 transition-colors rounded-xl px-3 py-1.5 text-[13px] text-blue-300 font-medium"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Jobs */}
                {safeMsg.recommendations.jobs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={16} className="text-violet-400" />
                      <span className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                        Targeted Job Profiles
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {safeMsg.recommendations.jobs.map((job, i) => (
                        <span
                          key={i}
                          className="bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 transition-colors rounded-xl px-3 py-1.5 text-[13px] text-violet-300 font-medium"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Next Steps */}
            {safeMsg.nextSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight size={16} className="text-sky-400" />
                  <span className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                    Execution Roadmap
                  </span>
                </div>
                <ol className="space-y-3 text-[13px] text-slate-300">
                  {safeMsg.nextSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="font-mono bg-blue-500/20 text-blue-400 border border-blue-500/20 w-5 h-5 flex items-center justify-center rounded-md text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            {/* Follow-up Questions */}
            {safeMsg.followUpQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2.5 pl-1">
                  Suggested Context Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {safeMsg.followUpQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleFollowUpClick(q)}
                      className="text-left text-[12px] bg-slate-900 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 transition-all px-4 py-2.5 rounded-xl text-slate-300 hover:text-blue-300 shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="font-sans antialiased">
      <AnimatePresence>
        {/* Floating AI Button */}
        {!open && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={toggleOpen}
            className="fixed bottom-6 right-6 z-[9999] group w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-px shadow-[0_10px_30px_rgba(79,70,229,0.35)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] transition-all duration-300"
          >
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center group-hover:bg-slate-900/50 transition-colors">
              <Sparkles
                className="text-white group-hover:scale-110 transition-transform"
                size={28}
              />
            </div>
            {/* Live notification badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-slate-950"></span>
            </span>
          </motion.button>
        )}

        {/* Chat Window - Immersive Full Screen */}
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.95,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-white/5 bg-slate-900/40">
              <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <Bot size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-tight">
                      Career Intelligence
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Model Active • Live
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleOpen}
                  className="p-2.5 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-1 md:p-4 scrollbar-hide">
              <div className="max-w-5xl mx-auto w-full space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6 min-h-[350px]">
                    {/* Glowing Bot Icon */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full blur-xl opacity-40 animate-pulse"></div>
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Bot size={32} className="text-white" />
                      </div>
                    </div>

                    {/* Text Context */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        No messages yet
                      </h3>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        I'm your AI career co-pilot. Ask me anything about your
                        6D profile, or click a prompt below to get started!
                      </p>
                    </div>

                    {/* Interactive Quick-Action Suggestions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-4">
                      {[
                        {
                          text: "What careers fit high analytical skills?",
                          icon: Target,
                        },
                        {
                          text: "Show me top colleges for AI engineering",
                          icon: BookOpen,
                        },
                        {
                          text: "How do I become a Product Manager?",
                          icon: Briefcase,
                        },
                        {
                          text: "Tell me more about the 6D model",
                          icon: BrainCircuit,
                        },
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="text-left p-3.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all flex items-start gap-3 group"
                          onClick={() => handleFollowUpClick(suggestion.text)}
                        >
                          <suggestion.icon
                            size={16}
                            className="text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 mt-0.5"
                          />
                          <span className="group-hover:text-white transition-colors">
                            {suggestion.text}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Status Indicator */}
                    <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      System Online & Ready
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <React.Fragment key={idx}>
                      {msg.role === "user" ? (
                        // User Message
                        <div className="flex justify-end">
                          <div className="flex gap-3 max-w-[85%] flex-row-reverse">
                            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md">
                              <User size={16} className="text-slate-300" />
                            </div>
                            <div className="px-4 py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-lg shadow-blue-900/20">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ) : // AI Message
                      msg.insights ||
                        msg.recommendations ||
                        msg.nextSteps ||
                        msg.followUpQuestions ? (
                        renderStructuredAIMessage(msg)
                      ) : (
                        // Simple AI message (fallback)
                        <div className="flex justify-start">
                          <div className="flex gap-3 max-w-[85%]">
                            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center shadow-lg">
                              <Bot size={18} className="text-white" />
                            </div>
                            <div className="px-4 py-3 bg-slate-900/90 border border-white/5 rounded-2xl rounded-tl-none text-slate-200 text-sm leading-relaxed shadow-md">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                )}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Bot size={18} className="text-slate-500" />
                    </div>
                    <div className="px-4 py-3 bg-slate-900/90 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-md">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:160ms]"></span>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:320ms]"></span>
                      </div>
                      <span className="text-slate-400 text-[13px] font-medium">
                        crunching data...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4.5 bg-slate-950/80 border-t border-white/5 backdrop-blur-sm">
              <div className="max-w-5xl mx-auto w-full">
                <div className="relative flex items-center bg-slate-900/90 border border-white/5 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-2xl p-1.5 shadow-inner transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Inquire about your career path..."
                    className="flex-1 bg-transparent text-slate-200 text-sm py-3 px-3.5 outline-none resize-none max-h-[120px] placeholder:text-slate-600"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className={`p-3 rounded-xl transition-all ${
                      input.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.98]"
                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CornerDownLeft size={20} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    CareerFinder Protocol v3.0
                  </span>
                  <span className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-wider flex items-center gap-1">
                    <div className="w-1 h-1 bg-current rounded-full" />{" "}
                    Protected
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatWidget;
