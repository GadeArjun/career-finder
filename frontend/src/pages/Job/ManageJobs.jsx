import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Briefcase,
  MapPin,
  Users,
  Zap,
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react";
import { useJobs } from "../../context/JobContext";
import { useCompanyContext } from "../../context/CompanyContext"; // To link jobs to companyId

const ManageJobs = () => {
  const {
    jobs,
    loading,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByCompany,
  } = useJobs();
  const { companies } = useCompanyContext(); // To select which company is posting

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);

  // Initial Form State matching your Mongoose Schema
  const initialFormState = {
    companyId: "",
    title: "",
    type: "Full-Time",
    experienceLevel: "Fresher",
    openings: 1,
    location: { city: "", state: "", country: "India", remoteAllowed: false },
    salary: { min: 0, max: 0, currency: "INR", isConfidential: false },
    skillsRequired: [],
    competencyWeights: {
      analytical: 50,
      technical: 60,
      creative: 30,
      communication: 50,
      leadership: 30,
      research: 20,
    },
    workStyleMatch: "Fast-Paced",
    status: "open",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleWeightChange = (skill, value) => {
    setFormData((prev) => ({
      ...prev,
      competencyWeights: {
        ...prev.competencyWeights,
        [skill]: parseInt(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingJobId) {
      await updateJob(editingJobId, formData);
    } else {
      await createJob(formData);
    }
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingJobId(null);
  };

  const handleEditRequest = (job) => {
    setFormData(job);
    setEditingJobId(job._id);
    setIsModalOpen(true);
  };

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
            <p className="text-gray-400">
              Manage active openings and AI matching parameters
            </p>
          </div>
          <button
            onClick={() => {
              setFormData(initialFormState);
              setEditingJobId(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-blue-900/30"
          >
            <Plus size={20} /> Post New Job
          </button>
        </div>

        {/* --- SEARCH & QUICK STATS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by job title..."
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Total Active
                </p>
                <p className="text-xl font-bold">
                  {jobs.filter((j) => j.status === "open").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- JOB LIST --- */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading your dashboard...
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between hover:border-blue-500/50 transition group"
              >
                <div className="flex items-center gap-5 w-full md:w-1/2">
                  <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:bg-blue-600 transition">
                    <Target className="text-blue-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.location.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {job.openings} Openings
                      </span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-blue-400 font-bold uppercase tracking-widest">
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-center hidden lg:block">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">
                      Applicants
                    </p>
                    <p className="text-lg font-bold text-white">
                      {job.applicantsCount || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        job.status === "open"
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRequest(job)}
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition text-blue-400"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="p-3 bg-gray-800 hover:bg-red-600 rounded-xl transition text-red-400 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- CREATE/EDIT JOB MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-gray-900 border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="text-blue-500" />{" "}
                  {editingJobId ? "Update Campaign" : "New Hiring Campaign"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <X />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Section 1: Core Details */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                    1. Essential Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Company Entity
                      </label>
                      <select
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleInputChange}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 mt-1 outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Job Title
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 mt-1 outline-none focus:border-blue-500"
                        placeholder="e.g. Senior Backend Engineer"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                          Job Type
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 mt-1 outline-none focus:border-blue-500"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                          Openings
                        </label>
                        <input
                          type="number"
                          name="openings"
                          value={formData.openings}
                          onChange={handleInputChange}
                          className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 mt-1 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: AI Competency Weights */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-purple-500 uppercase tracking-widest border-b border-gray-800 pb-2">
                    2. AI Matching Core (Weights)
                  </h4>
                  <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-5">
                    {Object.entries(formData.competencyWeights).map(
                      ([skill, val]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-bold uppercase text-gray-500">
                            <span>{skill} Priority</span>
                            <span className="text-purple-400">{val}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) =>
                              handleWeightChange(skill, e.target.value)
                            }
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Section 3: Salary & Location */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Min Salary (LPA)
                    </label>
                    <input
                      type="number"
                      name="salary.min"
                      value={formData.salary.min}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Max Salary (LPA)
                    </label>
                    <input
                      type="number"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Work Style Fit
                    </label>
                    <select
                      name="workStyleMatch"
                      value={formData.workStyleMatch}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 outline-none focus:border-blue-500"
                    >
                      <option value="Fast-Paced">Fast-Paced</option>
                      <option value="Structured">Structured</option>
                      <option value="Research-Oriented">
                        Research-Oriented
                      </option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/40"
                  >
                    <CheckCircle2 size={18} />{" "}
                    {editingJobId ? "Save Changes" : "Deploy Job Posting"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
