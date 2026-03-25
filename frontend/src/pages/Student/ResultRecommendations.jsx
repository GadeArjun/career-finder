import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/common/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Download,
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Briefcase,
  GraduationCap,
  Target,
  Zap,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

const ResultRecommendations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const reportRef = useRef();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/recommendation/my`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-blue-400 font-medium animate-pulse">
          Initializing Career Intelligence...
        </p>
      </div>
    );

  if (!data || !data.timeline || data.timeline.length === 0)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        No assessment data found. Start a test to see insights.
      </div>
    );

  const latest = data.timeline[0];
  const previous = data.timeline[1];
  const latestScore = latest.test.score;
  const improvement = previous
    ? (latestScore - previous.test.score).toFixed(2)
    : 0;

  const chartData = Object.entries(latest.profile.competencies).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      score: value,
    })
  );

  const courses = latest.recommendations.courses || [];
  const jobs = latest.recommendations.jobs || [];

  const handleDownloadReport = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 0;

    const COLORS = {
      dark: [10, 15, 30], // Deep Navy
      accent: [79, 70, 229], // Indigo
      neon: [34, 211, 238], // Cyan
      text: [30, 41, 59],
      lightGray: [248, 250, 252],
    };

    const drawHeader = () => {
      pdf.setFillColor(...COLORS.dark);
      pdf.rect(0, 0, pageWidth, 45, "F");

      // Decorative Neon Line
      pdf.setFillColor(...COLORS.neon);
      pdf.rect(0, 44, pageWidth, 1, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.text("CAREERGUIDE+", 14, 22);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(180, 180, 180);
      pdf.text("PERSONALIZED CAREER INTELLIGENCE & SKILL MAPPING", 14, 30);

      pdf.setFontSize(9);
      pdf.text(
        `REPORT GENERATED: ${new Date().toLocaleString().toUpperCase()}`,
        14,
        37
      );
      pdf.text(
        `UID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        160,
        22
      );
      y = 60;
    };

    const checkPageBreak = (needed) => {
      if (y + needed > 275) {
        pdf.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    drawHeader();

    // Section: Executive Summary
    pdf.setTextColor(...COLORS.dark);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Executive Performance Summary", 14, y);
    y += 10;

    autoTable(pdf, {
      startY: y,
      head: [["Metric", "Value", "Status"]],
      body: [
        [
          "Overall Readiness Score",
          `${latestScore}%`,
          latestScore > 75 ? "EXCELLENT" : "PROCEEDING",
        ],
        [
          "Top Competency",
          latest.profile.topCompetencies[0].toUpperCase(),
          "DOMINANT",
        ],
        [
          "Secondary Strength",
          latest.profile.topCompetencies[1].toUpperCase(),
          "STABLE",
        ],
        [
          "Assessment Growth",
          `${improvement}%`,
          improvement >= 0 ? "POSITIVE" : "REBALANCING",
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: COLORS.dark },
      styles: { fontSize: 10, cellPadding: 4 },
    });

    y = pdf.lastAutoTable.finalY + 20;

    // Assessment Timeline Loop
    data.timeline.forEach((entry, index) => {
      checkPageBreak(80);

      pdf.setDrawColor(...COLORS.accent);
      pdf.setLineWidth(1);
      pdf.line(14, y, 30, y);

      pdf.setFontSize(12);
      pdf.setTextColor(...COLORS.accent);
      pdf.text(
        `PHASE ${
          data.timeline.length - index
        }: ${entry.test.title.toUpperCase()}`,
        35,
        y + 1
      );
      y += 10;

      const compRows = Object.entries(entry.profile.competencies).map(
        ([k, v]) => [
          k.toUpperCase(),
          `${v}%`,
          v > 70 ? "STRENGTH" : v > 40 ? "CORE" : "DEVELOPING",
        ]
      );

      autoTable(pdf, {
        startY: y,
        head: [["Skillset Cluster", "Proficiency", "Designation"]],
        body: compRows,
        theme: "grid",
        headStyles: { fillColor: COLORS.accent },
        styles: { fontSize: 9 },
        margin: { right: 80 },
      });

      // AI Logic Box
      pdf.setFillColor(...COLORS.lightGray);
      pdf.rect(135, y, 60, pdf.lastAutoTable.finalY - y, "F");
      pdf.setTextColor(...COLORS.dark);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI LOGIC ENGINE:", 138, y + 6);
      pdf.setFont("helvetica", "normal");
      const aiNote = `Detected high convergence in ${
        entry.profile.topCompetencies[0]
      }. System suggests focusing on ${entry.recommendations.courses[0]?.data.title.substring(
        0,
        20
      )}... to maximize ROI.`;
      pdf.text(pdf.splitTextToSize(aiNote, 52), 138, y + 15);

      y = pdf.lastAutoTable.finalY + 15;
    });

    // Page Numbers & Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text(
        `CareerGuide+ Intelligence Report | Page ${i} of ${totalPages}`,
        pageWidth / 2,
        288,
        { align: "center" }
      );
    }

    pdf.save(`Career_Intelligence_Report_${Date.now()}.pdf`);
  };

  const MatchTag = ({ score }) => {
    const s = score * 100;
    const style =
      s > 80
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        : s > 65
        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
        : "bg-amber-500/20 text-amber-400 border-amber-500/30";

    return (
      <div
        className={`px-2 py-1 ${style} text-[10px] font-bold uppercase tracking-widest rounded-md border flex items-center gap-1`}
      >
        <Zap size={10} />{" "}
        {s > 80 ? "Premium Match" : s > 65 ? "Strong Fit" : "Potential"}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030712] text-slate-200 font-poppins selection:bg-blue-500/30">
      <Header title="Career Intelligence" />

      <main className="flex-1 p-6 mt-20 max-w-7xl mx-auto w-full flex flex-col gap-12">
        {/* HERO ANALYTICS CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} /> Intelligence Verified
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                  Career Readiness:{" "}
                  <span className="text-blue-500">{latestScore}%</span>
                </h2>
                <p className="text-slate-400 max-w-lg leading-relaxed">
                  Your profile demonstrates dominant expertise in{" "}
                  <span className="text-slate-100 font-semibold">
                    {latest.profile.topCompetencies.join(" & ")}
                  </span>
                  . Based on our neural mapping, you are in the top 15% of
                  candidates for similar roles.
                </p>

                <div className="flex items-center gap-6 justify-center md:justify-start">
                  {previous && (
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${
                        improvement >= 0
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {improvement >= 0 ? (
                        <TrendingUp size={20} />
                      ) : (
                        <TrendingDown size={20} />
                      )}
                      <span className="font-bold text-lg">
                        {Math.abs(improvement)}%
                      </span>
                      <span className="text-xs opacity-70">Delta</span>
                    </div>
                  )}
                  <div className="h-10 w-px bg-slate-800 hidden md:block"></div>
                  <div className="text-sm">
                    <span className="block text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                      Last Assessment
                    </span>
                    <span className="text-slate-200">
                      {new Date(latest.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative group-hover:scale-105 transition-transform duration-500">
                <svg viewBox="0 0 36 36" className="w-48 h-48 rotate-[-90deg]">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="url(#blueGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${latestScore}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">
                    {latestScore}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                    Readiness
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu size={14} className="text-blue-500" /> Competency Clusters
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#3b82f6" : "#6366f1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Target size={20} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Evolutionary Timeline
            </h3>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800">
            {data.timeline.map((item, idx) => (
              <div
                key={idx}
                className={`min-w-[320px] p-6 rounded-2xl border transition-all ${
                  idx === 0
                    ? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
                    : "border-slate-800 bg-slate-900/20 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {new Date(item.generatedAt).toDateString()}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      idx === 0 ? "text-blue-400" : "text-slate-400"
                    }`}
                  >
                    #{data.timeline.length - idx}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 mb-4 line-clamp-1">
                  {item.test.title}
                </h4>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-white">
                    {item.test.score}%
                  </span>
                  <div className="flex gap-1">
                    {item.profile.topCompetencies.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="text-[9px] bg-slate-800 px-2 py-1 rounded-md text-slate-300 font-bold uppercase tracking-tighter"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COURSES SECTION */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Recommended Pathways
              </h3>
            </div>
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-4 py-2 text-sm font-bold text-blue-400 hover:bg-blue-500/5 rounded-xl transition-all flex items-center gap-2"
            >
              {showAllCourses ? "Show Less" : `View All ${courses.length}`}{" "}
              {showAllCourses ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllCourses ? courses : courses.slice(0, 3)).map(
              (item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-blue-500/40 transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:rotate-12 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <MatchTag score={item.similarityScore} />
                  </div>
                  <h4 className="font-bold text-xl text-slate-100 mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {item.data.title}
                  </h4>
                  <p className="text-slate-500 text-xs font-medium mb-4">
                    {item.data.collegeId.name} •{" "}
                    {item.data.collegeId.location.city}
                  </p>
                  <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl mb-6">
                    <div className="text-center flex-1 border-r border-slate-700">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">
                        Duration
                      </span>
                      <span className="text-sm text-slate-200 font-bold">
                        {item.data.duration}
                      </span>
                    </div>
                    <div className="text-center flex-1">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold">
                        Fee/Yr
                      </span>
                      <span className="text-sm text-emerald-400 font-bold">
                        ₹{(item.data.feeStructure.perYear / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs italic mb-6 flex-1 line-clamp-3 leading-relaxed">
                    "{item.reasoning}"
                  </p>
                  <Link
                    to={`/course/view/${item.data._id}`}
                    className="w-full py-3 bg-slate-800 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all text-center"
                  >
                    Explore Curriculum
                  </Link>
                </div>
              )
            )}
          </div>
        </section>

        {/* JOBS SECTION */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                <Briefcase size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Market Opportunities
              </h3>
            </div>
            <button
              onClick={() => setShowAllJobs(!showAllJobs)}
              className="px-4 py-2 text-sm font-bold text-blue-400 hover:bg-blue-500/5 rounded-xl transition-all flex items-center gap-2"
            >
              {showAllJobs ? "Show Less" : "View All"}{" "}
              {showAllJobs ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllJobs ? jobs : jobs.slice(0, 3)).map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl hover:border-orange-500/40 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                    <Briefcase size={24} />
                  </div>
                  <MatchTag score={item.similarityScore} />
                </div>
                <h4 className="font-bold text-xl text-slate-100 mb-1 group-hover:text-orange-400 transition-colors">
                  {item.data.title}
                </h4>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  {item.data.companyId.name} • {item.data.location.city}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">
                      Experience
                    </span>
                    <span className="text-slate-200 font-bold">
                      {item.data.experienceLevel}
                    </span>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
                    <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">
                      Max CTC
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ₹{(item.data.salary.max / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                <Link
                  to={`/job/view/${item.data._id}`}
                  className="block w-full py-3 bg-slate-800 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all text-center"
                >
                  Analyze Role
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* DOWNLOAD SECTION */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Generate Your Skill Matrix
              </h2>
              <p className="text-blue-100/80 text-lg max-w-xl">
                Get a high-fidelity PDF report analyzing your performance across{" "}
                {data.count} assessments with AI-driven career pathing.
              </p>
            </div>
            <button
              onClick={handleDownloadReport}
              className="whitespace-nowrap px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl transition-all active:scale-95 group"
            >
              <Download className="group-hover:translate-y-1 transition-transform" />
              Export Intelligence
            </button>
          </div>
        </div>
      </main>

      <footer className="p-10 text-center text-slate-600 text-xs border-t border-slate-900 mt-20">
        &copy; 2026 CareerGuide+ Engine. All Rights Reserved. Proprietary
        Analytics Hardware.
      </footer>
    </div>
  );
};

export default ResultRecommendations;
