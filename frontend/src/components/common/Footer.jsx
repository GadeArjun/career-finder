import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useUserContext } from "../../context/UserContext";

function Footer() {
  const { user } = useUserContext();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-800/50 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

      {/* ===== Main Footer Grid ===== */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* 🌐 Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Cpu size={20} className="text-cyan-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              CareerFinder<span className="text-cyan-400">.AI</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500">
            Utilizing proprietary 6D Competency Models and Cosine Similarity to
            bridge the guidance gap for students worldwide.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: Facebook, color: "hover:text-blue-500" },
              { icon: Twitter, color: "hover:text-sky-400" },
              { icon: Instagram, color: "hover:text-pink-500" },
              { icon: Linkedin, color: "hover:text-cyan-400" },
            ].map((social, i) => (
              <a
                key={i}
                href="#"
                className={`w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl transition-all duration-300 hover:border-cyan-500/50 hover:-translate-y-1 ${social.color}`}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* ⚡ Platform Links */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-cyan-400 transition-colors"
              >
                6D Model Theory
              </Link>
            </li>
            {!user ? (
              <li>
                <Link
                  to="/register"
                  className="text-cyan-400 font-medium hover:underline"
                >
                  Start Aptitude Test
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/student/dashboard"
                  className="hover:text-cyan-400 transition-colors"
                >
                  My Career Roadmap
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/privacy"
                className="hover:text-cyan-400 transition-colors"
              >
                Data Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">
            Contact Team
          </h4>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-3">
              <span className="text-slate-600">Email:</span>
              <span className="text-slate-300">support@careerfinder.ai</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-slate-600">Location:</span>
              <span className="text-slate-300">Pune, Maharashtra, India</span>
            </p>
            <div className="pt-4 flex items-center gap-2 text-xs text-green-500/80">
              <ShieldCheck size={14} />
              <span>Verified AI Recommendations</span>
            </div>
          </div>
        </div>

        {/* 📨 Newsletter / Security */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-200">
            Join the Loop
          </h4>
          <p className="text-sm text-slate-500">
            Get the latest career trends and algorithmic updates.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2"
          >
            <div className="relative">
              <input
                type="email"
                placeholder="university@email.com"
                className="w-full p-3 pl-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors group"
              >
                <Send
                  size={16}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== Divider Glow Line ===== */}
      <div className="mt-16 mb-8 h-px w-full bg-slate-900"></div>

      {/* ===== Bottom Section ===== */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
        <div className="text-slate-600">
          © 2026{" "}
          <span className="text-slate-400 font-semibold">Career Finder</span> —
          Developed by{" "}
          <span className="text-cyan-500/80">Career Finder Team</span> For —
          Students
        </div>
      </div>
    </footer>
  );
}

export default Footer;
