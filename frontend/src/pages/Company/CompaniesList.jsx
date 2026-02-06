import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Eye,
  Search,
  MapPin,
  Briefcase,
  X,
  Loader2,
  Building2,
  Globe,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";
import Header from "../../components/common/Header";

const CompaniesList = () => {
  const navigate = useNavigate();
  const {
    companies,
    loading,
    error,
    fetchCompanies,
    deleteCompany,
    addCompany,
  } = useCompanyContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "Technology",
    website: "",
    location: { city: "", state: "", country: "India" },
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCompany(formData);
      setIsModalOpen(false);
      setFormData({
        name: "",
        industry: "Technology",
        website: "",
        location: { city: "", state: "", country: "India" },
      });
    } catch (err) {
      console.error("Creation failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (e, id, name) => {
    e.stopPropagation(); // Prevent card click navigation
    if (window.confirm(`Delete ${name}?`)) {
      deleteCompany(id);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 p-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        <Header title={"Companies"} />

        {/* === ACTIONS BAR === */}
        <div className="mb-12 mt-24 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search companies by name..."
              className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition all duration-300 shadow-lg shadow-blue-900/30 whitespace-nowrap"
          >
            <Plus size={20} /> Add New Entity
          </button>
        </div>

        {/* === CARDS GRID === */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 italic">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            Synchronizing data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
                onDelete={handleDelete}
                // Update navigation to /company/jobs/:id
                onView={() => navigate(`/company/jobs/${company._id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="text-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl">
            <Building2 className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-500">No matching companies found.</p>
          </div>
        )}
      </div>

      {/* === MODAL (Keep original logic) === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
          <div className="relative bg-gray-900 border border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Form Content ... same as your previous version */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="text-blue-500" /> Quick Register
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleAddCompany} className="space-y-4">
                {/* Inputs ... */}
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Company Name"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none"
                  >
                    {["Technology", "Finance", "Healthcare", "Startup"].map(
                      (i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      )
                    )}
                  </select>
                  <input
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none"
                    placeholder="City"
                  />
                </div>
                <input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none"
                  placeholder="Website URL"
                />
                <button
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 py-4 rounded-xl font-bold flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}{" "}
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODERN CARD COMPONENT ---
const CompanyCard = ({ company, onDelete, onView }) => (
  <div className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between h-full">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg group-hover:scale-110 transition duration-300">
          {company.name[0]}
        </div>
        <button
          onClick={(e) => onDelete(e, company._id, company.name)}
          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition mb-2">
        {company.name}
      </h3>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Briefcase size={14} className="text-blue-500" />
          <span>{company.industry}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin size={14} className="text-blue-500" />
          <span>{company.location?.city || "Remote"}</span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-4">
      <button
        onClick={onView}
        className="flex-1 bg-gray-800 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group/btn"
      >
        View Jobs{" "}
        <ArrowRight
          size={16}
          className="group-hover/btn:translate-x-1 transition"
        />
      </button>

      {
        <Link
          to={`/company/companys/${company._id}`}
          className="p-3 bg-gray-950 border border-gray-800 text-gray-500 hover:text-blue-400 rounded-xl transition"
        >
          <ExternalLink size={18} />
        </Link>
      }
    </div>
  </div>
);

export default CompaniesList;
