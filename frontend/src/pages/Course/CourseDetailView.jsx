import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  BookOpen,
  Layers,
  Award,
  Cpu,
  Users,
  ChevronRight,
  Info,
  Play,
  ExternalLink,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CourseDetailView = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) return;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/course/${courseId}/view`
        );
        setCourse(res.data.course);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (!course)
    return (
      <div className="h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );

  const {
    college,
    match,
    insights,
    feeStructure,
    skillOutcomeProfile,
    youtubeVideos,
  } = course;


  const handleDownloadBrochure = async () => {
    const doc = new jsPDF();
    const {
      title,
      description,
      duration,
      college,
      feeStructure,
      skillOutcomeProfile,
      youtubeVideos,
      coreSkills,
      toolsAndTech,
      typicalJobRoles,
      insights,
      placementStats,
      admissionProcess,
    } = course;

    // --- Theme Constants ---
    const PRIMARY_COLOR = [38, 45, 71]; // Deep Navy
    const ACCENT_COLOR = [103, 58, 183]; // Royal Purple
    const TEXT_WHITE = [255, 255, 255];
    const TEXT_DARK = [44, 62, 80];
    const SECONDARY_BG = [245, 247, 250];

    // --- Page 1: Premium Header & Career ROI ---
    // Header Background
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, 210, 60, "F");

    // Title & College
    doc.setTextColor(...TEXT_WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(title.toUpperCase(), 14, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${college.name} | ${college.location.city}, ${college.location.state}`,
      14,
      35
    );
    doc.setFontSize(10);
    doc.text(
      `Accreditation: ${college.accreditation} • NIRF Rank: ${college.nirfRank}`,
      14,
      42
    );

    // ROI Quick Info Bar
    autoTable(doc, {
      startY: 48,
      margin: { left: 14, right: 14 },
      head: [["Duration", "Mode", "Difficulty", "ROI Level", "Market Demand"]],
      body: [
        [
          duration,
          course.mode,
          insights.difficulty,
          insights.roiLevel,
          insights.demandLevel,
        ],
      ],
      theme: "plain",
      styles: {
        fillColor: ACCENT_COLOR,
        textColor: TEXT_WHITE,
        fontSize: 9,
        halign: "center",
      },
      headStyles: { fontStyle: "bold" },
    });

    // Introduction
    doc.setTextColor(...TEXT_DARK);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Course Overview", 14, doc.lastAutoTable.finalY + 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(description, 182);
    doc.text(splitDesc, 14, doc.lastAutoTable.finalY + 22);

    // Financials & Career Stats (Most Important)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Financials & Placement Intelligence",
      14,
      doc.lastAutoTable.finalY + 45
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 50,
      head: [["Financial Breakdown", "Placement Statistics"]],
      body: [
        [
          `Total Fee: INR ${feeStructure.totalEstimated}\nPer Year: INR ${
            feeStructure.perYear
          }\nScholarship: ${
            feeStructure.scholarshipAvailable ? "Available" : "Not Available"
          }`,
          `Avg Package: ${placementStats.averagePackage} LPA\nHighest Package: ${placementStats.highestPackage} LPA\nPlacement Rate: ${placementStats.placementRate}%`,
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: PRIMARY_COLOR },
      styles: { cellPadding: 5, fontSize: 10, lineHeight: 1.5 },
    });

    // Top Recruiters
    const recruiters = college.placementStats.topRecruiters
      .join("  •  ")
      .toUpperCase();
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 5,
      head: [["Top Hiring Partners"]],
      body: [[recruiters || "Global Tech Leaders & Innovative Startups"]],
      theme: "grid",
      headStyles: { fillColor: ACCENT_COLOR, halign: "center" },
      styles: {
        halign: "center",
        fontSize: 8,
        fontStyle: "bold",
        textColor: ACCENT_COLOR,
      },
    });

    // --- Page 2: Skills & Mastering Tech ---
    doc.addPage();

    // Section: Skill Outcome Profile
    doc.setFontSize(16);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text("Skill Outcome Profile", 14, 20);

    autoTable(doc, {
      startY: 25,
      head: [
        ["Technical", "Analytical", "Creative", "Communication", "Research"],
      ],
      body: [
        [
          `${skillOutcomeProfile.technical}%`,
          `${skillOutcomeProfile.analytical}%`,
          `${skillOutcomeProfile.creative}%`,
          `${skillOutcomeProfile.communication}%`,
          `${skillOutcomeProfile.research}%`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [76, 175, 80] }, // Success Green
      styles: { halign: "center", fontSize: 12, fontStyle: "bold" },
    });

    // Section: Tools & Tech (Grid Layout)
    doc.setFontSize(16);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(
      "Technologies & Tools You Will Master",
      14,
      doc.lastAutoTable.finalY + 15
    );

    const techRows = [];
    for (let i = 0; i < toolsAndTech.length; i += 4) {
      techRows.push(toolsAndTech.slice(i, i + 4));
    }

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: techRows,
      theme: "plain",
      styles: {
        fillColor: SECONDARY_BG,
        textColor: PRIMARY_COLOR,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 4,
      },
    });

    // Typical Job Roles
    doc.setFontSize(16);
    doc.text("Career Pathways & Job Roles", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: [typicalJobRoles],
      theme: "grid",
      styles: {
        fillColor: [232, 234, 246],
        textColor: ACCENT_COLOR,
        fontStyle: "bold",
      },
    });

    // --- Page 3: Admissions & Learning Resources ---
    doc.addPage();

    // Admission Process
    doc.setFontSize(16);
    doc.setTextColor(...ACCENT_COLOR);
    doc.text("Admission & Enrollment Process", 14, 20);

    doc.setTextColor(...TEXT_DARK);
    doc.setFontSize(11);
    const splitProcess = doc.splitTextToSize(admissionProcess, 180);
    doc.text(splitProcess, 14, 30);

    // YouTube Resources (The "Action" Section)
    doc.setFontSize(16);
    doc.setTextColor(200, 0, 0); // YouTube Red
    doc.text(
      "Recommended Learning Resources",
      14,
      doc.lastAutoTable.finalY + 30
    );

    const videoData = youtubeVideos.map((v) => [
      v.title,
      v.channelName,
      "CLICK TO WATCH",
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 35,
      head: [["Curated Video Content", "Channel", "Action"]],
      body: videoData,
      headStyles: { fillColor: [200, 0, 0] },
      columnStyles: {
        0: { cellWidth: 90 },
        2: { textColor: [33, 150, 243], fontStyle: "bold" },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const videoLink = youtubeVideos[data.row.index]?.link;
          doc.link(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            {
              url: videoLink,
            }
          );
        }
      },
    });

    // --- Unified Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      // Footer Line
      doc.setDrawColor(200);
      doc.line(14, 282, 196, 282);

      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Confidential Brochure © 2024 ${college.name} Admissions`,
        14,
        288
      );
      doc.text(`Page ${i} of ${pageCount}`, 196, 288, { align: "right" });
    }

    doc.save(`${title.replace(/\s+/g, "_")}_Official_Brochure.pdf`);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    colorClass = "text-indigo-400",
  }) => (
    <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-md hover:border-indigo-500/30 transition-colors group">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 bg-slate-800 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {label}
          </p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 pb-20">
      {/* --- FLOATING HEADER --- */}
      <nav className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="font-bold text-white tracking-tight hidden sm:block">
              Course Intelligence
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            {["Overview", "Curriculum", "Placements", "Videos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "text-indigo-400"
                    : "hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors">
            Shortlist
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} /> AI Verified Course
              </span>
              <span className="text-slate-500 text-xs tracking-widest uppercase">
                {course.mode} Learning
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6">
              {course.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                in {course.branch}
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-8">
              A comprehensive {course.duration} program at {course.collegeName},
              focusing on real-world {course.branch} applications and industry
              readiness.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(course.rating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-white font-bold">{course.rating}</span>
                <span className="text-slate-500 text-xs">
                  ({course.views} Views)
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={18} className="text-indigo-500" />
                <span className="font-medium">{course.locationText}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-[32px] shadow-2xl relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
                    Total Estimated Investment
                  </p>
                  <h2 className="text-4xl font-black text-white">
                    {course.totalFeeText}
                  </h2>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-2xl">
                  <TrendingUp className="text-emerald-400" size={24} />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Per Year Fee</span>
                  <span className="text-white font-bold">{course.feeText}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Scholarship Support</span>
                  <span className="text-emerald-400 font-bold">Available</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Admission Readiness</span>
                  <span className="text-indigo-400 font-bold">Open</span>
                </div>
              </div>

              <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                Initialize Application <ChevronRight size={20} />
              </button>
            </div>
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[40px]" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* --- LEFT CONTENT --- */}
        <div className="lg:col-span-8 space-y-16">
          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Program Length"
              value={course.duration}
            />
            <StatCard
              icon={Layers}
              label="Difficulty"
              value={insights.difficulty}
            />
            <StatCard
              icon={TrendingUp}
              label="National Rank"
              value={`#${college.nirfRank}`}
            />
            <StatCard
              icon={ShieldCheck}
              label="Council"
              value={course.approvedBy}
            />
          </div>

          {/* DYNAMIC SKILL RADAR SECTION */}
          <section className="bg-slate-900/20 border border-slate-800/60 rounded-[32px] p-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Skill Outcome Profile
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Projected proficiency levels after completion.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Strongest
                    </p>
                    <p className="text-xs text-indigo-400 font-bold capitalize">
                      {course.strongestSkills?.[0] || "Technical"}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">
                      Learning Curve
                    </p>
                    <p className="text-xs text-amber-400 font-bold">
                      {insights.difficulty}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {Object.entries(skillOutcomeProfile).map(([skill, val]) => (
                  <div key={skill} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500" />{" "}
                        {skill}
                      </span>
                      <span className="text-xs font-black text-white">
                        {val}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${val}%` }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-0" />
          </section>

          {/* CAREER VIDEOS SECTION */}
          <section>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Career Perspectives
                </h3>
                <p className="text-slate-500 text-sm">
                  Insights from industry experts and alumni.
                </p>
              </div>
              <button
                onClick={() => {
                  window.open(
                    `https://www.youtube.com/results?search_query=${course.title}`,
                    "_blank"
                  );
                }}
                className="text-indigo-400 text-sm font-bold flex items-center gap-2 hover:text-indigo-300 transition-colors"
              >
                View All <ExternalLink size={14} />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {youtubeVideos?.map((video) => (
                <motion.a
                  key={video._id}
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5 }}
                  className="min-w-[300px] bg-slate-900/40 border border-slate-800 p-4 rounded-2xl group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={video.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={video.title}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                        <Play fill="currentColor" size={20} />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 mb-2 group-hover:text-indigo-400 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[8px] font-bold">
                      YT
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      {video.channelName}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

          {/* PLACEMENT DEEP-DIVE */}
          <section className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/10 rounded-[32px] p-10">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Placement Intelligence
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {college.placementStats.placementRate}% Placement Rate
                      </p>
                      <p className="text-slate-500 text-sm">
                        Historical data from the last 3 graduating batches.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                      <IndianRupee size={24} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        ₹{college.placementStats.highestPackage}L Highest
                        Package
                      </p>
                      <p className="text-slate-500 text-sm">
                        Top recruiter:{" "}
                        {college.placementStats.topRecruiters?.[0] || "Google"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                  Target Recruiters
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {college.placementStats.topRecruiters.map((company) => (
                    <div
                      key={company}
                      className="bg-slate-800/50 p-4 rounded-xl text-center border border-slate-700/50"
                    >
                      <p className="text-sm font-black text-slate-300 uppercase italic">
                        {company}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* ADMISSION GUIDELINES */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[32px] backdrop-blur-md">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Info size={18} className="text-indigo-400" /> Admission Protocol
            </h4>
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">
                  Minimum Qualification
                </p>
                <p className="text-sm font-bold text-white">
                  {course.eligibility.minQualification} with PCM
                </p>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">
                  Selection Basis
                </p>
                <p className="text-sm font-bold text-white">
                  Entrance + Merit Score
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Industry Integrated Projects",
                  "Mandatory Internships",
                  "Global Certification Prep",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-xs text-slate-400 font-medium"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CAMPUS ECOSYSTEM */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-[32px] backdrop-blur-md">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Globe size={18} className="text-indigo-400" /> Campus Ecosystem
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {college.facilities.map((facility) => (
                <div
                  key={facility}
                  className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl"
                >
                  <span className="text-xs font-bold text-slate-400">
                    {facility}
                  </span>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                </div>
              ))}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  International Exposure
                </span>
                <span className="text-xs font-bold text-emerald-400">Yes</span>
              </div>
            </div>
          </div>

          {/* QUICK LINKS / CONTACT */}
          <div className="bg-indigo-600 p-8 rounded-[32px] text-white">
            <h4 className="text-xl font-black mb-2">Need Guidance?</h4>
            <p className="text-indigo-100 text-xs mb-6 leading-relaxed opacity-80">
              Talk to our AI Counselors or connect with the National Institute
              of Advanced Technology directly.
            </p>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
                Contact Admissions
              </button>
              <button
                onClick={handleDownloadBrochure}
                className="w-full py-3 bg-indigo-700 text-white rounded-xl text-sm font-bold hover:bg-indigo-800 transition-colors border border-indigo-500"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
