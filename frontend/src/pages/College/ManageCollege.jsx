import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  MapPin,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Layout,
  CheckCircle2,
  X,
  Plus,
  ArrowLeft,
  Loader2,
  Cpu,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming React Router
import Header from "../../components/common/Header"; // Your existing header
import { useCollegeContext } from "../../context/CollegeContext";

// --- ENUMS & CONSTANTS (Matches Schema) ---
const COLLEGE_TYPES = ["Private", "Government", "Deemed", "Autonomous"];
const TEACHING_STYLES = [
  "Practical",
  "Research",
  "Industry-Oriented",
  "Academic",
  "Balanced",
];
const CAMPUS_TYPES = ["Urban", "Semi-Urban", "Rural"];

const FOCUS_AREAS = [
  "Engineering",
  "Medical",
  "Design",
  "Arts",
  "Commerce",
  "Law",
  "Management",
  "Research",
  "Vocational",
  "Technology",
  "AI",
  "Data Science",
  "Media",
  "Healthcare",
];

const STUDENT_TYPES = [
  "High Achievers",
  "Average Students",
  "Creative Minds",
  "Research Oriented",
  "Career Focused",
  "Entrepreneurs",
  "First-Generation Learners",
];

const COMPETENCIES = [
  { key: "analytical", label: "Analytical Thinking" },
  { key: "verbal", label: "Verbal Communication" },
  { key: "creative", label: "Creativity & Innovation" },
  { key: "scientific", label: "Scientific Aptitude" },
  { key: "social", label: "Social Skills" },
  { key: "technical", label: "Technical Proficiency" },
];

const ManageCollege = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing an existing college
  const { addCollege, updateCollege, getCollegeById } = useCollegeContext();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  // --- INITIAL STATE (Matches Mongoose Schema) ---
  const [formData, setFormData] = useState({
    name: "",
    location: { city: "", state: "", country: "India" },
    logo: "",
    bannerImage: "",
    description: "",
    accreditation: "",
    establishedYear: "",
    collegeType: "Private",
    website: "",
    email: "",
    socialLinks: { facebook: "", linkedin: "", instagram: "", twitter: "" },

    // AI Matching Core
    competencyProfile: {
      analytical: 50,
      verbal: 50,
      creative: 50,
      scientific: 50,
      social: 50,
      technical: 50,
    },
    focusAreas: [],
    teachingStyle: "Balanced",
    bestFor: [],

    // Placement & Fees
    placementStats: {
      averagePackage: "",
      highestPackage: "",
      placementRate: "",
      topRecruiters: [],
    },
    feeRange: { min: "", max: "" },

    // Campus Life
    campusType: "Urban",
    hostelAvailable: false,
    internationalExposure: false,
    facilities: [],

    // Reputation
    rating: 3.5,
    nirfRank: "",
    researchScore: "",
    industryCollaborationScore: "",

    // Admin
    status: "pending",
  });

  useEffect(() => {
    async function loadCollege(id) {
      const res = await getCollegeById(id);
      console.log(res.data);
      setFormData(res.data);
      setLoading(false);
    }

    loadCollege(id);
  }, [id]);

  // --- HANDLERS ---

  // 1. Generic Input Handler (Text, Number, Select)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 2. Nested Object Handler (location, socialLinks, feeRange, etc.)
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  // 3. Array Toggle Handler (for Enums like focusAreas, bestFor)
  const handleArrayToggle = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  // 4. Dynamic Array Input (Facilities, Top Recruiters)
  const [tempInput, setTempInput] = useState({
    facilities: "",
    recruiters: "",
  });

  const addArrayItem = (field, inputKey) => {
    if (!tempInput[inputKey].trim()) return;
    setFormData((prev) => {
      // Handle specific nesting for placementStats.topRecruiters
      if (field === "topRecruiters") {
        return {
          ...prev,
          placementStats: {
            ...prev.placementStats,
            topRecruiters: [
              ...(prev.placementStats.topRecruiters || []),
              tempInput[inputKey],
            ],
          },
        };
      }
      // Handle generic root level arrays like facilities
      return {
        ...prev,
        [field]: [...(prev[field] || []), tempInput[inputKey]],
      };
    });
    setTempInput((prev) => ({ ...prev, [inputKey]: "" }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      if (field === "topRecruiters") {
        const newRecruiters = [...prev.placementStats.topRecruiters];
        newRecruiters.splice(index, 1);
        return {
          ...prev,
          placementStats: {
            ...prev.placementStats,
            topRecruiters: newRecruiters,
          },
        };
      }
      const newArr = [...prev[field]];
      newArr.splice(index, 1);
      return { ...prev, [field]: newArr };
    });
  };

  // 5. Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add or Update Logic here
      await updateCollege(id, formData);

      alert("College saved successfully!");
      navigate("/college/colleges");
    } catch (err) {
      console.error(err);
      alert("Error saving college.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 font-poppins pb-20">
      <Header title={id ? "Edit College" : "Add New College"} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pt-24">
        {/* === TOP NAVIGATION BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/college/colleges")}
            className="flex items-center text-gray-400 hover:text-white transition self-start md:self-auto"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Colleges
          </button>

          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 overflow-x-auto w-full md:w-auto">
            {[
              { id: "basic", label: "Basic Info", icon: Building2 },
              { id: "ai", label: "AI Matching", icon: Cpu },
              { id: "placement", label: "Placements", icon: Briefcase },
              { id: "campus", label: "Campus Life", icon: Layout },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-green-900/20 transition w-full md:w-auto justify-center"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save College
          </button>
        </div>

        {/* === FORM CONTENT === */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl"
        >
          {/* ---------------- SECTION 1: BASIC INFO ---------------- */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Building2 size={24} /> General Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="label">College Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. Indian Institute of Technology, Bombay"
                  />
                </div>

                <div>
                  <label className="label">College Type</label>
                  <div className="relative">
                    <select
                      name="collegeType"
                      value={formData.collegeType}
                      onChange={handleChange}
                      className="input-field appearance-none cursor-pointer"
                    >
                      {COLLEGE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                      ▼
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Established Year</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="YYYY"
                  />
                </div>

                {/* Location Group */}
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3 text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <MapPin size={16} /> Location Details
                  </div>
                  <div>
                    <input
                      placeholder="City"
                      value={formData.location.city}
                      onChange={(e) =>
                        handleNestedChange("location", "city", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      placeholder="State"
                      value={formData.location.state}
                      onChange={(e) =>
                        handleNestedChange("location", "state", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      placeholder="Country"
                      value={formData.location.country}
                      onChange={(e) =>
                        handleNestedChange(
                          "location",
                          "country",
                          e.target.value
                        )
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Accreditation</label>
                  <input
                    name="accreditation"
                    value={formData.accreditation}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. NAAC A++"
                  />
                </div>

                <div>
                  <label className="label">Official Website</label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Brief overview of the institute..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- SECTION 2: AI MATCHING CORE ---------------- */}
          {activeTab === "ai" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Competency Sliders */}
              <div className="bg-gray-800/30 p-6 rounded-2xl border border-blue-500/20">
                <h3 className="text-xl font-semibold text-blue-400 mb-6 flex items-center gap-2">
                  <Cpu size={24} /> Competency Profile (0-100)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {COMPETENCIES.map((comp) => (
                    <div key={comp.key}>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-300 font-medium">
                          {comp.label}
                        </label>
                        <span className="text-sm font-bold text-blue-400">
                          {formData.competencyProfile[comp.key]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.competencyProfile[comp.key]}
                        onChange={(e) =>
                          handleNestedChange(
                            "competencyProfile",
                            comp.key,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Focus Areas (Multi-select Pills) */}
              <div>
                <label className="label mb-3 block">Focus Areas</label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((area) => (
                    <button
                      type="button"
                      key={area}
                      onClick={() => handleArrayToggle("focusAreas", area)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                        formData.focusAreas.includes(area)
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teaching Style & Best For */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="label">Teaching Style</label>
                  <select
                    name="teachingStyle"
                    value={formData.teachingStyle}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {TEACHING_STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label mb-2 block">Ideally Best For</label>
                  <div className="flex flex-wrap gap-2">
                    {STUDENT_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleArrayToggle("bestFor", type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          formData.bestFor.includes(type)
                            ? "bg-green-600/20 border-green-500 text-green-300"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- SECTION 3: PLACEMENTS & FEES ---------------- */}
          {activeTab === "placement" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <Briefcase size={24} /> Career & Financials
              </h3>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label">Avg Package (LPA)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8.5"
                    value={formData.placementStats.averagePackage}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "averagePackage",
                        e.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Highest Package (LPA)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={formData.placementStats.highestPackage}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "highestPackage",
                        e.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Placement Rate (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 92"
                    value={formData.placementStats.placementRate}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "placementRate",
                        e.target.value
                      )
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Dynamic Top Recruiters */}
              <div>
                <label className="label">Top Recruiters</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add company name (e.g. Google)"
                    value={tempInput.recruiters}
                    onChange={(e) =>
                      setTempInput((prev) => ({
                        ...prev,
                        recruiters: e.target.value,
                      }))
                    }
                    className="input-field"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(),
                      addArrayItem("topRecruiters", "recruiters"))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("topRecruiters", "recruiters")}
                    className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.placementStats.topRecruiters?.map((rec, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-gray-700"
                    >
                      {rec}{" "}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("topRecruiters", i)}
                        className="hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 my-6"></div>

              {/* Fees */}
              <h4 className="text-lg font-medium text-yellow-400 mb-4">
                Annual Fee Structure (₹)
              </h4>
              <div className="grid grid-cols-2 gap-6 max-w-lg">
                <div>
                  <label className="label">Minimum Fee</label>
                  <input
                    type="number"
                    value={formData.feeRange?.min}
                    onChange={(e) =>
                      handleNestedChange("feeRange", "min", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Maximum Fee</label>
                  <input
                    type="number"
                    value={formData.feeRange?.max}
                    onChange={(e) =>
                      handleNestedChange("feeRange", "max", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- SECTION 4: CAMPUS & RANKINGS ---------------- */}
          {activeTab === "campus" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Layout size={24} /> Infrastructure & Rankings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Campus Setting</label>
                  <select
                    name="campusType"
                    value={formData.campusType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {CAMPUS_TYPES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col justify-end gap-3 pb-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700 transition">
                    <input
                      type="checkbox"
                      name="hostelAvailable"
                      checked={formData.hostelAvailable}
                      onChange={handleChange}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">
                      Hostel Facilities Available
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700 transition">
                    <input
                      type="checkbox"
                      name="internationalExposure"
                      checked={formData.internationalExposure}
                      onChange={handleChange}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-gray-300">
                      International Student Exchange
                    </span>
                  </label>
                </div>
              </div>

              {/* Facilities List */}
              <div>
                <label className="label">Campus Facilities</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. Olympic Size Pool, AI Lab"
                    value={tempInput.facilities}
                    onChange={(e) =>
                      setTempInput((prev) => ({
                        ...prev,
                        facilities: e.target.value,
                      }))
                    }
                    className="input-field"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(),
                      addArrayItem("facilities", "facilities"))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("facilities", "facilities")}
                    className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.facilities?.map((fac, i) => (
                    <span
                      key={i}
                      className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-blue-500/30"
                    >
                      <CheckCircle2 size={14} /> {fac}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("facilities", i)}
                        className="hover:text-red-400 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 my-6"></div>

              <h4 className="text-lg font-medium text-orange-400 mb-4">
                Rankings & Reputation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="label">NIRF Rank</label>
                  <input
                    type="number"
                    name="nirfRank"
                    value={formData.nirfRank}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Overall Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Research Score (0-100)</label>
                  <input
                    type="number"
                    max="100"
                    name="researchScore"
                    value={formData.researchScore}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ManageCollege;
