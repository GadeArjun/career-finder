import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  BrainCircuit,
  MapPin,
  IndianRupee,
  GraduationCap,
  Briefcase,
  Sparkles,
  ListChecks,
  Loader2,
} from "lucide-react";
import { useJobs } from "../../context/JobContext";

const JobEditor = () => {
  const { companyId, jobId } = useParams();
  const navigate = useNavigate();
  const { createJob, updateJob, getJobById, jobDetails, loading } = useJobs();

  const [activeTab, setActiveTab] = useState("basic"); // basic | eligibility | ai | details
  const [isSaving, setIsSaving] = useState(false);

  // Comprehensive state covering the entire Mongoose Schema
  const [formData, setFormData] = useState({
    companyId: companyId,
    title: "",
    type: "Full-Time",
    experienceLevel: "Fresher",
    openings: 1,
    location: { city: "", state: "", country: "India", remoteAllowed: false },
    salary: { min: 0, max: 0, currency: "INR", isConfidential: false },
    educationRequired: [{ degree: "", field: "" }],
    minCGPA: 0,
    graduationYearRange: { from: 2024, to: 2026 },
    skillsRequired: [],
    skillsNiceToHave: [],
    toolsAndTech: [],
    competencyWeights: {
      analytical: 50,
      technical: 60,
      creative: 30,
      communication: 50,
      leadership: 30,
      research: 20,
    },
    personalityFit: [],
    workStyleMatch: "Fast-Paced",
    preferredDomains: [],
    responsibilities: [],
    perks: [],
    description: "",
    status: "open",
    priorityScore: 50,
  });

  // Load data if in Edit Mode
  useEffect(() => {
    if (jobId) {
      getJobById(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId && jobDetails) {
      setFormData(jobDetails);
    }
  }, [jobDetails, jobId]);

  // --- HELPER HANDLERS ---
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleArrayInput = (field, value) => {
    const arr = value.split(",").map((item) => item.trim());
    //   .filter((item) => item !== "");
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  console.log({ jobId, companyId });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (jobId) {
        await updateJob(jobId, formData);
      } else {
        await createJob(formData);
      }
      //   navigate(`/company/jobs/${companyId}`);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && jobId)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading Job Data...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-poppins">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">
              {jobId ? "Edit Posting" : "New Hiring Campaign"}
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
              ID: {companyId}
            </p>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-900">
          {[
            { id: "basic", label: "Basic Info", icon: <Briefcase size={16} /> },
            {
              id: "eligibility",
              label: "Eligibility",
              icon: <GraduationCap size={16} />,
            },
            {
              id: "ai",
              label: "AI & Skills",
              icon: <BrainCircuit size={16} />,
            },
            {
              id: "details",
              label: "Description",
              icon: <ListChecks size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "bg-gray-900 text-gray-500 hover:bg-gray-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-900/50 border border-gray-800 p-6 md:p-10 rounded-3xl"
        >
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Job Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none focus:border-blue-500"
                  placeholder="Software Engineer II"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none"
                >
                  {["Full-Time", "Part-Time", "Internship", "Contract"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value,
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none"
                >
                  {["Fresher", "Junior", "Mid-Level", "Senior", "Lead"].map(
                    (e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400">
                  <MapPin size={16} /> Location Details
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) =>
                      handleNestedChange("location", "city", e.target.value)
                    }
                    className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-sm outline-none"
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-400 px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.location.remoteAllowed}
                      onChange={(e) =>
                        handleNestedChange(
                          "location",
                          "remoteAllowed",
                          e.target.checked
                        )
                      }
                    />{" "}
                    Remote OK?
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-green-400">
                  <IndianRupee size={16} /> Annual Salary (LPA)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={formData.salary.min}
                    onChange={(e) =>
                      handleNestedChange("salary", "min", e.target.value)
                    }
                    className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-sm outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={formData.salary.max}
                    onChange={(e) =>
                      handleNestedChange("salary", "max", e.target.value)
                    }
                    className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY */}
          {activeTab === "eligibility" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Min CGPA Required
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCGPA}
                    onChange={(e) =>
                      setFormData({ ...formData, minCGPA: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Graduation Range (Years)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={formData.graduationYearRange.from}
                      onChange={(e) =>
                        handleNestedChange(
                          "graduationYearRange",
                          "from",
                          e.target.value
                        )
                      }
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="number"
                      value={formData.graduationYearRange.to}
                      onChange={(e) =>
                        handleNestedChange(
                          "graduationYearRange",
                          "to",
                          e.target.value
                        )
                      }
                      className="flex-1 bg-gray-950 border border-gray-800 rounded-xl p-4 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Preferred Certifications (Comma separated)
                </label>
                <textarea
                  onChange={(e) =>
                    handleArrayInput("certificationsPreferred", e.target.value)
                  }
                  value={formData.certificationsPreferred?.join(", ")}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 h-24 outline-none"
                  placeholder="AWS Solution Architect, Google Cloud Professional..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: AI CORE & SKILLS */}
          {activeTab === "ai" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    <Sparkles size={16} /> Competency Weights
                  </h4>
                  <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-4">
                    {Object.entries(formData.competencyWeights).map(
                      ([skill, val]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                            <span>{skill}</span> <span>{val}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) =>
                              handleNestedChange(
                                "competencyWeights",
                                skill,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-purple-500 rounded-lg"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                      Mandatory Skills (Comma separated)
                    </label>
                    <input
                      value={formData.skillsRequired?.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("skillsRequired", e.target.value)
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none"
                      placeholder="React, Node.js, TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                      Tools & Tech Stack
                    </label>
                    <input
                      value={formData.toolsAndTech?.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("toolsAndTech", e.target.value)
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none"
                      placeholder="Docker, AWS S3, Redis"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                      Work Style Match
                    </label>
                    <select
                      value={formData.workStyleMatch}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workStyleMatch: e.target.value,
                        })
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none"
                    >
                      {[
                        "Fast-Paced",
                        "Structured",
                        "Creative",
                        "Research-Oriented",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Full Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-6 h-64 outline-none focus:border-blue-500"
                  placeholder="Describe the mission, the team, and why someone should join..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Key Responsibilities (one per line)
                  </label>
                  <textarea
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsibilities: e.target.value.split("\n"),
                      })
                    }
                    value={formData.responsibilities?.join("\n")}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 h-32 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Perks & Benefits (one per line)
                  </label>
                  <textarea
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perks: e.target.value.split("\n"),
                      })
                    }
                    value={formData.perks?.join("\n")}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 h-32 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM FOOTER */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-800">
            <div className="flex gap-4">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="bg-gray-800 text-xs font-bold px-4 py-2 rounded-lg outline-none"
              >
                <option value="open">LIVE / OPEN</option>
                <option value="draft">DRAFT</option>
                <option value="closed">CLOSED</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-10 py-4 rounded-2xl font-bold transition shadow-xl shadow-blue-900/30"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {jobId ? "Update Posting" : "Launch Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobEditor;
