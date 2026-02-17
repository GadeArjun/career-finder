// pages/Student/ResultRecommendations.jsx
import React, { useEffect } from "react";
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
import axios from "axios";

function ResultRecommendations() {
  const overallScore = 82;

  const fetchRecommendation = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/recommendation/my`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = res.data;
    console.log(data);
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

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
    <div className="flex flex-col min-h-screen font-poppins bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900 text-gray-100">
      {/* ===== Header ===== */}
      <Header title="Results & Career Recommendations" />

      <main className="flex-1 p-6 mt-20 flex flex-col items-center gap-10">
        {/* ===== Overall Score Section ===== */}
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-800 via-blue-900/40 to-gray-900 border border-blue-500/20 p-8 rounded-2xl shadow-lg hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Overall Score
            </h2>
            <p className="text-gray-200 text-lg">{overallScore}%</p>
            <p className="text-gray-400 text-sm mt-1">
              Excellent analytical and problem-solving performance.
            </p>
          </div>

          {/* ===== Circular Progress Indicator ===== */}
          <div className="w-44 h-44 relative">
            <svg viewBox="0 0 36 36" className="w-44 h-44 rotate-[-90deg]">
              {/* Background circle */}
              <path
                d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1F2937"
                strokeWidth="3.5"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#grad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${overallScore}, 100`}
                className="animate-[pulse_2s_ease-in-out_infinite]"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-3xl font-bold text-white">{overallScore}%</p>
              <span className="text-gray-400 text-xs">Total Score</span>
            </div>
          </div>
        </div>

        {/* ===== Section-wise Performance ===== */}
        <div className="w-full max-w-4xl bg-gradient-to-br from-gray-800 via-blue-900/40 to-gray-900 border border-blue-500/20 p-8 rounded-2xl shadow-md hover:shadow-blue-400/30 transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Section-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
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
                  border: "1px solid #3B82F6",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar
                dataKey="score"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ===== Career Recommendations ===== */}
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <h3 className="text-xl font-semibold text-blue-400">
            Top Career Recommendations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerRecommendations.map((career, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800 via-blue-900/40 to-gray-900 border border-blue-500/20 p-6 rounded-2xl shadow-md hover:shadow-blue-400/30 transition-all transform hover:-translate-y-1 flex flex-col gap-3"
              >
                <div className="text-4xl">{career.icon}</div>
                <h4 className="text-lg font-semibold text-white">
                  {career.title}
                </h4>
                <p className="text-gray-300 text-sm">{career.description}</p>

                <p className="text-blue-400 font-semibold">
                  {career.match}% match
                </p>

                {/* ===== Buttons ===== */}
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg hover:shadow-blue-400/30 hover:scale-[1.03] transition text-sm w-full sm:w-auto">
                    View Details
                  </button>
                  <button className="px-3 py-2 bg-gray-800 border border-blue-500/30 text-gray-200 rounded-lg hover:bg-gray-700 hover:scale-[1.03] transition text-sm flex items-center justify-center gap-1 w-full sm:w-auto">
                    <BookOpen size={16} /> Explore Courses
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Footer Buttons ===== */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <button className="px-5 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg font-semibold shadow-md hover:shadow-blue-400/40 hover:scale-[1.03] transition flex items-center gap-2 w-full sm:w-auto">
            <Download size={16} /> Download Report (PDF)
          </button>
          <button className="px-5 py-2 bg-gray-800 text-gray-200 border border-blue-500/30 rounded-lg hover:bg-gray-700 hover:scale-[1.03] transition w-full sm:w-auto">
            View Learning Path
          </button>
        </div>
      </main>
    </div>
  );
}

export default ResultRecommendations;
