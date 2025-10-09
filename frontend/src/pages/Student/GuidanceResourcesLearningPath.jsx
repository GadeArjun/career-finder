import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Video,
  Clipboard,
  Puzzle,
  MessageCircle,
} from "lucide-react";
import Header from "../../components/common/Header";

// Sample Learning Path Steps
const learningSteps = [
  { step: "Learn Python Programming", progress: 100 },
  { step: "Master Statistics & Math for Data Science", progress: 60 },
  { step: "Study Machine Learning", progress: 30 },
  { step: "Work on Projects", progress: 0 },
  { step: "Build Portfolio & Apply for Jobs", progress: 0 },
];

// Sample Resources
const resources = [
  {
    title: "Introduction to Data Science",
    type: "Article",
    duration: "15 min read",
    tag: "Beginner",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Python for Data Science",
    type: "Video",
    duration: "1 hr 20 min",
    tag: "Beginner",
    icon: <Video size={20} />,
  },
  {
    title: "Statistics for Machine Learning",
    type: "Course",
    duration: "6 hr",
    tag: "Intermediate",
    icon: <Clipboard size={20} />,
  },
  {
    title: "Hands-on ML Workshop",
    type: "Workshop",
    duration: "2 hr",
    tag: "Advanced",
    icon: <Puzzle size={20} />,
  },
];

function GuidanceResourcesLearningPath() {
  const [activeTab, setActiveTab] = useState("Articles");

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-900 text-gray-100">
      {/* Header / Breadcrumb */}
      <Header title={"Guidance Resources & Learning Path"} darkMode />

      <main className="flex-1 pt-28 px-4 md:px-6 flex flex-col gap-6">
        {/* Career Summary Card */}
        <div className="bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-400">
              Data Scientist
            </h2>
            <p className="text-gray-400 mt-1">
              Analyze complex data and create predictive models.
            </p>
            <div className="mt-2 w-full max-w-md bg-gray-700 h-2 rounded-full">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                style={{ width: "40%" }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Learning Path: 40% completed
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition mt-2 md:mt-0">
            View Full Roadmap
          </button>
        </div>

        {/* Learning Path Steps */}
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto sm:p-4">
          {learningSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-2xl shadow-md p-4 min-w-[220px] flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-200 text-sm">
                  {step.step}
                </h3>
                <span className="text-gray-400 text-xs">{step.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${step.progress}%` }}
                />
              </div>
              <button className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded text-sm hover:shadow-md transition">
                View Resources
              </button>
            </div>
          ))}
        </div>

        {/* Resources Library */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 overflow-auto">
            {["Articles", "Videos", "Courses", "Workshops"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                } transition`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {resources
              .filter((r) => r.type.startsWith(activeTab.slice(0, 1)))
              .map((res, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-2 text-blue-400">
                    {res.icon}
                    <h4 className="font-semibold text-gray-200 text-sm">
                      {res.title}
                    </h4>
                  </div>
                  <p className="text-gray-400 text-xs">
                    {res.duration} | {res.tag}
                  </p>
                  <button className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded hover:shadow-md transition text-sm">
                    View
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Suggested Skills Panel */}
        <div className="bg-gray-800 rounded-2xl shadow-md p-4 mt-4">
          <h3 className="font-semibold text-blue-400 mb-2">Suggested Skills</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Analytical Thinking",
              "Python Programming",
              "Communication Skills",
            ].map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs bg-blue-700 text-blue-300 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2">
        <MessageCircle size={20} /> Chat with Mentor
      </button>
    </div>
  );
}

export default GuidanceResourcesLearningPath;
