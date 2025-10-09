import React from "react";
import { Link } from "react-router-dom";
import { UserCheck, BookOpen, Video, ArrowRight } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import Footer from "../components/common/Footer";
import heroImage from "../assets/hero-image.png";

function LandingPage() {
  const { user } = useUserContext();

  return (
    <div className="font-poppins bg-gray-900 text-gray-100">
      {/* ===== Header ===== */}
      <header className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 transition-all shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to={"/"} className="font-bold text-xl text-[#60A5FA]">
              CareerGuide+
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            {user ? (
              <Link
                to="/student/dashboard"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </header>
      {/* ===== Hero Section ===== */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto p-6 md:px-12 pt-32 gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
            Find Your <span className="text-blue-400">Perfect Career</span> Path
          </h1>
          <p className="text-gray-300 text-lg md:text-xl animate-fade-in delay-100">
            Explore top colleges, personalized learning paths, and track your
            skills & achievements.
          </p>
          <div className="flex gap-4 mt-4 animate-fade-in delay-200">
            {user ? (
              <Link
                to="/student/dashboard"
                className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg hover:shadow-blue-500/40 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg hover:shadow-blue-500/40 flex items-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-blue-400 rounded-lg text-blue-400 hover:bg-blue-400 hover:text-gray-900 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 animate-slide-in-right">
          <img
            src={heroImage}
            alt="Career Finder Hero"
            className="w-full max-w-lg rounded-3xl shadow-2xl border border-blue-700/50"
          />
        </div>
      </section>
      {/* ===== Features Section ===== */}
      <section className="max-w-7xl mx-auto p-6 md:px-12 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Top Colleges",
            desc: "Browse and compare the best colleges for your preferred courses.",
            icon: UserCheck,
            color: "text-blue-400",
          },
          {
            title: "Interactive Learning",
            desc: "Personalized learning paths and skill tracking to help you grow.",
            icon: BookOpen,
            color: "text-green-400",
          },
          {
            title: "Career Guidance",
            desc: "Get expert guidance to choose the right career path.",
            icon: Video,
            color: "text-yellow-400",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/50 transition transform hover:-translate-y-2 animate-fade-in delay-[${i * 100}ms]"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-700/50 mb-4 ${feature.color}`}
            >
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>
      {/* ===== Contact / CTA Section ===== */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 p-12 mt-24 text-center rounded-3xl mx-6 md:mx-12 shadow-2xl animate-fade-in">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to start your career journey?
        </h2>
        <p className="text-gray-300 mb-6">
          Join Career Finder today and explore personalized career paths and top
          colleges.
        </p>
        {user ? (
          <Link
            to="/student/dashboard"
            className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg inline-flex items-center gap-2"
          >
            Go to Dashboard <ArrowRight size={20} />
          </Link>
        ) : (
          <Link
            to="/register"
            className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg inline-flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
        )}
      </section>
      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}

export default LandingPage;
