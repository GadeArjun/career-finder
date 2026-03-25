import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
} from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";

// --- 3D TILT CARD COMPONENT ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/student/dashboard`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Critical Engine Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchDashboardData();
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
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    action_required: "border-rose-500/30 bg-rose-500/5 text-rose-400",
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
    info: "border-blue-500/30 bg-blue-500/5 text-blue-400",
  };

  if (loading) return <DashboardSkeleton />;
  if (!data)
    return (
      <div className="text-white p-10 font-mono">
        CRITICAL_SYSTEM_ERROR: DATA_LOAD_FAILED
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-[#020617] text-slate-100 selection:bg-blue-500/30 overflow-x-hidden">
      <Header title={"Neural Command"} />

      <main className="flex-1 p-6 pt-24 max-w-7xl mx-auto w-full space-y-12 pb-20">
        {/* --- WELCOME HERO & AI NARRATIVE --- */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8"
          >
            <div>
              <h2 className="text-slate-500 font-medium tracking-widest uppercase text-xs mb-2">
                Identity Verified: {data.user.role}
              </h2>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  {data.user.name.split(" ")[0]}
                </span>
              </h1>
            </div>
            <div className="text-right hidden md:block font-mono">
              <p className="text-slate-400 text-sm">
                NODE_STATUS: <span className="text-emerald-400">OPTIMIZED</span>
              </p>
              <p className="text-slate-500 text-xs uppercase">
                LATENCY: 24ms | SYNC_OK
              </p>
            </div>
          </motion.div>

          <TiltCard
            className={`relative overflow-hidden rounded-[2.5rem] p-10 border backdrop-blur-xl transition-colors duration-500 ${
              statusStyles[data.aiCoach.status] || statusStyles.info
            }`}
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <BrainCircuit size={400} />
            </div>

            <div className="relative z-10 grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <Sparkles size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    AI Coach Analysis
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                  {data.aiCoach.message}
                </h3>

                <div className="space-y-4">
                  {data.aiCoach.insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-slate-300/80"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      <p className="text-sm font-medium">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-6">
                <Link to={data.aiCoach.nextStep.route} className="group">
                  <button
                    className={`w-full py-5 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 
                    ${
                      data.aiCoach.nextStep.priority === "critical"
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20"
                        : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                    } text-white`}
                  >
                    {data.aiCoach.nextStep.label} <ChevronRight />
                  </button>
                </Link>
                <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                      Profile Strength
                    </span>
                    <span className="text-xs font-mono">
                      {data.metrics.profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.metrics.profileCompletion}%` }}
                      className={`h-full ${
                        data.metrics.profileCompletion < 70
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
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
            value={`${data.metrics.matchConfidence}%`}
            color="text-blue-400"
          />
          <MetricCard
            icon={<Award />}
            label="Market Percentile"
            value={`${data.metrics.marketPercentile}th`}
            color="text-yellow-400"
          />
          <MetricCard
            icon={<Zap />}
            label="Activity Score"
            value={Math.round(data.metrics.activityScore)}
            color="text-purple-400"
          />
          <MetricCard
            icon={<ShieldCheck />}
            label="Total Assessments"
            value={data.metrics.totalTestsTaken}
            color="text-emerald-400"
          />
        </section>

        {/* --- MAIN INTELLIGENCE ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Competency Radar */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden">
            <h3 className="text-xl font-bold mb-10 flex items-center gap-3">
              <BrainCircuit className="text-blue-400" /> Competency Radar
            </h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                  />
                  <Radar
                    name={data.user.name}
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                Dominant Trait:{" "}
              </span>
              <span className="text-blue-400 font-bold uppercase text-xs">
                {data.aiCoach.dominantTrait}
              </span>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Activity className="text-emerald-400" /> Activity Feed
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          activity.type === "TEST_COMPLETED"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {activity.type === "TEST_COMPLETED" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <TrendingUp size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-200">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(activity.date).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-bold font-mono">
                        {activity.score}
                      </p>
                      <p className="text-[10px] text-slate-600 uppercase font-bold">
                        Result
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                  <AlertCircle size={40} className="mb-4 opacity-20" />
                  <p className="uppercase text-xs tracking-widest font-bold">
                    No Data Streams Found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- CAREER ROADMAP & MATCHES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold px-2 flex items-center gap-3">
              <Globe className="text-blue-400" /> Career Trajectory
            </h3>
            <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-10">
              <RoadmapStep
                title="Skill Baseline"
                status="Verified"
                date="Initial"
                current={
                  data.metrics.totalTestsTaken > 0 &&
                  data.metrics.totalTestsTaken < 3
                }
                completed={data.metrics.totalTestsTaken >= 3}
              />
              <RoadmapStep
                title="Market Ready"
                status="Evaluating"
                date="Processing"
                current={
                  data.metrics.totalTestsTaken >= 3 &&
                  data.user.profileCompletion < 90
                }
                completed={data.user.profileCompletion >= 90}
              />
              <RoadmapStep
                title="Industry Specialist"
                status="Projection"
                date="Future"
                current={
                  data.user.profileCompletion >= 90 &&
                  data.metrics.matchConfidence > 80
                }
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Briefcase className="text-cyan-400" /> Top Career Matches
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Sector: {data.recommendations.summary.topSector}
              </span>
            </div>
            <div className="grid gap-4">
              {data.recommendations.jobs.length > 0 ? (
                data.recommendations.jobs.map((job, idx) => (
                  <RecommendationItem key={idx} item={job} />
                ))
              ) : (
                <div className="p-12 border border-dashed border-slate-800 rounded-[2rem] text-center">
                  <p className="text-slate-500 text-sm mb-4">
                    Insufficient data for career matching.
                  </p>
                  <Link
                    to="/student/aptitude-test"
                    className="text-blue-400 text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Initialize Assessment →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER SUB-COMPONENTS ---

const MetricCard = ({ icon, label, value, color }) => (
  <TiltCard className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm group hover:border-white/10 transition-all">
    <div className="flex flex-col items-center text-center gap-4">
      <div
        className={`p-4 bg-white/5 rounded-2xl ${color} group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}
      >
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          {label}
        </p>
        <p className="text-3xl font-black mt-2 tracking-tighter text-white">
          {value}
        </p>
      </div>
    </div>
  </TiltCard>
);

const RoadmapStep = ({ title, status, date, current, completed }) => (
  <div className="relative">
    <div
      className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-[#020617] transition-all duration-500 ${
        completed
          ? "bg-emerald-500"
          : current
          ? "bg-blue-500 ring-4 ring-blue-500/20"
          : "bg-slate-700"
      }`}
    />
    <div>
      <h4
        className={`font-bold transition-colors ${
          completed
            ? "text-emerald-400"
            : current
            ? "text-blue-400"
            : "text-slate-500"
        }`}
      >
        {title}
      </h4>
      <p className="text-xs text-slate-500 font-medium">
        {status} • {date}
      </p>
    </div>
  </div>
);

const RecommendationItem = ({ item }) => (
  <motion.div
    whileHover={{ x: 10 }}
    className="group flex items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-3xl hover:bg-blue-500/5 hover:border-blue-500/30 transition-all cursor-pointer"
  >
    <div className="flex items-center gap-6">
      <div className="p-4 bg-white/5 rounded-2xl text-slate-400 group-hover:text-blue-400 transition-colors">
        <Briefcase size={24} />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-100">
          {item.itemId?.title || item.itemId?.name || "Specialist Role"}
        </h4>
        <div className="flex gap-3 mt-1">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            {item.itemId?.company || "Strategic Partner"}
          </span>
          {item.itemId?.level && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold uppercase">
              {item.itemId.level}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xl font-black text-blue-400 font-mono">
        {item.matchScore ? Math.round(item.matchScore * 100) : "85"}%
      </div>
      <div className="text-[10px] uppercase font-bold text-slate-600 tracking-tighter">
        Compatibility
      </div>
    </div>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-[#020617] p-10 animate-pulse space-y-12">
    <div className="flex justify-between">
      <div className="h-12 w-1/4 bg-slate-900 rounded-xl" />
      <div className="h-12 w-1/6 bg-slate-900 rounded-xl" />
    </div>
    <div className="h-80 bg-slate-900 rounded-[3rem]" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-900 rounded-[2rem]" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-8">
      <div className="h-96 bg-slate-900 rounded-[2.5rem]" />
      <div className="h-96 bg-slate-900 rounded-[2.5rem]" />
    </div>
  </div>
);

export default Dashboard;
