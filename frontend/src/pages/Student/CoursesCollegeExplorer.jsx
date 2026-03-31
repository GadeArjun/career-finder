import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  IndianRupee,
  Briefcase,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  Filter,
  Layers,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useCourses } from "../../context/CourseContext";
import { useCollegeContext } from "../../context/CollegeContext";

/**
 * Professional Indian Rupee Formatter
 */
const formatCurrency = (amount) => {
  if (!amount) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CourseExplorer() {
  const { getAllCourses, courses } = useCourses();
  const { fetchAllColleges } = useCollegeContext();

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // Advanced Filtering State
  const [filters, setFilters] = useState({
    search: "",
    degreeType: "",
    duration: "",
    feeRange: "",
  });
  const [sortBy, setSortBy] = useState("Popularity");

  // Initial Data Synchronization
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await getAllCourses();
        const fetchedColleges = await fetchAllColleges();
        setColleges(fetchedColleges || []);
      } catch (error) {
        console.error("Data Sync Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Logical Merging: Enriches Course data with its parent College metadata
  const enrichedCourses = useMemo(() => {
    if (!courses) return [];
    return courses.map((course) => {
      const parentCollege =
        colleges.find((c) => c._id === course.collegeId?._id) ||
        course.collegeId;
      return { ...course, parentCollege };
    });
  }, [courses, colleges]);

  // Main Filter & Sort Engine
  const processedCourses = useMemo(() => {
    return enrichedCourses
      .filter((course) => {
        const term = filters.search.toLowerCase();
        const searchMatch =
          !filters.search ||
          course.title?.toLowerCase().includes(term) ||
          course.parentCollege?.name?.toLowerCase().includes(term);

        const degreeMatch =
          !filters.degreeType || course.degreeType === filters.degreeType;
        const durationMatch =
          !filters.duration || course.duration?.includes(filters.duration);

        let feeMatch = true;
        const perYearFee = course.feeStructure?.perYear || 0;
        if (filters.feeRange === "0-1L") feeMatch = perYearFee <= 100000;
        else if (filters.feeRange === "1L-3L")
          feeMatch = perYearFee > 100000 && perYearFee <= 300000;
        else if (filters.feeRange === "3L+") feeMatch = perYearFee > 300000;

        return searchMatch && degreeMatch && durationMatch && feeMatch;
      })
      .sort((a, b) => {
        if (sortBy === "Popularity")
          return (b.popularityScore || 0) - (a.popularityScore || 0);
        if (sortBy === "Fees: Low to High")
          return (
            (a.feeStructure?.perYear || 0) - (b.feeStructure?.perYear || 0)
          );
        if (sortBy === "Highest Package")
          return (
            (b.placementStats?.highestPackage || 0) -
            (a.placementStats?.highestPackage || 0)
          );
        return 0;
      });
  }, [enrichedCourses, filters, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setVisibleCount(6); // Reset view on filter
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-blue-500 font-mono">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="tracking-[0.2em] animate-pulse">
          SYNCHRONIZING COURSE REPOSITORY...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-poppins selection:bg-blue-500/30">
      <Header title="Academic Course Explorer" />

      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
        {/* --- Hero Section --- */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-500 bg-clip-text text-transparent mb-4">
            Find Your Future Career
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Browse through specialized programs, compare fee structures, and
            analyze placement statistics from top-tier institutions.
          </p>
        </header>

        {/* --- Control Center (Search & Filters) --- */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-2xl mb-10">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                size={20}
              />
              <input
                type="text"
                name="search"
                placeholder="Search by course name or university..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base placeholder:text-slate-600"
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm mr-2">
                <Filter size={16} /> Filters
              </div>

              <select
                name="degreeType"
                value={filters.degreeType}
                onChange={handleFilterChange}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">All Degrees</option>
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
              </select>

              <select
                name="feeRange"
                value={filters.feeRange}
                onChange={handleFilterChange}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Any Fee Range</option>
                <option value="0-1L">Under ₹1 Lakh</option>
                <option value="1L-3L">₹1L - ₹3L</option>
                <option value="3L+">Above ₹3L</option>
              </select>

              <div className="h-10 w-[1px] bg-slate-700 mx-2 hidden xl:block" />

              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
                >
                  <option>Popularity</option>
                  <option>Highest Package</option>
                  <option>Fees: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* --- Results Count --- */}
        <div className="flex items-center gap-3 mb-8 text-slate-400 text-sm">
          <Layers size={18} className="text-blue-500" />
          <span>
            Showing{" "}
            <strong className="text-white">{processedCourses.length}</strong>{" "}
            specialized courses
          </span>
        </div>

        {/* --- Courses Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedCourses.slice(0, visibleCount).map((course) => (
            <div
              key={course._id}
              className="group relative bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] flex flex-col"
            >
              {/* Top Choice Badge */}
              {course.popularityScore > 90 && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg z-10">
                  TRENDING #1
                </div>
              )}

              {/* Course Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {course.degreeType || "Program"}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <Clock size={12} /> {course.duration || "N/A"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 min-h-[3.5rem] leading-snug">
                  {course.title}
                </h3>
                <div className="flex items-start gap-2 text-slate-400 text-sm mt-2">
                  <MapPin size={16} className="shrink-0 mt-1 text-slate-600" />
                  <p className="line-clamp-1">
                    {course.parentCollege?.name} •{" "}
                    <span className="text-slate-500">
                      {course.parentCollege?.location?.city}
                    </span>
                  </p>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-slate-950/60 rounded-2xl border border-slate-800 mb-8">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <IndianRupee size={12} /> Annual Fee
                  </span>
                  <p className="text-lg font-mono font-semibold text-slate-100">
                    {formatCurrency(course.feeStructure?.perYear)}
                  </p>
                </div>
                <div className="space-y-1 border-l border-slate-800 pl-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Briefcase size={12} /> Avg Salary
                  </span>
                  <p className="text-lg font-mono font-bold text-emerald-400">
                    {formatCurrency(course.placementStats?.averagePackage)}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                <Link
                  to={`/course/view/${course._id}`}
                  className="group/btn w-full py-4 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300"
                >
                  Program Analytics
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- Pagination --- */}
        {visibleCount < processedCourses.length && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-slate-800 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-all font-bold group"
            >
              Load More Programs
              <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:animate-ping" />
            </button>
          </div>
        )}

        {/* --- Empty State --- */}
        {processedCourses.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
            <GraduationCap size={48} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-500">
              No courses match your filters
            </h3>
            <p className="text-slate-600 mt-2">
              Try adjusting your search or resetting the filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
