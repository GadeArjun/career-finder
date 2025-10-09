import React, { useState } from "react";
import { Search, Filter, X, MessageCircle } from "lucide-react";
import Header from "../../components/common/Header";

// Sample data
const coursesData = [
  {
    courseName: "B.Sc. Computer Science",
    collegeName: "MIT College",
    collegeLogo: "https://via.placeholder.com/40",
    duration: "3 years",
    fee: "₹60,000/year",
    mode: "Offline",
    tags: ["Top Rated", "Popular"],
    overview:
      "Comprehensive Computer Science program covering algorithms, databases, and software development.",
    eligibility: "10+2 with Science background",
    admissionProcess: "Entrance Exam + Interview",
  },
  {
    courseName: "B.A. Psychology",
    collegeName: "Global University",
    collegeLogo: "https://via.placeholder.com/40",
    duration: "3 years",
    fee: "₹50,000/year",
    mode: "Online",
    tags: ["New", "Popular"],
    overview:
      "Learn behavioral science, mental health, and counseling techniques.",
    eligibility: "10+2 in any stream",
    admissionProcess: "Merit-based + Personal Interview",
  },
  {
    courseName: "B.Com Finance",
    collegeName: "National College",
    collegeLogo: "https://via.placeholder.com/40",
    duration: "3 years",
    fee: "₹45,000/year",
    mode: "Offline",
    tags: ["Top Rated"],
    overview:
      "Gain expertise in accounting, taxation, and financial management.",
    eligibility: "10+2 with Commerce/Math",
    admissionProcess: "Entrance Exam",
  },
];

function CoursesCollegeExplorer() {
  const [filters, setFilters] = useState({
    field: "",
    location: "",
    duration: "",
    feeRange: "",
    collegeType: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState("Popularity");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCourses = coursesData
    .filter((c) => {
      return (
        (!filters.field ||
          c.courseName.toLowerCase().includes(filters.field.toLowerCase())) &&
        (!filters.location ||
          c.collegeName.toLowerCase().includes(filters.location.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sortBy === "Fees")
        return (
          parseInt(a.fee.replace(/\D/g, "")) -
          parseInt(b.fee.replace(/\D/g, ""))
        );
      if (sortBy === "Ratings")
        return b.tags.includes("Top Rated") - a.tags.includes("Top Rated");
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-900 text-gray-100">
      {/* Header */}
      <Header title={"Explore Courses / Colleges"} darkMode />

      <main className="flex-1 pt-28 px-4 md:px-6 flex flex-col gap-6">
        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-2xl shadow-md flex flex-col md:flex-row flex-wrap gap-3 md:items-center md:justify-start">
          <input
            type="text"
            name="field"
            placeholder="Field of Study"
            value={filters.field}
            onChange={handleFilterChange}
            className="p-2 border border-gray-600 rounded flex-1 min-w-[120px] bg-gray-900 text-gray-100 placeholder-gray-400"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="p-2 border border-gray-600 rounded flex-1 min-w-[120px] bg-gray-900 text-gray-100 placeholder-gray-400"
          />
          <select
            name="duration"
            value={filters.duration}
            onChange={handleFilterChange}
            className="p-2 border border-gray-600 rounded flex-1 min-w-[120px] bg-gray-900 text-gray-100"
          >
            <option value="">Duration</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
          </select>
          <select
            name="feeRange"
            value={filters.feeRange}
            onChange={handleFilterChange}
            className="p-2 border border-gray-600 rounded flex-1 min-w-[120px] bg-gray-900 text-gray-100"
          >
            <option value="">Fee Range</option>
            <option>₹0 - ₹50,000</option>
            <option>₹50,001 - ₹1,00,000</option>
            <option>₹1,00,001+</option>
          </select>
          <select
            name="collegeType"
            value={filters.collegeType}
            onChange={handleFilterChange}
            className="p-2 border border-gray-600 rounded flex-1 min-w-[120px] bg-gray-900 text-gray-100"
          >
            <option value="">College Type</option>
            <option>Private</option>
            <option>Government</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
            Apply Filters
          </button>
        </div>

        {/* Sorting */}
        <div className="flex justify-end gap-4 items-center">
          <span className="text-gray-400 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-1 border border-gray-600 rounded bg-gray-900 text-gray-100"
          >
            <option>Popularity</option>
            <option>Fees</option>
            <option>Ratings</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-4 rounded-2xl shadow-md flex flex-col gap-2 hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={course.collegeLogo}
                  alt={course.collegeName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{course.courseName}</h4>
                  <p className="text-gray-400 text-sm">{course.collegeName}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {course.duration} | {course.fee} | {course.mode}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {course.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-700 text-blue-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded hover:shadow-md transition text-sm">
                View Details / Apply
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition">
            Load More
          </button>
        </div>
      </main>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full relative shadow-lg flex flex-col gap-4 text-gray-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
              onClick={() => setSelectedCourse(null)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold text-blue-400">
              {selectedCourse.courseName}
            </h3>
            <p className="text-gray-400">{selectedCourse.collegeName}</p>
            <p className="text-gray-200">{selectedCourse.overview}</p>
            <p className="text-gray-400 text-sm">
              <strong>Eligibility:</strong> {selectedCourse.eligibility}
            </p>
            <p className="text-gray-400 text-sm">
              <strong>Admission Process:</strong>{" "}
              {selectedCourse.admissionProcess}
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2">
        <MessageCircle size={20} /> Chat with Counselor
      </button>
    </div>
  );
}

export default CoursesCollegeExplorer;
