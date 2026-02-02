import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  MapPin,
  Briefcase,
  Cpu,
  Layout,
  CheckCircle2,
  X,
  Plus,
  ArrowLeft,
  Loader2,
  Globe,
  TrendingUp,
  Heart,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import { useCompanyContext } from "../../context/CompanyContext";

// --- ENUMS FROM SCHEMA ---
const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Media",
  "Retail",
  "Consulting",
  "Government",
  "Startup",
  "Research",
  "E-commerce",
  "Telecommunications",
];
const COMPANY_TYPES = ["Startup", "SME", "MNC", "Enterprise", "Government"];
const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const WORK_STYLES = [
  "Fast-Paced",
  "Structured",
  "Creative",
  "Research-Oriented",
  "Balanced",
];
const HIRING_DOMAINS = [
  "Software Development",
  "AI/ML",
  "Data Science",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "HR",
  "Cybersecurity",
  "Cloud",
  "Product Management",
  "Research",
];
const BEST_FOR = [
  "High Achievers",
  "Problem Solvers",
  "Creative Thinkers",
  "Team Players",
  "Leaders",
  "Independent Workers",
  "Fresh Graduates",
];
const WORK_MODES = ["Onsite", "Hybrid", "Remote"];

const COMPETENCIES = [
  { key: "analytical", label: "Analytical" },
  { key: "verbal", label: "Verbal" },
  { key: "creative", label: "Creative" },
  { key: "scientific", label: "Scientific" },
  { key: "social", label: "Social" },
  { key: "technical", label: "Technical" },
];

const ManageCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCompany, updateCompany, getCompanyById } = useCompanyContext();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [tempPerk, setTempPerk] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    industry: "Technology",
    website: "",
    logo: "",
    location: { city: "", state: "", country: "India" },
    description: "",
    companyType: "Startup",
    size: "11-50",
    foundedYear: new Date().getFullYear(),
    socialLinks: { linkedin: "", twitter: "", instagram: "" },
    competencyProfile: {
      analytical: 50,
      verbal: 50,
      creative: 50,
      scientific: 50,
      social: 50,
      technical: 50,
    },
    hiringDomains: [],
    workStyle: "Balanced",
    bestFor: [],
    hiringStats: {
      fresherHiring: false,
      internshipAvailable: false,
      avgSalary: "",
      maxSalary: "",
      hiringRate: 50,
    },
    workMode: "Hybrid",
    internationalPresence: false,
    perks: [],
    rating: 3.5,
    innovationScore: 70,
    growthScore: 70,
    workCultureScore: 70,
    status: "pending",
  });

  useEffect(() => {
    async function getCompany() {
      setLoading(true);
      const res = await getCompanyById(id);
      setFormData(res.data.company);
      console.log(res.data.company);
      setLoading(false);
    }
    if (id) {
      getCompany();
    }
  }, [id]);
  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((i) => i !== value)
        : [...prev[field], value],
    }));
  };

  const addPerk = () => {
    if (!tempPerk.trim()) return;
    setFormData((prev) => ({ ...prev, perks: [...prev.perks, tempPerk] }));
    setTempPerk("");
  };

  const removePerk = (index) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Logic to call addCompany or updateCompany context functions
    await updateCompany(id, formData);
    console.log("Final Company Data:", formData);
    setTimeout(() => {
      setLoading(false);
      navigate("/company/companys");
    }, 1500);
  };

  if (loading)
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100 font-poppins pb-20">
      <Header title={id ? "Edit Company Profile" : "Register Company"} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pt-24">
        {/* === TOP BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>

          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 overflow-x-auto w-full md:w-auto">
            {[
              { id: "basic", label: "Identity", icon: Building2 },
              { id: "matching", label: "AI Matching", icon: Cpu },
              { id: "hiring", label: "Hiring & Culture", icon: Zap },
              { id: "metrics", label: "Scores", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition w-full md:w-auto justify-center"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}{" "}
            Save Profile
          </button>
        </div>

        {/* === FORM PANEL === */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          {/* TAB 1: IDENTITY & BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="label">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. TechNova Solutions"
                  />
                </div>

                <div>
                  <label className="label">Industry Focus</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Company Type</label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {COMPANY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Company Size (Employees)</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-950/50 p-6 rounded-2xl border border-gray-800">
                  <div className="md:col-span-3 flex items-center gap-2 text-blue-400 font-semibold mb-2">
                    <MapPin size={18} /> Headquarters Location
                  </div>
                  <input
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) =>
                      handleNestedChange("location", "city", e.target.value)
                    }
                    className="input-field"
                  />
                  <input
                    placeholder="State"
                    value={formData.location.state}
                    onChange={(e) =>
                      handleNestedChange("location", "state", e.target.value)
                    }
                    className="input-field"
                  />
                  <input
                    placeholder="Country"
                    value={formData.location.country}
                    onChange={(e) =>
                      handleNestedChange("location", "country", e.target.value)
                    }
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">About Company</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Describe company's mission and impact..."
                  ></textarea>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Website (URL)</label>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="label">LinkedIn</label>
                    <input
                      value={formData.socialLinks?.linkedin}
                      onChange={(e) =>
                        handleNestedChange(
                          "socialLinks",
                          "linkedin",
                          e.target.value
                        )
                      }
                      className="input-field"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="label">Twitter / X</label>
                    <input
                      value={formData.socialLinks?.twitter}
                      onChange={(e) =>
                        handleNestedChange(
                          "socialLinks",
                          "twitter",
                          e.target.value
                        )
                      }
                      className="input-field"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI MATCHING CORE */}
          {activeTab === "matching" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <section>
                <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                  <Cpu size={24} /> Success Competency Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-gray-950/40 p-8 rounded-3xl border border-gray-800">
                  {COMPETENCIES.map((c) => (
                    <div key={c.key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          {c.label}
                        </span>
                        <span className="text-blue-400 font-bold">
                          {formData.competencyProfile[c.key]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.competencyProfile[c.key]}
                        onChange={(e) =>
                          handleNestedChange(
                            "competencyProfile",
                            c.key,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section>
                  <label className="label mb-4 text-purple-400">
                    Primary Hiring Domains
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HIRING_DOMAINS.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() =>
                          handleArrayToggle("hiringDomains", domain)
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          formData.hiringDomains.includes(domain)
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="label mb-4 text-green-400">
                    Ideal Employee Profile (Best For)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BEST_FOR.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleArrayToggle("bestFor", item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          formData.bestFor.includes(item)
                            ? "bg-green-600 border-green-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="max-w-md">
                <label className="label text-orange-400">
                  Work Style Environment
                </label>
                <select
                  name="workStyle"
                  value={formData.workStyle}
                  onChange={handleChange}
                  className="input-field mt-2"
                >
                  {WORK_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </section>
            </div>
          )}

          {/* TAB 3: HIRING & CULTURE */}
          {activeTab === "hiring" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">
                    Hiring Policies
                  </h3>
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between p-4 bg-gray-950/50 rounded-2xl border border-gray-800 cursor-pointer">
                      <span className="text-sm font-medium">
                        Hires Freshers?
                      </span>
                      <input
                        type="checkbox"
                        className="w-6 h-6 accent-blue-500"
                        checked={formData.hiringStats.fresherHiring}
                        onChange={(e) =>
                          handleNestedChange(
                            "hiringStats",
                            "fresherHiring",
                            e.target.checked
                          )
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-950/50 rounded-2xl border border-gray-800 cursor-pointer">
                      <span className="text-sm font-medium">
                        Offers Internships?
                      </span>
                      <input
                        type="checkbox"
                        className="w-6 h-6 accent-blue-500"
                        checked={formData.hiringStats.internshipAvailable}
                        onChange={(e) =>
                          handleNestedChange(
                            "hiringStats",
                            "internshipAvailable",
                            e.target.checked
                          )
                        }
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-950/50 rounded-2xl border border-gray-800 cursor-pointer">
                      <span className="text-sm font-medium">
                        International Presence?
                      </span>
                      <input
                        type="checkbox"
                        name="internationalPresence"
                        className="w-6 h-6 accent-blue-500"
                        checked={formData.internationalPresence}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-200 border-b border-gray-800 pb-2">
                    Financials & Mode
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Avg Salary (LPA)</label>
                      <input
                        type="number"
                        value={formData.hiringStats.avgSalary}
                        onChange={(e) =>
                          handleNestedChange(
                            "hiringStats",
                            "avgSalary",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="6.5"
                      />
                    </div>
                    <div>
                      <label className="label">Max Salary (LPA)</label>
                      <input
                        type="number"
                        value={formData.hiringStats.maxSalary}
                        onChange={(e) =>
                          handleNestedChange(
                            "hiringStats",
                            "maxSalary",
                            e.target.value
                          )
                        }
                        className="input-field"
                        placeholder="32"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Work Mode</label>
                    <select
                      name="workMode"
                      value={formData.workMode}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {WORK_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>
              </div>

              <section>
                <label className="label">Company Perks & Benefits</label>
                <div className="flex gap-2 mb-4 max-w-xl">
                  <input
                    type="text"
                    value={tempPerk}
                    onChange={(e) => setTempPerk(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Health Insurance, ESOPs"
                    onKeyDown={(e) => e.key === "Enter" && addPerk()}
                  />
                  <button
                    type="button"
                    onClick={addPerk}
                    className="bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition"
                  >
                    <Plus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.perks.map((perk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-blue-900/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/20 text-sm font-medium"
                    >
                      <CheckCircle2 size={14} /> {perk}
                      <button
                        onClick={() => removePerk(i)}
                        className="hover:text-red-400 ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: REPUTATION & METRICS */}
          {activeTab === "metrics" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section className="space-y-8">
                  <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                    <Star /> Reputation Scores
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-400">
                          Public Rating (0-5)
                        </label>
                        <span className="font-bold">{formData.rating} ★</span>
                      </div>
                      <input
                        type="range"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-800 rounded-lg accent-yellow-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-400">
                          Innovation Score (0-100)
                        </label>
                        <span className="font-bold text-blue-400">
                          {formData.innovationScore}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="innovationScore"
                        min="0"
                        max="100"
                        value={formData.innovationScore}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-800 rounded-lg accent-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-400">
                          Work Culture Score (0-100)
                        </label>
                        <span className="font-bold text-pink-400">
                          {formData.workCultureScore}
                        </span>
                      </div>
                      <input
                        type="range"
                        name="workCultureScore"
                        min="0"
                        max="100"
                        value={formData.workCultureScore}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-800 rounded-lg accent-pink-500"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <h3 className="text-xl font-bold text-green-500 flex items-center gap-2">
                    <TrendingUp /> Growth & Impact
                  </h3>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-400">
                        Growth Score (0-100)
                      </label>
                      <span className="font-bold text-green-400">
                        {formData.growthScore}
                      </span>
                    </div>
                    <input
                      type="range"
                      name="growthScore"
                      min="0"
                      max="100"
                      value={formData.growthScore}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-800 rounded-lg accent-green-500"
                    />
                  </div>

                  <div className="bg-gray-950/60 p-6 rounded-3xl border border-gray-800 space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter mb-2">
                      <Users size={16} /> Platform Metrics (View Only)
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          Total Hires
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 text-center">
                        <div className="text-2xl font-bold">0</div>
                        <div className="text-[10px] text-gray-500 uppercase">
                          Profile Views
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCompany;
