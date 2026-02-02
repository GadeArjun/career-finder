import React, { useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  Briefcase,
  TrendingUp,
  Zap,
  Star,
  Eye,
  Plus,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import { useCompanyContext } from "../../context/CompanyContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";

const CompanyDashboard = () => {
  const { companies, loading, fetchCompanies } = useCompanyContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8 font-poppins">
      {/* === DASHBOARD HEADER === */}

      <Header title={"Dashboard"} />

      <div className="mt-20  max-w-7xl mx-auto mb-10">
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
            onClick={() => navigate("/company/companys")}
            className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition shadow-lg shadow-blue-900/20"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* === QUICK STATS BAR === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Total Entities
            </p>
            <p className="text-2xl font-bold">{companies.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Active Hiring
            </p>
            <p className="text-2xl font-bold text-green-400">
              {
                companies.filter(
                  (c) =>
                    c.hiringStats.fresherHiring ||
                    c.hiringStats.internshipAvailable
                ).length
              }
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Avg. Rating
            </p>
            <p className="text-2xl font-bold text-yellow-400">4.2</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 uppercase">
              Total Views
            </p>
            <p className="text-2xl font-bold text-blue-400">
              {companies.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* === COMPANIES GRID === */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard
            key={company._id}
            company={company}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

// --- INDIVIDUAL COMPANY CARD COMPONENT ---
const CompanyCard = ({ company, navigate }) => {
  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header: Logo & Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              company.name[0]
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              company.status === "active"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {company.status}
          </span>
        </div>

        {/* Company Identity */}
        <div className="mb-4">
          <h3 className="text-xl font-bold group-hover:text-blue-400 transition">
            {company.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <Briefcase size={14} />
            <span>
              {company.industry} • {company.companyType}
            </span>
          </div>
        </div>

        {/* Tags / Domains */}
        <div className="flex flex-wrap gap-2 mb-6">
          {company.hiringDomains.slice(0, 3).map((domain) => (
            <span
              key={domain}
              className="bg-gray-800 text-gray-400 px-2 py-1 rounded-md text-[10px] font-medium"
            >
              {domain}
            </span>
          ))}
          {company.hiringDomains.length > 3 && (
            <span className="text-gray-600 text-[10px] self-center">
              +{company.hiringDomains.length - 3} more
            </span>
          )}
        </div>

        {/* Mini Metrics */}
        <div className="grid grid-cols-3 gap-2 bg-gray-950/50 p-3 rounded-2xl border border-gray-800 mb-6">
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              Rating
            </p>
            <p className="text-sm font-bold text-yellow-500 flex items-center justify-center gap-1">
              {company.rating} <Star size={10} fill="currentColor" />
            </p>
          </div>
          <div className="text-center border-x border-gray-800">
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              Hires
            </p>
            <p className="text-sm font-bold text-white">{company.totalHires}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              Innovation
            </p>
            <p className="text-sm font-bold text-blue-400">
              {company.innovationScore}%
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/company/companys/${company._id}`)}
          className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          View Console <ArrowRight size={16} />
        </button>
        <button
          onClick={() => window.open(company.website, "_blank")}
          className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition text-gray-400"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default CompanyDashboard;
