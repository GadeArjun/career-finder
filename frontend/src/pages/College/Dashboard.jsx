import React, { useState, useEffect } from "react";
import {
  Building2,
  PlusCircle,
  School,
  BookOpen,
  Users,
  Edit3,
  ArrowRight,
  Search,
  Trash2,
  MapPin,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming react-router is used
import Header from "../../components/common/Header";
import { useCollegeContext } from "../../context/CollegeContext";

function CollegeDashboard() {
  const navigate = useNavigate();

  // --- Context Data ---
  const {
    colleges: collegesList, // Renaming to avoid conflict if needed
    loading,
    error,
    fetchColleges,
    addCollege,
    deleteCollege,
    setSelectedCollege,
  } = useCollegeContext();

  // --- Local UI State ---
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: { city: "", state: "", country: "India" }, // Structure matches typical backend
    accreditation: "",
    email: "",
    establishedYear: new Date().getFullYear(),
  });

  // --- Fetch Data on Mount ---
  useEffect(() => {
    fetchColleges();
  }, []);

  // --- Derived State (Search/Filter) ---
  const filteredColleges =
    collegesList?.filter(
      (college) =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location?.city
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "city" || name === "state") {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email)
      return alert("Name and Email are required");

    setSubmitting(true);
    const res = await addCollege(formData);
    setSubmitting(false);

    if (res?.success) {
      setShowAddCollege(false);
      setFormData({
        name: "",
        location: { city: "", state: "", country: "India" },
        accreditation: "",
        email: "",
        establishedYear: new Date().getFullYear(),
      });
    } else {
      alert(res?.message || "Failed to add college");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this college? This action cannot be undone."
      )
    ) {
      await deleteCollege(id);
    }
  };

  const handleCardClick = (college) => {
    setSelectedCollege(college);
    navigate(`/college/colleges/${college._id || college.id}`); // Navigate to details page
  };

  // --- Stats Calculation ---
  const totalStudents =
    collegesList?.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0) ||
    0;
  const totalCourses =
    collegesList?.reduce((acc, curr) => acc + (curr.totalCourses || 0), 0) || 0;

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-950 text-gray-100 pb-10">
      <Header title={"College Dashboard"} />

      <main className="flex-1 p-4 md:p-8 pt-24 max-w-7xl mx-auto w-full mt-10 ">
        {/* ===== TOP STATS ROW ===== */}
        {collegesList?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<School className="text-blue-400" />}
              label="Total Colleges"
              value={collegesList.length}
              sub="Institutes Managed"
            />
            <StatCard
              icon={<Users className="text-purple-400" />}
              label="Total Students"
              value={totalStudents.toLocaleString()}
              sub="Across all campuses"
            />
            <StatCard
              icon={<BookOpen className="text-green-400" />}
              label="Active Courses"
              value={totalCourses}
              sub="Programs offered"
            />
          </div>
        )}

        {/* ===== CONTROLS ROW ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <button
            onClick={() => setShowAddCollege(true)}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> Add New College
          </button>
        </div>

        {/* ===== CONTENT AREA ===== */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : // : error && collegesList?.length !== 0 ? (
        //   <div className="flex flex-col items-center justify-center p-12 text-red-400 bg-red-900/10 rounded-2xl border border-red-900/50">
        //     <AlertCircle size={48} className="mb-4" />
        //     <p>Error loading colleges: {error}</p>
        //     <button
        //       onClick={fetchColleges}
        //       className="mt-4 text-sm underline hover:text-red-300"
        //     >
        //       Try Again
        //     </button>
        //   </div>
        // )
        collegesList?.length === 0 ? (
          /* EMPTY STATE */
          <EmptyState onAdd={() => setShowAddCollege(true)} />
        ) : filteredColleges.length === 0 ? (
          /* NO SEARCH RESULTS */
          <div className="text-center py-20 text-gray-500">
            <p>No colleges found matching "{searchQuery}"</p>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <div
                key={college._id || college.id}
                onClick={() => handleCardClick(college)}
                className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-blue-500/30 transition">
                    {college.logo ? (
                      <img
                        src={college.logo}
                        alt="logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <School
                        className="text-gray-400 group-hover:text-blue-400"
                        size={24}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) =>
                        handleDelete(e, college._id || college.id)
                      }
                      className="p-2 hover:bg-red-900/30 text-gray-500 hover:text-red-400 rounded-lg transition"
                      title="Delete College"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-blue-400 transition line-clamp-1">
                  {college.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <MapPin size={14} />
                  <span className="truncate">
                    {college.location?.city || "City"},{" "}
                    {college.location?.state || "State"}
                  </span>
                </div>

                {/* Mini Stats Grid inside Card */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
                    <span className="block text-xs text-gray-500 uppercase">
                      Courses
                    </span>
                    <span className="font-semibold text-gray-200">
                      {college.totalCourses || 0}
                    </span>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
                    <span className="block text-xs text-gray-500 uppercase">
                      Rating
                    </span>
                    <span className="font-semibold text-yellow-400 flex items-center justify-center gap-1">
                      {college.rating || "N/A"} ★
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs px-2 py-1 rounded bg-blue-900/20 text-blue-300 border border-blue-900/30">
                    {college.accreditation || "NAAC ?"}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                    Manage <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== ADD COLLEGE MODAL ===== */}
      {showAddCollege && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 size={20} className="text-blue-500" /> Add New
                Institute
              </h3>
              <button
                onClick={() => setShowAddCollege(false)}
                className="text-gray-400 hover:text-white"
              >
                <MoreVertical size={20} className="rotate-90" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                  Institute Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. National Institute of Technology"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Pune"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. MH"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    Accreditation
                  </label>
                  <input
                    type="text"
                    name="accreditation"
                    placeholder="e.g. NAAC A++"
                    value={formData.accreditation}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                    Est. Year
                  </label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase mb-1 block">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="info@college.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddCollege(false)}
                  className="px-4 py-2 bg-transparent hover:bg-gray-800 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Create Institute"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub-Components ---

const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:border-blue-500/20 transition">
    <div className="p-3 bg-gray-800 rounded-xl">{icon}</div>
    <div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
      <div className="w-6 h-6 bg-gray-800 rounded"></div>
    </div>
    <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="h-10 bg-gray-800 rounded-lg"></div>
      <div className="h-10 bg-gray-800 rounded-lg"></div>
    </div>
    <div className="h-8 bg-gray-800 rounded w-full"></div>
  </div>
);

const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center mt-10 text-center space-y-6">
    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center relative">
      <Building2 size={40} className="text-gray-600" />
      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-gray-950">
        <PlusCircle size={16} className="text-white" />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-white">No Colleges Added</h2>
      <p className="text-gray-400 max-w-sm mx-auto mt-2">
        Start by adding your first institute to manage courses, placements, and
        student inquiries.
      </p>
    </div>
    <button
      onClick={onAdd}
      className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition shadow-lg shadow-white/5"
    >
      Add First College
    </button>
  </div>
);

export default CollegeDashboard;
