// pages/Student/ResultRecommendations.jsx
import React from "react";
import Header from "../../components/common/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, BookOpen } from "lucide-react";

function ResultRecommendations() {
  // ===== Sample Data =====
  const overallScore = 82;

  const sectionPerformance = [
    { section: "Logical Reasoning", score: 85 },
    { section: "Verbal Skills", score: 78 },
    { section: "Personality Alignment", score: 90 },
    { section: "Interest Match", score: 80 },
  ];

  const careerRecommendations = [
    {
      title: "Software Engineer",
      match: 92,
      description:
        "Develop and maintain software applications with strong analytical skills.",
      icon: "💻",
    },
    {
      title: "Data Analyst",
      match: 88,
      description: "Interpret complex data and provide actionable insights.",
      icon: "📊",
    },
    {
      title: "UX Designer",
      match: 85,
      description:
        "Design user-friendly interfaces and improve user experience.",
      icon: "🎨",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-900 text-gray-100 transition-colors duration-300">
      {/* ===== Header ===== */}
      <Header title="Results & Career Recommendations" />

      <main className="flex-1 p-6 mt-20 flex flex-col items-center gap-8">
        {/* ===== Summary Section ===== */}
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-blue-400">
              Overall Score
            </h2>
            <p className="text-gray-200 text-lg">{overallScore}%</p>
            <p className="text-gray-400 text-sm mt-1">
              Excellent analytical and problem-solving skills.
            </p>
          </div>
          <div className="w-40 h-40 flex items-center justify-center">
            {/* Circular progress bar */}
            <svg viewBox="0 0 36 36" className="w-36 h-36">
              {/* Background circle */}
              <path
                d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151" // Dark gray for background circle
                strokeWidth="3.5"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6" // Bright blue for progress
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${overallScore}, 100`}
              />
              {/* Center text */}
              <text
                x="18"
                y="20.35"
                textAnchor="middle"
                fill="#F9FAFB" // Light text for dark background
                fontSize="0.7rem"
                fontWeight="600"
              >
                {overallScore}%
              </text>
            </svg>
          </div>
        </div>

        {/* ===== Section-wise Performance ===== */}
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col gap-6 transition-colors">
          <h3 className="text-xl font-semibold text-blue-400">
            Section-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sectionPerformance}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis
                dataKey="section"
                tick={{ fill: "#E5E7EB", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#E5E7EB", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="score" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ===== Top Career Recommendations ===== */}
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-blue-400">
            Top Career Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRecommendations.map((career, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col gap-3 transition-colors hover:bg-gray-700"
              >
                <div className="text-3xl">{career.icon}</div>
                <h4 className="text-lg font-semibold">{career.title}</h4>
                <p className="text-gray-300 text-sm">{career.description}</p>
                <p className="text-blue-400 font-semibold">
                  {career.match}% match
                </p>
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm w-full sm:w-auto">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition text-sm flex items-center gap-1 w-full sm:w-auto">
                    <BookOpen size={16} /> Explore Courses
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Footer Buttons ===== */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center gap-2 w-full sm:w-auto">
            <Download size={16} /> Download Report (PDF)
          </button>
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition w-full sm:w-auto">
            View Learning Path
          </button>
        </div>
      </main>
    </div>
  );
}

export default ResultRecommendations;
