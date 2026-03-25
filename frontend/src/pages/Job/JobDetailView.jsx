import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Wallet,
  Clock,
  CheckCircle2,
  Target,
  BrainCircuit,
  Rocket,
  ExternalLink,
  Users,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Share2,
  Info,
  ChevronRight,
  TrendingUp,
  Layers,
  Globe,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobDetailView = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/job/${jobId}/view`
        );
        // Mapping 'data' from your JSON structure
        setJob(res.data.data);
      } catch (err) {
        setError("Failed to load job details. Please try again later.");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) return <JobShimmer />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  if (!job) return null;

  const {
    header,
    essentials,
    requirements,
    jobDeepDive,
    aiInsights,
    liveMetrics,
  } = job;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans pb-20">
      {/* 1. TOP NAV / BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
        <span>Careers</span> <ChevronRight size={12} />
        <span>{header.company.industry}</span> <ChevronRight size={12} />
        <span className="text-indigo-400">{header.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN (Main Content) --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* HEADER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <img
                src={
                  header.company.logo ||
                  `https://ui-avatars.com/api/?name=${header.company.name}&background=6366f1&color=fff`
                }
                alt="logo"
                className="w-20 h-20 rounded-2xl object-cover border border-slate-700 shadow-2xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-white">
                    {header.title}
                  </h1>
                  {header.status === "open" && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/20 flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />{" "}
                      Live
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-indigo-400">
                    <Building2 size={16} /> {header.company.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} /> {essentials.location.full}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={16} /> {essentials.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} />{" "}
                    {new Date(header.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/50">
              <QuickStat
                icon={<Wallet className="text-emerald-400" />}
                label="Salary (LPA)"
                value={essentials.salary.formatted}
              />
              <QuickStat
                icon={<Users className="text-blue-400" />}
                label="Openings"
                value={essentials.openings}
              />
              <QuickStat
                icon={<Award className="text-purple-400" />}
                label="Exp. Level"
                value={essentials.experience}
              />
              <QuickStat
                icon={<Globe className="text-amber-400" />}
                label="Mode"
                value={header.company.workMode}
              />
            </div>
          </motion.div>

          {/* AI MATCH SECTION */}
          <section className="bg-gradient-to-br from-indigo-950/30 to-slate-900/30 border border-indigo-500/20 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="text-indigo-400" /> AI Insights &
                  Matching
                </h3>
                <p className="text-sm text-slate-400">
                  Personalized data based on your CareerGuide+ profile
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase">
                  Difficulty
                </div>
                <div className="text-lg font-bold text-indigo-300">
                  {aiInsights.complexity}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">
                    Work Style Preference
                  </div>
                  <div className="text-white font-semibold flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" />{" "}
                    {aiInsights.workStyle}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-sm text-slate-400 mb-1">
                      Priority Score
                    </div>
                    <div className="text-white font-bold">
                      {aiInsights.priorityScore}/100
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-sm text-slate-400 mb-1">
                      Match Status
                    </div>
                    <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                      Analysis Pending
                    </div>
                  </div>
                </div>
              </div>

              {/* Competency Spider Web Visual (Mock) */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Skill Weightage
                </span>
                {Object.entries(aiInsights.competencyWeights).map(
                  ([skill, weight]) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="capitalize text-slate-300">
                          {skill}
                        </span>
                        <span className="text-indigo-400">{weight}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${weight}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* DESCRIPTION & RESPONSIBILITIES */}
          <div className="space-y-8 px-2">
            <section>
              <h3 className="text-lg font-bold text-white mb-4">The Mission</h3>
              <p className="text-slate-400 leading-relaxed text-base">
                {jobDeepDive.description}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-indigo-400" />{" "}
                  Responsibilities
                </h3>
                <ul className="space-y-4">
                  {jobDeepDive.responsibilities
                    .filter((r) => r.length > 2)
                    .map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-400 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Rocket size={18} className="text-purple-400" /> Perks &
                  Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobDeepDive.perks
                    .filter((p) => p.length > 2)
                    .map((perk, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
                      >
                        {perk}
                      </span>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Sidebar) --- */}
        <div className="lg:col-span-4 space-y-6">
          {/* APPLY CARD */}
          <div className="bg-white rounded-3xl p-1 shadow-2xl shadow-indigo-500/10 sticky top-6">
            <div className="bg-[#0f172a] rounded-[calc(1.5rem-1px)] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Applications</span>
                <span className="text-white font-bold">
                  {liveMetrics.applicants} Active
                </span>
              </div>

              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group">
                Apply for this Position{" "}
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Share2 size={16} /> Share
                </button>
                <button className="py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  Save
                </button>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-4">
                <MetricItem
                  icon={<TrendingUp size={16} />}
                  label="Competition"
                  value={liveMetrics.competitionLevel}
                  color="text-amber-400"
                />
                <MetricItem
                  icon={<Info size={16} />}
                  label="Views"
                  value={liveMetrics.views}
                  color="text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* REQUIREMENTS SIDEBAR */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h4 className="text-white font-bold flex items-center gap-2">
              <GraduationCap size={18} className="text-indigo-400" />{" "}
              Eligibility
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Min CGPA</span>
                <span className="text-white font-semibold">
                  {requirements.minCGPA}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Batches</span>
                <span className="text-white font-semibold">
                  {requirements.batchRange.from} - {requirements.batchRange.to}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Mandatory Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {requirements.mandatorySkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {requirements.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs capitalize"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* COMPANY EXTRA INFO */}
          <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Target size={20} />
              </div>
              <h4 className="text-white font-bold">Company Vibe</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400 line-clamp-3">
                A {header.company.industry} firm focused on high growth and
                innovation.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-white">
                    {header.company.rating}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Rating
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center flex-1">
                  <div className="text-lg font-bold text-white">Hybrid</div>
                  <div className="text-[10px] text-slate-500 uppercase">
                    Mode
                  </div>
                </div>
              </div>
              <a
                href={header.company.website}
                target="_blank"
                className="block text-center mt-4 text-xs text-indigo-400 font-bold hover:underline"
              >
                View Company Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const QuickStat = ({ icon, label, value }) => (
  <div className="flex flex-col items-center md:items-start">
    <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
      {icon} {label}
    </div>
    <div className="text-sm md:text-base font-bold text-white">{value}</div>
  </div>
);

const MetricItem = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-500">
      {icon} <span>{label}</span>
    </div>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const JobShimmer = () => (
  <div className="min-h-screen bg-[#030712] p-12 space-y-8 animate-pulse">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-48 bg-slate-900/50 rounded-3xl" />
        <div className="h-64 bg-slate-900/50 rounded-3xl" />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="h-96 bg-slate-900/50 rounded-3xl" />
      </div>
    </div>
  </div>
);

export default JobDetailView;
