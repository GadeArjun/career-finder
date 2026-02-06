import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  MapPin,
  Globe,
  Mail,
  Eye,
  BookTextIcon,
} from "lucide-react";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";
import { useCollegeContext } from "../../context/CollegeContext";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Colleges() {
  const { user } = useUserContext();
  const [search, setSearch] = useState("");
  const [editingCollege, setEditingCollege] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const {
    colleges,
    loading,
    addCollege,
    updateCollege,
    deleteCollege,
    fetchColleges,
  } = useCollegeContext();

  const emptyCollege = {
    name: "",
    location: { city: "", state: "", country: "India" },
    email: "",
    website: "",
    description: "",
    collegeType: "Private",
    accreditation: "",
    establishedYear: "",
    socialLinks: { facebook: "", linkedin: "", instagram: "" },
  };

  const [formData, setFormData] = useState(emptyCollege);

  /* -----------------------------------
     🔹 Handle Form Change
  ----------------------------------- */
  const handleChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  /* -----------------------------------
     🔹 Save / Update College
  ----------------------------------- */
  const handleSave = async () => {
    try {
      const method = editingCollege ? "PUT" : "POST";
      const url = editingCollege
        ? updateCollege(editingCollege._id, formData)
            .then(() => {
              fetchColleges();
              setShowForm(false);
              setEditingCollege(null);
              setFormData(emptyCollege);
            })
            .catch(() => {
              alert(data.message);
            })
        : addCollege(formData)
            .then(() => {
              fetchColleges();
              setShowForm(false);
              setEditingCollege(null);
              setFormData(emptyCollege);
            })
            .catch(() => {
              alert(data.message);
            });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /* -----------------------------------
     🔹 Delete College
  ----------------------------------- */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this college?")) return;
    try {
      deleteCollege(id)
        .then(() => {
          fetchColleges();
        })
        .catch(() => {
          alert(data.message);
        });
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* -----------------------------------
     🔹 Edit College
  ----------------------------------- */
  const startEdit = (college) => {
    setEditingCollege(college);
    setFormData(college);
    setShowForm(true);
  };

  /* -----------------------------------
     🔹 Filtered Colleges
  ----------------------------------- */
  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-poppins">
      <Header title="Manage Colleges" />
      <main className="p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg w-full max-w-md">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingCollege(null);
              setFormData(emptyCollege);
            }}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add College
          </button>
        </div>

        {loading ? (
          <p>Loading colleges...</p>
        ) : filtered.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((college) => (
              <div
                key={college._id}
                className="bg-gray-800 border border-blue-500/20 rounded-2xl p-5 hover:shadow-blue-500/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-400">
                    {college.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      college.status === "active"
                        ? "bg-green-600/30 text-green-300"
                        : college.status === "pending"
                        ? "bg-yellow-600/30 text-yellow-300"
                        : "bg-red-600/30 text-red-300"
                    }`}
                  >
                    {college.status}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                  <MapPin size={14} /> {college.location?.city},{" "}
                  {college.location?.state}
                </p>
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    className="text-blue-400 text-sm flex items-center gap-2 mt-1 hover:underline"
                  >
                    <Globe size={14} /> {college.website}
                  </a>
                )}
                {college.email && (
                  <p className="text-sm text-gray-300 flex items-center gap-2 mt-1">
                    <Mail size={14} /> {college.email}
                  </p>
                )}
                <p className="text-gray-400 mt-3 text-sm line-clamp-2">
                  {college.description || "No description yet."}
                </p>

                <div className="flex gap-3 mt-4">
                  {/* <button
                    onClick={() => startEdit(college)}
                    className="bg-blue-600/30 hover:bg-blue-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Edit3 size={14} /> Edit
                  </button> */}

                  <Link
                    to={`/college/colleges/${college._id}`}
                    className="bg-green-600/30 hover:bg-green-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Eye size={14} /> View / Edit
                  </Link>

                  <Link
                    to={`/college/courses/${college._id}`}
                    className="bg-green-600/30 hover:bg-green-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <BookTextIcon size={14} /> View Courses
                  </Link>

                  <button
                    onClick={() => handleDelete(college._id)}
                    className="bg-red-600/30 hover:bg-red-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No colleges found.</p>
        )}

        {/* ------------------ Add/Edit Form ------------------ */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-lg border border-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">
                {editingCollege ? "Edit Basic Details" : "Add New College"}
              </h3>

              <div className="grid gap-3">
                <input
                  type="text"
                  placeholder="College Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.location?.city}
                  onChange={(e) =>
                    handleChange("location.city", e.target.value)
                  }
                  className="bg-gray-700 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.location?.state}
                  onChange={(e) =>
                    handleChange("location.state", e.target.value)
                  }
                  className="bg-gray-700 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-gray-700 p-2 rounded"
                  rows={3}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
                >
                  {editingCollege ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
