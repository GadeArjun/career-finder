import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/common/Header";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCcw,
  Loader2,
} from "lucide-react";

function AptitudeTest() {
  const navigate = useNavigate();

  // ===== API & Test State =====
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  // ===== UI & Timer State =====
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // 1. Fetch Random Test from API
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/tests/random`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );
        const data = res.data;
        setTest(data);
        // Set timer based on API duration (convert minutes to seconds)
        setTimeRemaining(data.duration * 60);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchTest();
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeRemaining === 0 && testStarted) {
      handleAutoSubmit();
    }
    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeRemaining]);

  // 3. Prevent page refresh mid-test
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (testStarted && !testCompleted) {
        e.preventDefault();
        e.returnValue = "Progress will be lost!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [testStarted, testCompleted]);

  // ===== Handlers =====
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswer = (value) => {
    const question = test.questions[current];
    setAnswers((prev) => ({
      ...prev,
      [question._id]: {
        questionText: question.questionText,
        type: question.type,
        answer: value,
        category: question.questionCategory,
      },
    }));
  };

  const next = () => {
    if (current < test.questions.length - 1) setCurrent(current + 1);
    else setTestCompleted(true);
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleAutoSubmit = () => {
    setTestCompleted(true);
    // You could trigger the submitTest API call automatically here
  };

  const submitTest = async () => {
    const submission = {
      testId: test.testId,
      testTitle: test.title,
      totalQuestions: test.questions.length,
      answers,
    };
    console.log("FINAL SUBMISSION:", submission);

    // Logic to send to backend:
    // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tests/submit`, submission, { headers: ... });

    navigate("/student/recommendations");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-blue-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="animate-pulse font-poppins text-xl">
          Assembling Your Career Intelligence Test...
        </p>
      </div>
    );

  if (!test)
    return (
      <div className="p-20 text-center text-white">No test data available.</div>
    );

  const currentQuestion = test.questions[current];

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-gray-100">
      <Header title="Aptitude & Career Test" />

      <main className="flex-1 p-6 mt-20 flex flex-col items-center relative">
        {testCompleted && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        {/* ===== START SCREEN ===== */}
        {!testStarted && !testCompleted && (
          <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800 via-blue-900/20 to-gray-900 border border-blue-500/20 p-10 mt-10 rounded-[2.5rem] shadow-2xl text-center">
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {test.title}
            </h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {test.description}
            </p>

            <div className="flex justify-center gap-8 mb-8 text-sm uppercase tracking-widest font-bold">
              <div className="flex flex-col items-center">
                <span className="text-blue-500 mb-1">Questions</span>
                <span className="text-2xl text-white">
                  {test.questions.length}
                </span>
              </div>
              <div className="h-10 w-px bg-gray-700"></div>
              <div className="flex flex-col items-center">
                <span className="text-yellow-500 mb-1">Time Limit</span>
                <span className="text-2xl text-white">{test.duration} Min</span>
              </div>
            </div>

            <button
              onClick={() => setTestStarted(true)}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95"
            >
              Start Assessment
            </button>
          </div>
        )}

        {/* ===== TEST INTERFACE ===== */}
        {testStarted && !testCompleted && (
          <div className="w-full max-w-4xl animate-in fade-in duration-500">
            {/* Header / Info Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-gray-900/50 backdrop-blur-md border border-white/5 p-5 rounded-3xl shadow-xl mb-6 gap-4">
              <div className="flex-1 w-full">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-gray-500 mb-2">
                  <span>Progress</span>
                  <span className="text-blue-400">
                    {current + 1} / {test.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        ((current + 1) / test.questions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-950 px-6 py-3 rounded-2xl border border-blue-500/20 shadow-inner">
                <Timer size={18} className="text-yellow-500" />
                <span
                  className={`font-mono text-xl font-bold ${
                    timeRemaining < 60
                      ? "text-red-500 animate-pulse"
                      : "text-blue-400"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {currentQuestion.questionCategory}
                </span>
                <span className="px-4 py-1 bg-gray-700 text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {currentQuestion.difficulty}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 leading-snug">
                {currentQuestion.questionText}
              </h2>

              {/* Dynamic Inputs Based on Type */}
              <div className="grid grid-cols-1 gap-4">
                {(currentQuestion.type === "MCQ" ||
                  currentQuestion.type === "TrueFalse" ||
                  currentQuestion.type === "Scenario") &&
                  currentQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.text)}
                      className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left font-semibold ${
                        answers[currentQuestion._id]?.answer === opt.text
                          ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40"
                          : "bg-gray-950/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
                      }`}
                    >
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-xs ${
                          answers[currentQuestion._id]?.answer === opt.text
                            ? "bg-white text-blue-600"
                            : "bg-gray-800 text-gray-500 group-hover:bg-gray-700"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt.text}
                    </button>
                  ))}

                {currentQuestion.type === "Numeric" && (
                  <input
                    type="number"
                    placeholder="Enter numeric value..."
                    className="w-full bg-gray-950 border-2 border-gray-800 focus:border-blue-500 p-6 rounded-2xl outline-none text-xl transition-all"
                    onChange={(e) => handleAnswer(e.target.value)}
                    value={answers[currentQuestion._id]?.answer || ""}
                  />
                )}

                {currentQuestion.type === "Descriptive" && (
                  <textarea
                    rows="5"
                    placeholder="Type your detailed response here..."
                    className="w-full bg-gray-950 border-2 border-gray-800 focus:border-blue-500 p-6 rounded-2xl outline-none text-lg transition-all"
                    onChange={(e) => handleAnswer(e.target.value)}
                    value={answers[currentQuestion._id]?.answer || ""}
                  />
                )}
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold transition-all text-gray-300"
                >
                  <ChevronLeft size={20} /> Previous
                </button>

                <button
                  onClick={next}
                  className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black transition-all shadow-xl ${
                    current === test.questions.length - 1
                      ? "bg-green-600 hover:bg-green-500 text-white shadow-green-900/40"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40"
                  }`}
                >
                  {current === test.questions.length - 1 ? (
                    <>
                      Finish Assessment <Send size={20} />
                    </>
                  ) : (
                    <>
                      Next Question <ChevronRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== COMPLETION SCREEN ===== */}
        {testCompleted && (
          <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-950 border border-green-500/20 p-12 mt-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/40">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Test Completed!
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Data has been captured. We are ready to analyze your career
              fitment based on your performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={submitTest}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl shadow-blue-900/40 transition-all hover:scale-105"
              >
                View Recommendations
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Retake Test
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AptitudeTest;
