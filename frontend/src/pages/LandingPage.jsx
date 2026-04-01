import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Database,
  Code,
  Zap,
  Target,
  BarChart3,
  Network,
  Sparkles,
  Bot,
  User,
  Award,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "../context/UserContext";
import Footer from "../components/common/Footer";
import heroImage from "../assets/hero-image.png";

function LandingPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  // --- AI Simulation State for the Extra Feature ---
  const [simStep, setSimStep] = useState(0);
  const demoPrompts = [
    "Analyzing your 6D competency vector...",
    "Querying courses & prerequisites...",
    "Applying Cosine Similarity Algorithm...",
    "Perfect Career Match Found: Product Manager!",
  ];
  // --- Role Selection State ---
  const [activeRole, setActiveRole] = useState("student");

  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % demoPrompts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleExploreHub = () => {
    navigate(`/login`);
  };

  return (
    <div className="font-poppins bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500/30 overflow-x-hidden">
      {/* ===== Header ===== */}
      <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-cyan-500/10 shadow-[0_4px_30px_rgba(6,182,212,0.05)] z-50 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:opacity-80 transition-opacity duration-300"
            >
              CareerFinder<span className="text-cyan-400">.AI</span>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <nav className="hidden md:flex gap-6 items-center">
            {user ? (
              <Link
                to={`${
                  user.role === "student"
                    ? "/student/dashboard"
                    : user.role === "college"
                    ? "/college/dashboard"
                    : "/company/dashboard"
                }`}
                className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all duration-300 shadow-lg shadow-cyan-500/25 transform hover:-translate-y-0.5 active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 transform hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto p-6 md:px-12 pt-36 pb-20 gap-12">
        {/* Background Glow Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -z-10"></div>

        <div className="flex-1 flex flex-col gap-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-sm font-medium w-fit mb-2">
            <Zap size={14} className="text-cyan-400" />
            <span>Powered by Smart Ranking System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight animate-fade-in">
            Discover Careers Built on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">
              Who You Are.
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in delay-100">
            Bridging the guidance gap. Stop relying on guesswork and generic
            online tests. Our highly personalized AI evaluates your unique
            competency profile to match you with your perfect career path.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 animate-fade-in delay-200">
            {user ? (
              <Link
                to={`${
                  user.role === "student"
                    ? "/student/dashboard"
                    : user.role === "college"
                    ? "/college/dashboard"
                    : "/company/dashboard"
                }`}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 font-semibold text-white"
              >
                Launch Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 rounded-xl font-bold hover:from-cyan-300 hover:to-blue-400 transition-all hover:text-black shadow-lg shadow-cyan-500/30 flex items-center gap-2"
                >
                  Take Aptitude Test <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3.5 border border-slate-700 bg-slate-900/50 backdrop-blur-sm rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 animate-slide-in-right relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-3xl blur-2xl"></div>
          <img
            src={heroImage}
            alt="Career Finder Dashboard"
            className="w-full max-w-xl rounded-3xl shadow-2xl shadow-black/50 border border-slate-800 relative z-10 object-cover"
          />
        </div>
      </section>

      {/* ===== The Problem & Solution (Context from PDF) ===== */}
      <section className="border-y border-slate-800 bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto p-8 md:px-12 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase mb-3">
              The Guidance Gap
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Uninformed Decisions Waste Potential.
            </h3>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              Students today face critical career decisions without proper
              guidance. Relying on peer opinions, outdated advice, or
              overwhelmed counselors treats every student the same, ignoring
              their unique competency profile.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed border-l-4 border-indigo-500 pl-4 italic">
              Wrong career choices result in job dissatisfaction, frequent
              switches, and wasted potential.
            </p>
          </div>
          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">
              Our Innovative Approach
            </h2>
            <h3 className="text-2xl font-bold text-white mb-4">
              Skill-Based, Not Keyword-Based
            </h3>
            <p className="text-slate-400 mb-6">
              Unlike traditional keyword job searches, Career Finder uses
              advanced vector alignment to connect you with careers that truly
              align with your intrinsic abilities.
            </p>
            <ul className="space-y-4">
              {[
                "Personalized recommendations based on who you are",
                "Advanced Cosine Similarity Algorithms",
                "Market-aware Smart Ranking",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck
                    size={20}
                    className="text-cyan-400 flex-shrink-0"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== EXTRA FEATURE: Live AI Experience Preview ===== */}
      <section className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900/50">
        <div className="max-w-7xl mx-auto p-8 md:px-12 py-20 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-wide">
              <Sparkles size={12} /> Live Simulation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Experience the True Power of Career AI.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Don't just take our word for it. Watch our AI analyze complex
              multi-dimensional scores to generate hyper-curated action items in
              real-time.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Engine Active & Processing Requests
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-75"></div>
            <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
              {/* Fake Terminal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-xs text-slate-600 font-mono tracking-widest uppercase">
                  AI_ENGINE_PREVIEW
                </div>
              </div>

              {/* Chat Simulation Content */}
              <div className="space-y-6 flex-1">
                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600/20 border border-blue-500/30 px-4 py-3 rounded-2xl rounded-tr-none text-sm text-blue-100 max-w-[85%] shadow-lg">
                    "Evaluate my top careers with high analytical skill."
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <User size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* AI Processing Text */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={simStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-3 text-cyan-400 font-mono text-xs italic ml-11"
                  >
                    <Sparkles size={14} className="animate-spin" />
                    {demoPrompts[simStep]}
                  </motion.div>
                </AnimatePresence>

                {/* AI Structured Response */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/40">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-xl text-sm text-slate-300 leading-relaxed">
                      I have analyzed your **6D Competency Profile**. Your
                      dominant traits match optimally with human-scale strategic
                      leadership roles.
                    </div>

                    {/* Dynamic Widgets */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 border border-emerald-500/20 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Award size={14} className="text-emerald-400" />
                          <span className="text-xs font-bold text-slate-200 uppercase">
                            Top Attribute
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          Analytical Edge (92%)
                        </p>
                      </div>

                      <div className="bg-slate-900/50 border border-violet-500/20 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase size={14} className="text-violet-400" />
                          <span className="text-xs font-bold text-slate-200 uppercase">
                            Best Career
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          Data Strategist
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-blue-500/20 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-blue-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            Recommended Path
                          </p>
                          <p className="text-xs text-slate-400">
                            Advanced Business Analytics
                          </p>
                        </div>
                      </div>
                      <div className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase font-bold">
                        Preview Course
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Core Architecture / 6D Model Section ===== */}
      <section className="max-w-7xl mx-auto p-6 md:px-12 mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            The Engine Behind The Intelligence
          </h2>
          <p className="text-slate-400 text-lg">
            Our proprietary algorithms transform your aptitude into an
            actionable roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "6D Competency Model",
              desc: "Evaluates six core dimensions: Analytical, Verbal, Creative, Scientific, Social, and Technical abilities to capture your full spectrum.",
              icon: BrainCircuit,
              color: "text-purple-400",
              bg: "bg-purple-400/10",
              border: "border-purple-500/20",
            },
            {
              title: "Cosine Similarity Matching",
              desc: "Transforms your 6D aptitude scores into mathematical vectors, perfectly matching your profile against real-world career requirements.",
              icon: Network,
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
              border: "border-cyan-500/20",
            },
            {
              title: "Smart Ranking System",
              desc: "Multifactor ranking combining Popularity, Rating Metrics, Recency, and Eligibility Filters for the optimal, achievable recommendations.",
              icon: Activity,
              color: "text-blue-400",
              bg: "bg-blue-400/10",
              border: "border-blue-500/20",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`bg-slate-900/60 p-8 rounded-2xl border ${feature.border} shadow-lg hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl ${feature.bg} ${feature.color} mb-6`}
              >
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Role-Based Features Section ===== */}
      <section className="max-w-7xl mx-auto p-6 md:px-12 mt-24 mb-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-sm font-medium w-fit mb-4">
            <span>Tailored Ecosystem</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            One Platform. Three Powerful Experiences.
          </h2>
          <p className="text-slate-400 text-lg">
            Select your profile below to explore the custom features designed
            specifically for your goals.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            {
              id: "student",
              label: "I am a Student",
              color: "from-cyan-500 to-blue-600",
            },
            {
              id: "college",
              label: "I am a College Admin",
              color: "from-indigo-500 to-purple-600",
            },
            {
              id: "company",
              label: "I am an HR / Employer",
              color: "from-blue-600 to-indigo-600",
            },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform active:scale-95 border ${
                activeRole === role.id
                  ? `bg-gradient-to-r ${role.color} text-white border-transparent shadow-lg shadow-cyan-500/20 scale-105`
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Feature Display Card */}
        <div className="relative">
          {/* Dynamic Background Glow behind the card */}
          <div
            className={`absolute inset-0 bg-gradient-to-r opacity-10 blur-3xl rounded-3xl -z-10 transition-all duration-500 ${
              activeRole === "student"
                ? "from-cyan-500 to-blue-600"
                : activeRole === "college"
                ? "from-indigo-500 to-purple-600"
                : "from-blue-600 to-indigo-600"
            }`}
          ></div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500">
            {/* 1. Student View */}
            {activeRole === "student" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Shape Your Career.
                  </h4>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Take complete control of your academic and professional
                    future using our deep analytical engine.
                  </p>
                  <button
                    onClick={handleExploreHub}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium text-white hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    Explore Student Hub <ArrowRight size={16} />
                  </button>
                </div>
                <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Target,
                      title: "Take Aptitude Test",
                      desc: "Unlock your hyper-accurate 6D profile.",
                    },
                    {
                      icon: Sparkles,
                      title: "View Recommendations",
                      desc: "Get tailored course & job fits.",
                    },
                    {
                      icon: Bot,
                      title: "Chat with AI",
                      desc: "Get answers & build roadmaps in real-time.",
                    },
                    {
                      icon: BookOpen,
                      title: "Explore & Apply",
                      desc: "Browse and apply to colleges and jobs directly.",
                    },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/30 transition-colors group"
                    >
                      <feat.icon
                        size={24}
                        className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h5 className="font-bold text-white mb-1">
                        {feat.title}
                      </h5>
                      <p className="text-slate-500 text-sm">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. College Admin View */}
            {activeRole === "college" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Manage Admissions.
                  </h4>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Empower your campus by managing your digital catalog and
                    finding the perfect profile fits.
                  </p>
                  <button
                    onClick={handleExploreHub}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium text-white hover:from-indigo-400 hover:to-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    Access Admin Portal <ArrowRight size={16} />
                  </button>
                </div>
                <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: BookOpen,
                      title: "Manage Courses",
                      desc: "Add, edit, update, or delete colleges & courses.",
                    },
                    {
                      icon: Database,
                      title: "Access Student Data",
                      desc: "View detailed multi-dimensional profiles.",
                    },
                    {
                      icon: Award,
                      title: "Process Applications",
                      desc: "Seamlessly approve students for courses.",
                    },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/30 transition-colors group"
                    >
                      <feat.icon
                        size={24}
                        className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h5 className="font-bold text-white mb-1">
                        {feat.title}
                      </h5>
                      <p className="text-slate-500 text-sm">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Company View */}
            {activeRole === "company" && (
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                    Source Top Talent.
                  </h4>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Cut through standard recruitment barriers and reach students
                    that have the exact skill traits you require.
                  </p>
                  <button
                    onClick={handleExploreHub}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-white hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    Launch Recruiter Hub <ArrowRight size={16} />
                  </button>
                </div>
                <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Briefcase,
                      title: "Manage Job Posts",
                      desc: "Add, edit, update, or delete career listings.",
                    },
                    {
                      icon: Database,
                      title: "Access Talent Database",
                      desc: "Find students matching your vector parameters.",
                    },
                    {
                      icon: Award,
                      title: "Hire Candidates",
                      desc: "Directly track and approve applied students.",
                    },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/30 transition-colors group"
                    >
                      <feat.icon
                        size={24}
                        className="text-blue-400 mb-3 group-hover:scale-110 transition-transform"
                      />
                      <h5 className="font-bold text-white mb-1">
                        {feat.title}
                      </h5>
                      <p className="text-slate-500 text-sm">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Logic Flow Pipeline ===== */}
      <section className="max-w-7xl mx-auto p-8 md:px-12 mt-24 bg-slate-900/30 border border-slate-800 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -z-10"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Recommendation Pipeline Logic Flow
        </h2>

        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-slate-800 via-cyan-500/50 to-slate-800 -z-10"></div>

          {[
            {
              step: "Step 1",
              title: "User Auth & Aptitude",
              desc: "Secure JWT login into our complete 6D competency assessment to generate individual capability scores.",
              icon: Target,
            },
            {
              step: "Step 2",
              title: "Vector Generation",
              desc: "Transform 6D scores into a user competency vector. Query MongoDB for eligible courses & prerequisites.",
              icon: Layers,
            },
            {
              step: "Step 3",
              title: "Similarity Matching",
              desc: "Apply cosine similarity algorithm comparing user vectors against course requirement vectors.",
              icon: Cpu,
            },
            {
              step: "Step 4",
              title: "Smart Output",
              desc: "Multi-factor ranking by popularity, rating, recency, and eligibility to display top personalized matches.",
              icon: BarChart3,
            },
          ].map((phase, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center mb-6 shadow-xl relative z-10 group hover:border-cyan-400 transition-colors duration-300">
                <phase.icon
                  size={32}
                  className="text-cyan-400 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {phase.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {phase.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {phase.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Tech Stack Section ===== */}
      <section className="max-w-7xl mx-auto p-8 md:px-12 mt-24 text-center">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
          Modern Tech Stack Architecture
        </h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
          <div className="flex flex-col items-center gap-3">
            <Code size={40} className="text-blue-400" />
            <span className="text-slate-300 font-medium">
              React + Vite + Tailwind
            </span>
            <span className="text-xs text-slate-500">Reactive Frontend</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Database size={40} className="text-green-500" />
            <span className="text-slate-300 font-medium">
              Node.js + MongoDB
            </span>
            <span className="text-xs text-slate-500">Scalable Backend</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <TrendingUp size={40} className="text-indigo-400" />
            <span className="text-slate-300 font-medium">
              Cosine Similarity Algos
            </span>
            <span className="text-xs text-slate-500">AI Processing Engine</span>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="max-w-5xl mx-auto mt-24 mb-20">
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-12 text-center rounded-3xl mx-6 shadow-[0_0_40px_rgba(6,182,212,0.3)] border border-cyan-400/20 relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Let's Build Your Future Together.
            </h2>
            <p className="text-cyan-100 text-lg mb-8 max-w-2xl mx-auto">
              Join the platform that treats you as an individual. Generate your
              6D competency profile and find careers that match your true
              potential.
            </p>
            {user ? (
              <Link
                to={`${
                  user.role === "student"
                    ? "/student/dashboard"
                    : user.role === "college"
                    ? "/college/dashboard"
                    : "/company/dashboard"
                }`}
                className="px-10 py-4 bg-slate-950 text-white rounded-xl hover:bg-slate-900 transition-all shadow-xl inline-flex items-center gap-3 font-semibold text-lg hover:scale-105"
              >
                Go to Dashboard{" "}
                <ArrowRight size={20} className="text-cyan-400" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-10 py-4 bg-slate-950 text-white rounded-xl hover:bg-slate-900 transition-all shadow-xl inline-flex items-center gap-3 font-semibold text-lg hover:scale-105 border border-slate-800 hover:border-cyan-500/50"
              >
                Start Your 6D Assessment{" "}
                <ArrowRight size={20} className="text-cyan-400" />
              </Link>
            )}
            <div className="mt-8 text-cyan-200/60 text-sm">
              System running v2.0
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}

export default LandingPage;
