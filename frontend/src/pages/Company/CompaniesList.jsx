import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  MapPin,
  Briefcase,
  Star,
  X,
  Loader2,
  Building2,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  // States
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

  // --- HANDLERS ---
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

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      await deleteCompany(id);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-100 p-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* === HEADER === */}
        <Header title={"Companies"} />

        {/* === SEARCH === */}
        <div className="mb-8 mt-20 justify-center items-center flex gap-4">
          <input
            type="text"
            placeholder="Search entities..."
            className="md:max-w-3xl w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition shadow-xl shadow-blue-900/40"
          >
            <Plus size={20} /> New Company
          </button>
        </div>

        {/* === LIST === */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center text-gray-500 animate-pulse">
              Fetching records...
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <CompanyRow
                key={company._id}
                company={company}
                onDelete={handleDelete}
                onView={() => navigate(`/company/companys/${company._id}`)}
              />
            ))
          )}
        </div>
      </div>

      {/* === ADD COMPANY MODAL === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-gray-900 border border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="text-blue-500" /> Quick Add
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddCompany} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Company Name
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 mt-1 focus:border-blue-500 outline-none"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 mt-1 focus:border-blue-500 outline-none"
                    >
                      {[
                        "Technology",
                        "Finance",
                        "Healthcare",
                        "Education",
                        "Manufacturing",
                        "Startup",
                      ].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      City
                    </label>
                    <input
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 mt-1 focus:border-blue-500 outline-none"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Website URL
                  </label>
                  <div className="relative mt-1">
                    <Globe
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                      size={16}
                    />
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-10 py-3 focus:border-blue-500 outline-none"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  Register Company
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: ROW ---
const CompanyRow = ({ company, onDelete, onView }) => (
  <div className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-900 transition">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center font-bold border border-blue-500/20">
        {company.name[0]}
      </div>
      <div>
        <h4 className="font-bold">{company.name}</h4>
        <p className="text-xs text-gray-500">
          {company.industry} • {company.location?.city || "Global"}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <button onClick={onView} className="p-2 hover:text-blue-400 transition">
        <Eye size={18} />
      </button>

      <button
        onClick={() => onDelete(company._id, company.name)}
        className="p-2 hover:text-red-500 transition"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export default CompaniesList;
