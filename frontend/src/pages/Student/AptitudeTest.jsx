// pages/Student/AptitudeTest.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

function AptitudeTest() {
  const navigate = useNavigate();

  // ===== Questions Data =====
  const questions = [
    {
      text: "You enjoy solving logical problems.",
      options: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ],
      section: "Logical",
    },
    {
      text: "You prefer working in a team rather than alone.",
      options: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ],
      section: "Personality",
    },
    {
      text: "You like exploring new creative ideas.",
      options: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ],
      section: "Interest",
    },
    {
      text: "You can stay calm under stressful situations.",
      options: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ],
      section: "Personality",
    },
    {
      text: "You enjoy tasks that require attention to detail.",
      options: [
        "Strongly Agree",
        "Agree",
        "Neutral",
        "Disagree",
        "Strongly Disagree",
      ],
      section: "Logical",
    },
  ];

  const totalQuestions = questions.length;
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));

  // ===== Timer Countdown =====
  useEffect(() => {
    let timer;
    if (testStarted && !testCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeRemaining === 0) {
      setTestCompleted(true);
    }
    return () => clearInterval(timer);
  }, [testStarted, testCompleted, timeRemaining]);

  // ===== Warn user if leaving page mid-test =====
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (testStarted && !testCompleted) {
        e.preventDefault();
        e.returnValue =
          "Your test progress will be lost if you leave this page.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [testStarted, testCompleted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const goNext = () => {
    if (currentQuestion < totalQuestions - 1)
      setCurrentQuestion(currentQuestion + 1);
    else setTestCompleted(true);
  };

  const goPrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleViewResults = () => {
    navigate("/student/recommendations");
  };

  const handleRestartTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestion(0);
    setTimeRemaining(15 * 60);
    setAnswers(Array(totalQuestions).fill(null));
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-900 text-gray-100 transition-colors duration-300">
      <Header title="Aptitude & Personality Test" />

      <main className="flex-1 p-6 mt-20 flex flex-col items-center relative">
        {/* ===== Confetti on Completion ===== */}
        {testCompleted && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        {/* ===== START TEST SCREEN ===== */}
        {!testStarted && !testCompleted && (
          <div className="w-full max-w-3xl bg-gray-800 p-10 mt-20 rounded-2xl shadow-md flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-semibold text-blue-400">
              Aptitude & Personality Assessment
            </h2>
            <p className="text-gray-300">
              You will have{" "}
              <span className="font-medium">{totalQuestions}</span> questions to
              complete in <span className="font-medium">15 minutes</span>.
            </p>
            <p className="text-gray-400 text-sm">
              This test assesses your aptitude, personality, and interests. Make
              sure you are in a quiet environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => setTestStarted(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:shadow-md transition w-full sm:w-auto"
              >
                Start Test
              </button>
              <button
                onClick={handleRestartTest}
                className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ===== TEST QUESTIONS SCREEN ===== */}
        {testStarted && !testCompleted && (
          <>
            {/* ===== Test Info Bar ===== */}
            <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row items-center justify-between bg-gray-800 p-4 rounded-2xl shadow-sm gap-3 md:gap-0">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
                <div className="w-64 bg-gray-700 h-2 rounded-full mt-1">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / totalQuestions) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-gray-400 font-mono text-sm">
                ⏱ {formatTime(timeRemaining)} remaining
              </div>
            </div>

            {/* ===== Question Card ===== */}
            <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-md flex flex-col gap-6 transition-colors">
              <h2 className="text-xl font-semibold text-blue-400">
                Aptitude & Personality Assessment
              </h2>
              <p className="text-gray-100 text-lg">
                {questions[currentQuestion].text}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`px-4 py-2 rounded-lg border transition text-left ${
                      answers[currentQuestion] === opt
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4 sm:gap-0">
                <button
                  onClick={goPrev}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition w-full sm:w-auto"
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                <button
                  onClick={goNext}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition w-full sm:w-auto"
                >
                  {currentQuestion === totalQuestions - 1
                    ? "Finish Test"
                    : "Next"}
                </button>
              </div>
            </div>

            <div className="w-full max-w-4xl mt-6 flex justify-end">
              <div className="bg-gray-800 p-4 rounded-2xl shadow-sm w-48 text-sm">
                <p className="font-medium text-gray-300 mb-2">
                  Section: {questions[currentQuestion].section}
                </p>
                <p className="text-gray-400 mb-1">
                  Remaining Questions: {totalQuestions - (currentQuestion + 1)}
                </p>
              </div>
            </div>
          </>
        )}

        {/* ===== COMPLETION SCREEN ===== */}
        {testCompleted && (
          <div className="w-full max-w-3xl bg-gray-800 p-10 mt-10 rounded-2xl shadow-md flex flex-col items-center gap-6 text-center transition-colors">
            <h2 className="text-2xl font-semibold text-green-500">
              🎉 Test Completed!
            </h2>
            <p className="text-gray-300">
              Congratulations! You have completed the test.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={handleViewResults}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:shadow-md transition w-full sm:w-auto"
              >
                View Results & Recommendations
              </button>
              <button
                onClick={handleRestartTest}
                className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition w-full sm:w-auto"
              >
                Retake Test
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AptitudeTest;
