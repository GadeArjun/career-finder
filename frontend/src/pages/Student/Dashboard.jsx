import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  BrainCircuit,
  Target,
  ChevronRight,
  Award,
  Zap,
  Briefcase,
  Activity,
  Sparkles,
  Globe,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  TerminalSquare,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

// --- 3D TILT CARD COMPONENT (Enhanced with Spring & Glare) ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Added spring physics for smoother return to center
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-100, 100], [7, -7]);
  const rotateY = useTransform(mouseXSpring, [-100, 100], [-7, 7]);
  const glareOpacity = useTransform(mouseYSpring, [-100, 100], [0, 0.15]);
  const glareY = useTransform(mouseYSpring, [-100, 100], [-20, 120]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transform-gpu ${className}`}
    >
      {/* Glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-b from-white to-transparent"
        style={{ opacity: glareOpacity, top: glareY, mixBlendMode: "overlay" }}
      />
      {children}
    </motion.div>
  );
};

// --- CUSTOM RECHARTS TOOLTIP ---
const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
          Competency Scan
        </p>
        <p className="text-blue-400 font-medium text-sm">
          {payload[0].payload.subject}:{" "}
          <span className="font-bold text-white">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    // AbortController to prevent state updates on unmounted components
    const abortController = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            signal: abortController.signal,
          }
        );
        setData(response.data.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Critical Engine Failure:", err);
          setError("DATA_LOAD_FAILED");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError("UNAUTHORIZED_ACCESS");
    }

    return () => abortController.abort();
  }, [user]);

  const radarData = useMemo(() => {
    if (!data?.competencyData) return [];
    return Object.keys(data.competencyData).map((key) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      value: data.competencyData[key],
    }));
  }, [data]);

  // Dynamic status colors for AI Coach
  const statusStyles = {
    warning:
      "border-amber-500/30 bg-amber-500/5 text-amber-400 shadow-amber-900/10",
    action_required:
      "border-rose-500/30 bg-rose-500/5 text-rose-400 shadow-rose-900/10",
    success:
      "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-emerald-900/10",
    info: "border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-blue-900/10",
  };

  if (loading) return <DashboardSkeleton />;

  if (error || !data)
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-center items-center font-mono p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,54,54,0.05)_0,rgba(0,0,0,0)_50%)] pointer-events-none" />
        <TerminalSquare size={64} className="text-rose-500 mb-6 opacity-80" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          CRITICAL_SYSTEM_ERROR
        </h1>
        <p className="text-rose-400/80 mb-8 max-w-md text-center text-sm">
          {error === "UNAUTHORIZED_ACCESS"
            ? "Authentication token missing or expired. Please re-authenticate."
            : "Secure connection to Neural Command failed. Telemetry data could not be retrieved."}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="group relative inline-flex items-center gap-3 px-8 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(226,54,54,0.1)] hover:shadow-[0_0_30px_rgba(226,54,54,0.4)]"
        >
          <RefreshCcw size={18} className="group-hover:animate-spin-slow" />
          <span className="font-bold tracking-widest uppercase text-sm">
            Re-Initialize Session
          </span>
        </button>
      </div>
    );

  const currentAiStatus =
    statusStyles[data.aiCoach?.status] || statusStyles.info;

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-[#020617] text-slate-100 selection:bg-blue-500/30 overflow-x-hidden">
      <Header title={"Neural Command"} />

      <main className="flex-1 p-6 pt-24 max-w-7xl mx-auto w-full space-y-12 pb-20">
        {/* --- WELCOME HERO & AI NARRATIVE --- */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"
          >
            <div>
              <h2 className="text-slate-500 font-medium tracking-widest uppercase text-xs mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Identity Verified: {data.user?.role || "Candidate"}
              </h2>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {data.user?.name?.split(" ")[0] || "Operative"}
                </span>
              </h1>
            </div>
            <div className="text-right hidden md:block font-mono bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
              <p className="text-slate-400 text-sm flex items-center justify-end gap-2">
                NODE_STATUS:{" "}
                <span className="text-emerald-400 font-bold">OPTIMIZED</span>
              </p>
              <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">
                LATENCY: 24ms | SYNC_OK
              </p>
            </div>
          </motion.div>

          <TiltCard
            className={`relative overflow-hidden rounded-[2.5rem] p-10 border backdrop-blur-xl transition-colors duration-500 shadow-2xl ${currentAiStatus}`}
          >
            <div className="absolute -top-20 -right-20 p-10 opacity-[0.03] pointer-events-none transform rotate-12">
              <BrainCircuit size={450} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    AI Coach Analysis
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                  {data.aiCoach?.message ||
                    "Analyzing recent telemetry data to map your optimal trajectory."}
                </h3>

                <div className="space-y-4">
                  {data.aiCoach?.insights?.map((insight, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      key={idx}
                      className="flex items-start gap-3 text-slate-300/90"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0 shadow-[0_0_10px_currentColor]" />
                      <p className="text-sm font-medium leading-relaxed">
                        {insight}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                {data.aiCoach?.nextStep && (
                  <Link
                    to={data.aiCoach.nextStep.route}
                    className="group focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-[1.5rem]"
                  >
                    <button
                      className={`w-full py-5 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 
                      ${
                        data.aiCoach.nextStep.priority === "critical"
                          ? "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30 hover:shadow-rose-500/20"
                          : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/30 hover:shadow-blue-500/20"
                      } text-white group-hover:-translate-y-1`}
                    >
                      {data.aiCoach.nextStep.label}
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                )}

                <div className="p-6 bg-slate-900/50 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      Profile Matrix
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200 bg-white/10 px-2 py-0.5 rounded-md">
                      {data.metrics?.profileCompletion || 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${data.metrics?.profileCompletion || 0}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                      className={`h-full relative ${
                        (data.metrics?.profileCompletion || 0) < 70
                          ? "bg-gradient-to-r from-amber-600 to-amber-400"
                          : "bg-gradient-to-r from-blue-600 to-cyan-400"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </section>

        {/* --- METRIC GRID --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={<Target />}
            label="Match Confidence"
            value={`${data.metrics?.matchConfidence || 0}%`}
            color="text-blue-400"
            delay={0.1}
          />
          <MetricCard
            icon={<Award />}
            label="Market Percentile"
            value={`${data.metrics?.marketPercentile || 0}th`}
            color="text-amber-400"
            delay={0.2}
          />
          <MetricCard
            icon={<Zap />}
            label="Activity Score"
            value={Math.round(data.metrics?.activityScore || 0)}
            color="text-purple-400"
            delay={0.3}
          />
          <MetricCard
            icon={<ShieldCheck />}
            label="Total Assessments"
            value={data.metrics?.totalTestsTaken || 0}
            color="text-emerald-400"
            delay={0.4}
          />
        </section>

        {/* --- MAIN INTELLIGENCE ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Competency Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden flex flex-col"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <BrainCircuit className="text-blue-400" size={20} />
              </div>
              Competency Radar
            </h3>

            <div className="flex-1 min-h-[300px] -ml-4">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={radarData}
                  >
                    <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    />
                    <Radar
                      name={data.user?.name || "User"}
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorRadar)"
                      fillOpacity={0.5}
                    />
                    <defs>
                      <linearGradient
                        id="colorRadar"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>
                    <RechartsTooltip content={<CustomRadarTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono flex-col gap-3">
                  <Radar className="opacity-20" size={48} />
                  NO_COMPETENCY_DATA
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                Dominant Trait Analysis
              </span>
              <span className="text-blue-400 font-bold uppercase text-xs px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                {data.aiCoach?.dominantTrait || "UNKNOWN"}
              </span>
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Activity className="text-emerald-400" size={20} />
                </div>
                Activity Feed
              </h3>
              <Link
                to="/student/history"
                className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {data.recentActivity?.length > 0 ? (
                data.recentActivity.map((activity, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    key={idx}
                    className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl transition-colors ${
                          activity.type === "TEST_COMPLETED"
                            ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
                        }`}
                      >
                        {activity.type === "TEST_COMPLETED" ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <TrendingUp size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-blue-400 font-bold font-mono group-hover:scale-110 transition-transform origin-right">
                        {activity.score}
                      </p>
                      <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">
                        Result
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-12 text-slate-600">
                  <AlertCircle size={48} className="mb-4 opacity-20" />
                  <p className="uppercase text-xs tracking-widest font-bold">
                    No Data Streams Found
                  </p>
                  <p className="text-[10px] mt-2 text-slate-500 max-w-xs text-center">
                    Engage with assessments to populate your timeline.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* --- CAREER ROADMAP & MATCHES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 space-y-6 bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5"
          >
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Globe className="text-blue-400" size={20} />
              </div>
              Career Trajectory
            </h3>
            <div className="relative border-l-2 border-slate-800 ml-5 pl-8 space-y-12 mt-8">
              <RoadmapStep
                title="Skill Baseline"
                status="Verified"
                date="Initial Phase"
                current={
                  (data.metrics?.totalTestsTaken || 0) > 0 &&
                  (data.metrics?.totalTestsTaken || 0) < 3
                }
                completed={(data.metrics?.totalTestsTaken || 0) >= 3}
              />
              <RoadmapStep
                title="Market Ready"
                status="Evaluating"
                date="Processing Phase"
                current={
                  (data.metrics?.totalTestsTaken || 0) >= 3 &&
                  (data.user?.profileCompletion || 0) < 90
                }
                completed={(data.user?.profileCompletion || 0) >= 90}
              />
              <RoadmapStep
                title="Industry Specialist"
                status="Projection"
                date="Future Phase"
                current={
                  (data.user?.profileCompletion || 0) >= 90 &&
                  (data.metrics?.matchConfidence || 0) > 80
                }
                completed={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl">
                  <Briefcase className="text-cyan-400" size={20} />
                </div>
                Top Career Matches
              </h3>
              <div className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                Sector Focus:{" "}
                <span className="text-white">
                  {data.recommendations?.summary?.topSector || "General"}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              {data.recommendations?.jobs?.length > 0 ? (
                data.recommendations.jobs.map((job, idx) => (
                  <RecommendationItem key={idx} item={job} index={idx} />
                ))
              ) : (
                <div className="p-12 border border-dashed border-slate-800 bg-slate-900/20 rounded-[2.5rem] text-center flex flex-col items-center justify-center">
                  <Target size={32} className="text-slate-600 mb-4" />
                  <p className="text-slate-400 text-sm mb-6 max-w-sm">
                    Insufficient data matrix for precise career matching.
                    Complete core assessments to unlock predictions.
                  </p>
                  <Link
                    to="/student/aptitude-test"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Initialize Assessment <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER SUB-COMPONENTS ---

const MetricCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
  >
    <TiltCard className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm group hover:border-white/10 transition-all h-full">
      <div className="flex flex-col items-center text-center gap-5">
        <div
          className={`p-4 bg-white/5 rounded-2xl ${color} group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-inner`}
        >
          {icon}
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            {label}
          </p>
          <p className="text-3xl font-black tracking-tighter text-white">
            {value}
          </p>
        </div>
      </div>
    </TiltCard>
  </motion.div>
);

const RoadmapStep = ({ title, status, date, current, completed }) => (
  <div className="relative group">
    <div
      className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-[#020617] transition-all duration-500 z-10 ${
        completed
          ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          : current
          ? "bg-blue-500 ring-4 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"
          : "bg-slate-700"
      }`}
    />
    {/* Line glow for completed */}
    {completed && (
      <div className="absolute -left-[35px] top-5 w-[2px] h-[48px] bg-gradient-to-b from-emerald-500 to-transparent opacity-50 pointer-events-none" />
    )}
    <div className="transform transition-transform duration-300 group-hover:translate-x-2">
      <h4
        className={`font-bold text-lg transition-colors ${
          completed
            ? "text-emerald-400"
            : current
            ? "text-blue-400"
            : "text-slate-500"
        }`}
      >
        {title}
      </h4>
      <p className="text-[11px] mt-1 text-slate-500 font-medium uppercase tracking-wider flex gap-2">
        <span
          className={
            completed
              ? "text-emerald-500/70"
              : current
              ? "text-blue-500/70"
              : ""
          }
        >
          {status}
        </span>
        <span className="opacity-50">•</span>
        <span>{date}</span>
      </p>
    </div>
  </div>
);

const RecommendationItem = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 + index * 0.1 }}
    whileHover={{ x: 8, scale: 1.01 }}
    className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-transparent hover:border-blue-500/30 transition-all cursor-pointer shadow-lg hover:shadow-blue-900/10 gap-4 sm:gap-0"
  >
    <div className="flex items-center gap-5">
      <div className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors shrink-0">
        <Briefcase size={24} />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
          {item.itemId?.title || item.itemId?.name || "Specialist Role"}
        </h4>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            {item.itemId?.company || "Strategic Partner"}
          </span>
          {item.itemId?.level && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold uppercase tracking-widest">
                {item.itemId.level}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
    <div className="sm:text-right flex sm:block items-center justify-between sm:justify-end border-t border-white/5 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest sm:mb-1">
        Match Index
      </div>
      <div className="text-2xl font-black text-blue-400 font-mono group-hover:scale-110 transition-transform origin-right">
        {item.matchScore ? Math.round(item.matchScore * 100) : "85"}%
      </div>
    </div>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#020617] p-6 pt-24 max-w-7xl mx-auto space-y-12">
    <div className="flex justify-between items-end mb-8">
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-800/50 rounded-md animate-pulse" />
        <div className="h-10 w-80 bg-slate-800/50 rounded-xl animate-pulse" />
      </div>
      <div className="h-12 w-48 bg-slate-800/50 rounded-xl animate-pulse hidden md:block" />
    </div>

    <div className="h-[400px] bg-slate-800/30 border border-slate-800 rounded-[3rem] animate-pulse" />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-40 bg-slate-800/30 border border-slate-800 rounded-[2rem] animate-pulse"
        />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 h-[500px] bg-slate-800/30 border border-slate-800 rounded-[2.5rem] animate-pulse" />
      <div className="lg:col-span-7 h-[500px] bg-slate-800/30 border border-slate-800 rounded-[2.5rem] animate-pulse" />
    </div>
  </div>
);

export default Dashboard;
