// pages/Student/Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { Sun, Sunset, Moon } from "lucide-react"; // icons for morning, afternoon, evening

function Greeting() {
  const { user } = useUserContext();
  const hour = new Date().getHours();

  let greeting = "";
  let Icon = Sun; // default icon
  let iconColor = "#FACC15"; // default yellow for Sun

  // Set greeting, icon, and color dynamically
  if (hour < 12) {
    greeting = "Good Morning";
    Icon = Sun;
    iconColor = "#FACC15"; // yellow
  } else if (hour < 17) {
    greeting = "Good Afternoon";
    Icon = Sunset;
    iconColor = "#F97316"; // orange
  } else {
    greeting = "Good Evening";
    Icon = Moon;
    iconColor = "#60A5FA"; // blue
  }

  const userName = user?.personalInfo?.name || user?.name || "User";

  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: `${iconColor}33` }} // 33 = 20% opacity
      >
        <Icon size={22} color={iconColor} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-100">
        {greeting}, <span className="text-blue-400 font-bold">{userName}</span>
      </h2>
    </div>
  );
}
function Dashboard() {
  const { user } = useUserContext();
  // Sample data for Career Progress Tracker chart
  const chartData = [
    { week: "Week 1", tests: 1, recommendations: 2 },
    { week: "Week 2", tests: 2, recommendations: 3 },
    { week: "Week 3", tests: 3, recommendations: 4 },
    { week: "Week 4", tests: 3, recommendations: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-900 text-gray-100 transition-colors duration-300">
      <Header title={"Dashboard"} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-auto pt-20">
          {/* Greeting */}
          {Greeting()}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Profile Completion */}
            {user.profileCompletion !== 100 && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
                <h3 className="font-semibold mb-2 text-gray-200">
                  Profile Completion
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                    {user.profileCompletion}
                  </div>
                  <Link
                    to={"/student/profile"}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                  >
                    Update Now
                  </Link>
                </div>
              </div>
            )}

            {/* Aptitude Test Status */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-200">
                Aptitude Test Status
              </h3>
              <p className="mb-4 text-gray-300">
                You have completed 2/3 sections
              </p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
                Continue Test
              </button>
            </div>

            {/* Recent Career Recommendations */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-200">
                Recent Career Recommendations
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  "Software Engineer",
                  "UI/UX Designer",
                  "Marketing Analyst",
                ].map((career) => (
                  <div
                    key={career}
                    className="flex items-center justify-between p-2 bg-blue-900 rounded"
                  >
                    <span>{career}</span>
                    <a href="#" className="text-blue-400 hover:underline">
                      View Details
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Development Resources */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-200">
                Skill Development Resources
              </h3>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {[
                  "Data Science Basics",
                  "Communication Skills",
                  "UI/UX Fundamentals",
                  "Time Management",
                ].map((skill) => (
                  <div key={skill} className="p-2 bg-blue-900 rounded">
                    {skill}
                  </div>
                ))}
              </div>
              <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
                See All
              </button>
            </div>

            {/* Career Progress Tracker */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition col-span-1 md:col-span-2 xl:col-span-1">
              <h3 className="font-semibold mb-2 text-gray-200">
                Career Progress Tracker
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "8px",
                      border: "none",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tests"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="recommendations"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Announcements / Notifications */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="font-semibold mb-2 text-gray-200">
                Announcements
              </h3>
              <ul className="flex flex-col gap-2">
                {[
                  "New Psychometric test added!",
                  "Check top trending careers 2025",
                ].map((notice, idx) => (
                  <li key={idx} className="p-2 bg-blue-900 rounded">
                    {notice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm p-4 mt-auto text-center shadow-inner">
        Help | Contact | Privacy Policy | © 2025 CareerGuide+
      </footer>
    </div>
  );
}

export default Dashboard;
