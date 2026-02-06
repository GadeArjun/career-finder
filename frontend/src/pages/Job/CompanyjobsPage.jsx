import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Currency,
  Users,
  ArrowRight,
  Search,
  ChevronLeft,
  Calendar,
  Globe,
  Zap,
  Plus,
} from "lucide-react";
import { useJobs } from "../../context/JobContext";

const CompanyJobsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { companyJobs, loading, getJobsByCompany } = useJobs();

  useEffect(() => {
    if (companyId) {
      getJobsByCompany(companyId);
    }
  }, [companyId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">
            Scanning Opportunities...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* --- NAVIGATION & HEADER --- */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition"
          />
          Back to Profile
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-gray-800 pb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Job List</h1>
            {/* <p className="text-gray-400 mt-2 text-lg">
              Explore {companyJobs.length} active career paths at this
              organization.
            </p> */}
          </div>
          <Link
            to={`/company/job/add/${companyId}`}
            className="bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800 flex items-center gap-4"
          >
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Add new one
              </p>
              <p className="text-green-400 font-bold">Add Job</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-800"></div>
            <Plus className="text-yellow-500" fill="currentColor" size={24} />
          </Link>
        </div>

        {/* --- JOBS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companyJobs.length > 0 ? (
            companyJobs.map((job) => (
              <JobCard key={job._id} job={job} navigate={navigate} />
            ))
          ) : (
            <div className="col-span-full py-20 bg-gray-900/50 rounded-3xl border border-dashed border-gray-800 text-center">
              <Briefcase size={48} className="mx-auto text-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">
                No active postings found
              </h3>
              <p className="text-gray-600">
                This company hasn't listed any jobs yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- INTERNAL CARD COMPONENT ---
const JobCard = ({ job, navigate }) => {
  return (
    <div
      onClick={() => navigate(`/company/job/edit/${job._id}`)}
      className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-blue-500/50 hover:bg-gray-900/80 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-950 border border-gray-800 rounded-2xl group-hover:scale-110 transition duration-500">
          <Briefcase className="text-blue-500" size={24} />
        </div>
        <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest">
          {job.type}
        </span>
      </div>

      <h3 className="text-xl font-bold group-hover:text-blue-400 transition mb-2">
        {job.title}
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin size={14} className="text-gray-600" />
          {job.location.city},{" "}
          {job.location.remoteAllowed ? "(Remote)" : job.location.country}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar size={14} className="text-gray-600" />
          Exp: {job.experienceLevel}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
            Est. Package
          </p>
          <p className="text-md font-bold text-white">
            {job.salary?.isConfidential
              ? "Confidential"
              : `₹${job.salary?.min}L - ₹${job.salary?.max}L`}
          </p>
        </div>
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default CompanyJobsPage;
