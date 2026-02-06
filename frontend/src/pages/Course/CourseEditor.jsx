import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Plus,
  GraduationCap,
  BookOpen,
  IndianRupee,
  BrainCircuit,
  TrendingUp,
  Settings,
  Trash2,
  Loader2,
  CheckCircle2,
  Sparkles,
  Map,
} from "lucide-react";
import { useCourses } from "../../context/CourseContext";

const CourseEditor = () => {
  const { collegeId, courseId } = useParams();
  const navigate = useNavigate();
  const { createCourse, updateCourse, getCourseById, courseDetails, loading } =
    useCourses();

  const [activeTab, setActiveTab] = useState("academic"); // academic | eligibility | ai_outcomes | placement
  const [isSaving, setIsSaving] = useState(false);

  // Full Schema Implementation
  const [formData, setFormData] = useState({
    collegeId: collegeId,
    title: "",
    description: "",
    duration: "4 Years",
    degreeType: "UG",
    branch: "",
    specialization: "",
    intake: 0,
    feeStructure: {
      perYear: 0,
      totalEstimated: 0,
      scholarshipAvailable: false,
    },
    eligibility: {
      minQualification: "12th",
      minPercentage: 0,
      entranceExams: [],
      requiredSubjects: [],
    },
    admissionProcess: "",
    skillOutcomeProfile: {
      analytical: 60,
      technical: 70,
      creative: 40,
      communication: 50,
      research: 40,
      leadership: 30,
    },
    bestFor: [],
    learningStyle: "Practical",
    coreSkills: [],
    toolsAndTech: [],
    careerDomains: [],
    typicalJobRoles: [],
    higherStudyPaths: [],
    placementStats: {
      placementRate: 0,
      averagePackage: 0,
      highestPackage: 0,
      topRecruiters: [],
    },
    internshipOpportunities: true,
    industryProjects: true,
    mode: "Offline",
    approvedBy: "AICTE",
    status: "active",
    popularityScore: 50,
  });

  useEffect(() => {
    if (courseId) getCourseById(courseId);
  }, [courseId]);

  useEffect(() => {
    if (courseId && courseDetails) setFormData(courseDetails);
  }, [courseDetails, courseId]);

  // --- HANDLERS ---
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleArrayInput = (field, value) => {
    const arr = value.split(",").map((item) => item.trim());
    //   .filter((i) => i !== "");
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (courseId) {
        console.log({ courseId });
          await updateCourse(courseId, formData);
          alert("Course Updated Successfully")
      } else {
          await createCourse(formData);
          alert("Course Created Successfully")
      }
    //   navigate(-1);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && courseId)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading Course Data...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-bold">
              {courseId ? "Edit Curriculum" : "New Course Launch"}
            </h1>
            <p className="text-xs text-blue-500 font-bold tracking-widest mt-1 uppercase">
              College Ref: {collegeId}
            </p>
          </div>
        </div>

        {/* TABBED NAVIGATION */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-900 scrollbar-hide">
          {[
            {
              id: "academic",
              label: "Academic Info",
              icon: <GraduationCap size={16} />,
            },
            {
              id: "eligibility",
              label: "Eligibility & Fees",
              icon: <IndianRupee size={16} />,
            },
            {
              id: "ai_outcomes",
              label: "AI & Skill Outcomes",
              icon: <BrainCircuit size={16} />,
            },
            {
              id: "placement",
              label: "Career & Placement",
              icon: <TrendingUp size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "bg-gray-900 text-gray-500 hover:bg-gray-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-900/30 border border-gray-800 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-sm"
        >
          {/* TAB 1: ACADEMIC INFO */}
          {activeTab === "academic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Course Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none focus:border-blue-500 transition"
                  placeholder="B.Tech in Artificial Intelligence"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 h-32 outline-none focus:border-blue-500"
                  placeholder="A brief overview of the program..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Degree Type
                </label>
                <select
                  value={formData.degreeType}
                  onChange={(e) =>
                    setFormData({ ...formData, degreeType: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                >
                  {["Diploma", "UG", "PG", "PhD", "Certification"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Duration
                </label>
                <input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                  placeholder="e.g. 4 Years"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Branch
                  </label>
                  <input
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({ ...formData, branch: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                    placeholder="CSE"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Intake (Seats)
                  </label>
                  <input
                    type="number"
                    value={formData.intake}
                    onChange={(e) =>
                      setFormData({ ...formData, intake: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Learning Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({ ...formData, mode: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                  >
                    {["Offline", "Online", "Hybrid"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Approved By
                  </label>
                  <input
                    value={formData.approvedBy}
                    onChange={(e) =>
                      setFormData({ ...formData, approvedBy: e.target.value })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 outline-none"
                    placeholder="AICTE, UGC, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY & FEES */}
          {activeTab === "eligibility" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fees Section */}
                <div className="p-6 bg-gray-950 rounded-[2rem] border border-gray-800">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 mb-6 uppercase tracking-tighter">
                    <IndianRupee size={16} /> Fee Structure
                  </h4>
                  <div className="space-y-4">
                    <input
                      type="number"
                      placeholder="Fee Per Year"
                      value={formData.feeStructure.perYear}
                      onChange={(e) =>
                        handleNestedChange(
                          "feeStructure",
                          "perYear",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Total Estimated"
                      value={formData.feeStructure.totalEstimated}
                      onChange={(e) =>
                        handleNestedChange(
                          "feeStructure",
                          "totalEstimated",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer p-2">
                      <input
                        type="checkbox"
                        checked={formData.feeStructure.scholarshipAvailable}
                        onChange={(e) =>
                          handleNestedChange(
                            "feeStructure",
                            "scholarshipAvailable",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 rounded border-gray-800 bg-gray-900"
                      />{" "}
                      Scholarship Available?
                    </label>
                  </div>
                </div>

                {/* Eligibility Section */}
                <div className="p-6 bg-gray-950 rounded-[2rem] border border-gray-800">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-6 uppercase tracking-tighter">
                    <Settings size={16} /> Criteria
                  </h4>
                  <div className="space-y-4">
                    <select
                      value={formData.eligibility.minQualification}
                      onChange={(e) =>
                        handleNestedChange(
                          "eligibility",
                          "minQualification",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                    >
                      {["10th", "12th", "Diploma", "UG"].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Min Percentage"
                      value={formData.eligibility.minPercentage}
                      onChange={(e) =>
                        handleNestedChange(
                          "eligibility",
                          "minPercentage",
                          e.target.value
                        )
                      }
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                    />
                    <input
                      placeholder="Entrance Exams (e.g. JEE, GATE)"
                      value={formData.eligibility.entranceExams.join(", ")}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(",")
                          .map((i) => i.trim());
                        handleNestedChange("eligibility", "entranceExams", arr);
                      }}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Admission Process
                </label>
                <textarea
                  value={formData.admissionProcess}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      admissionProcess: e.target.value,
                    })
                  }
                  className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 mt-2 h-24 outline-none"
                  placeholder="Counseling, Interview, or Direct admission steps..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: AI SKILL OUTCOMES */}
          {activeTab === "ai_outcomes" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-gray-950 p-8 rounded-[2rem] border border-gray-800">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-8 uppercase tracking-widest">
                    <Sparkles size={16} /> Skill Outcome Profile
                  </h4>
                  <div className="space-y-6">
                    {Object.entries(formData.skillOutcomeProfile).map(
                      ([skill, val]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
                            <span>{skill}</span>{" "}
                            <span className="text-purple-400">{val}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) =>
                              handleNestedChange(
                                "skillOutcomeProfile",
                                skill,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full h-1.5 bg-gray-800 appearance-none cursor-pointer accent-purple-500 rounded-full"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                      Core Skills Taught (Comma Separated)
                    </label>
                    <textarea
                      value={formData.coreSkills.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("coreSkills", e.target.value)
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 h-32 outline-none focus:border-purple-500"
                      placeholder="e.g. Data Structures, Neural Networks, Thermodynanics"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                      Tools & Tech Stack
                    </label>
                    <input
                      value={formData.toolsAndTech.join(", ")}
                      onChange={(e) =>
                        handleArrayInput("toolsAndTech", e.target.value)
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 outline-none focus:border-purple-500"
                      placeholder="Python, TensorFlow, AutoCAD..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAREER & PLACEMENT */}
          {activeTab === "placement" && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-4">
                    Placement Rate (%)
                  </p>
                  <input
                    type="number"
                    value={formData.placementStats.placementRate}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "placementRate",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                  />
                </div>
                <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-4">
                    Avg Package (LPA)
                  </p>
                  <input
                    type="number"
                    value={formData.placementStats.averagePackage}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "averagePackage",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                  />
                </div>
                <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-4">
                    Highest Package (LPA)
                  </p>
                  <input
                    type="number"
                    value={formData.placementStats.highestPackage}
                    onChange={(e) =>
                      handleNestedChange(
                        "placementStats",
                        "highestPackage",
                        e.target.value
                      )
                    }
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
                    <Map size={16} /> Career Domains
                  </h4>
                  <textarea
                    value={formData.careerDomains.join(", ")}
                    onChange={(e) =>
                      handleArrayInput("careerDomains", e.target.value)
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 h-24 outline-none"
                    placeholder="Software, Finance, Data Science..."
                  />
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
                    <TrendingUp size={16} /> Typical Job Roles
                  </h4>
                  <textarea
                    value={formData.typicalJobRoles.join(", ")}
                    onChange={(e) =>
                      handleArrayInput("typicalJobRoles", e.target.value)
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 h-24 outline-none"
                    placeholder="AI Engineer, Analyst, Consultant..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-800">
            <div className="flex gap-4">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="bg-gray-800 text-xs font-bold px-4 py-2 rounded-xl outline-none"
              >
                <option value="active">PUBLISHED</option>
                <option value="inactive">DRAFT</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/30"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {courseId ? "Update Curriculum" : "Launch Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
