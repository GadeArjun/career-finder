import React, { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  MapPin,
  Globe,
  Mail,
  Award,
  Building2,
  Calendar,
  Users,
  BookOpen,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Upload,
  PlusIcon,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Briefcase,
  Trash2,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/Header";
import { useUserContext } from "../../context/UserContext";
import { useCollegeContext } from "../../context/CollegeContext";

// Fallback images
const FALLBACK_BANNER = "https://picsum.photos/1200/400?grayscale";
const FALLBACK_LOGO = "https://picsum.photos/200/200";

export default function CollegeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { getCollegeById, updateCollege, setSelectedCollege } =
    useCollegeContext();

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // Fetch college on mount
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getCollegeById(id);
      if (res?.success) {
        setFormData(res.data);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  // Handle deep nested field changes
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

  // Handle Array Modifications (Add/Remove items from lists)
  const handleArrayChange = (path, operation, payload) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      const targetKey = keys[keys.length - 1];
      const currentArray = obj[targetKey] || [];

      if (operation === "add" && payload) {
        obj[targetKey] = [...currentArray, payload];
      } else if (operation === "remove") {
        obj[targetKey] = currentArray.filter((_, idx) => idx !== payload);
      }
      return updated;
    });
  };

  // Save updated details
  const handleSave = async () => {
    const res = await updateCollege(id, formData);
    if (res.success) {
      setIsEditing(false);
      setSelectedCollege(formData);
      alert("College updated successfully!");
    } else {
      alert(res.message || "Error updating college");
    }
  };

  if (loading || !formData)
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const college = formData;

  return (
    <div className="min-h-screen max-w-full bg-gray-900 text-gray-100 font-poppins pb-20">
      <Header title={college.name || "College Details"} />

      <main className="p-4 pt-20 max-w-7xl mx-auto space-y-8">
        {/* ================= HEADER & BANNER ================= */}
        <div className="relative group">
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative">
            <ImageWithFallback
              src={college.bannerImage}
              fallback={FALLBACK_BANNER}
              alt="Campus Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
          </div>

          {/* Logo & Title Overlay */}
          <div className="absolute -bottom-12 left-6 md:left-10 flex items-end gap-6">
            <div className="relative">
              <ImageWithFallback
                src={college.logo}
                fallback={FALLBACK_LOGO}
                alt="Logo"
                className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-4 border-gray-800 bg-gray-800 shadow-lg object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl cursor-pointer">
                  <Upload size={20} className="text-white" />
                </div>
              )}
            </div>

            <div className="mb-14 md:mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={college.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-gray-800/80 border border-blue-500 text-2xl md:text-4xl font-bold text-white px-3 py-1 rounded-lg w-full md:w-[600px]"
                />
              ) : (
                <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                  {college.name}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mt-2 text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-blue-400" />{" "}
                  {college.location?.city}, {college.location?.state}
                </span>
                <span className="hidden md:inline">•</span>
                <span className="bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 text-xs font-semibold">
                  {college.accreditation}
                </span>
                <span className="bg-green-600/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30 text-xs font-semibold">
                  NIRF #{college.nirfRank}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg ${
                isEditing
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-200"
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={18} /> Save Changes
                </>
              ) : (
                <>
                  <Edit3 size={18} /> Edit Profile
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg backdrop-blur-md"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT COLUMN (General Info) ================= */}
          <div className="lg:col-span-2 space-y-8 mt-8">
            {/* Description */}
            <Section title="About the Institute" icon={<Building2 size={20} />}>
              {isEditing ? (
                <textarea
                  value={college.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-blue-500 focus:outline-none min-h-[100px]"
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {college.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <DetailBox
                  label="Established"
                  value={college.establishedYear}
                  icon={<Calendar size={16} />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("establishedYear", v)}
                />
                <DetailBox
                  label="Type"
                  value={college.collegeType}
                  icon={<Building2 size={16} />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("collegeType", v)}
                />
                <DetailBox
                  label="Campus"
                  value={college.campusType}
                  icon={<MapPin size={16} />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("campusType", v)}
                />
                <DetailBox
                  label="Rating"
                  value={college.rating}
                  icon={<Award size={16} />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("rating", v)}
                  type="number"
                />
              </div>
            </Section>

            {/* Academic & Stats Grid */}
            <Section title="Academic Overview" icon={<BookOpen size={20} />}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  label="Total Students"
                  value={college.totalStudents}
                  icon={<Users className="text-purple-400" />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("totalStudents", v)}
                />
                <StatCard
                  label="Total Courses"
                  value={college.totalCourses}
                  icon={<BookOpen className="text-blue-400" />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("totalCourses", v)}
                />
                <StatCard
                  label="Research Score"
                  value={college.researchScore}
                  icon={<TrendingUp className="text-green-400" />}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("researchScore", v)}
                />
                <StatCard
                  label="Ind. Collab."
                  value={college.industryCollaborationScore}
                  icon={<Briefcase className="text-orange-400" />}
                  isEditing={isEditing}
                  onChange={(v) =>
                    handleChange("industryCollaborationScore", v)
                  }
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6 mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                <BooleanToggle
                  label="Hostel Available"
                  value={college.hostelAvailable}
                  isEditing={isEditing}
                  onToggle={(v) => handleChange("hostelAvailable", v)}
                />
                <div className="w-px bg-gray-700"></div>
                <BooleanToggle
                  label="Intl. Exposure"
                  value={college.internationalExposure}
                  isEditing={isEditing}
                  onToggle={(v) => handleChange("internationalExposure", v)}
                />
              </div>
            </Section>

            {/* Placement & Fees */}
            <Section title="Placement & Fees" icon={<DollarSign size={20} />}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-3 uppercase font-semibold">
                    Placement Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Avg Package</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={college.placementStats?.averagePackage}
                          onChange={(e) =>
                            handleChange(
                              "placementStats.averagePackage",
                              e.target.value
                            )
                          }
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className="font-bold text-white">
                          ₹{" "}
                          {(
                            college.placementStats?.averagePackage / 100000
                          ).toFixed(1)}{" "}
                          LPA
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        Highest Package
                      </span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={college.placementStats?.highestPackage}
                          onChange={(e) =>
                            handleChange(
                              "placementStats.highestPackage",
                              e.target.value
                            )
                          }
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className="font-bold text-green-400">
                          ₹{" "}
                          {(
                            college.placementStats?.highestPackage / 100000
                          ).toFixed(1)}{" "}
                          LPA
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        Placement Rate
                      </span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={college.placementStats?.placementRate}
                          onChange={(e) =>
                            handleChange(
                              "placementStats.placementRate",
                              e.target.value
                            )
                          }
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-right"
                        />
                      ) : (
                        <span className="font-bold text-blue-400">
                          {college.placementStats?.placementRate}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-3 uppercase font-semibold">
                    Fee Structure (Yearly)
                  </h4>
                  <div className="flex items-center justify-center h-full pb-4 gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={college.feeRange?.min}
                          onChange={(e) =>
                            handleChange("feeRange.min", e.target.value)
                          }
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          value={college.feeRange?.max}
                          onChange={(e) =>
                            handleChange("feeRange.max", e.target.value)
                          }
                          className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1"
                        />
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        ₹{(college.feeRange?.min / 1000).toFixed(0)}k{" "}
                        <span className="text-gray-500 text-lg font-normal">
                          -
                        </span>{" "}
                        ₹{(college.feeRange?.max / 1000).toFixed(0)}k
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Recruiters Array */}
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Top Recruiters</h4>
                <ArrayEditor
                  items={college.placementStats?.topRecruiters}
                  isEditing={isEditing}
                  onAdd={(val) =>
                    handleArrayChange(
                      "placementStats.topRecruiters",
                      "add",
                      val
                    )
                  }
                  onRemove={(idx) =>
                    handleArrayChange(
                      "placementStats.topRecruiters",
                      "remove",
                      idx
                    )
                  }
                  placeholder="Add Company"
                />
              </div>
            </Section>

            {/* Arrays: Facilities & Focus Areas */}
            <Section
              title="Campus Life & Focus"
              icon={<CheckCircle size={20} />}
            >
              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-2">Facilities</h4>
                <ArrayEditor
                  items={college.facilities}
                  isEditing={isEditing}
                  onAdd={(val) => handleArrayChange("facilities", "add", val)}
                  onRemove={(idx) =>
                    handleArrayChange("facilities", "remove", idx)
                  }
                  placeholder="Add Facility"
                  tagColor="bg-purple-900/40 text-purple-200 border-purple-700/50"
                />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-2">Focus Areas</h4>
                <ArrayEditor
                  items={college.focusAreas}
                  isEditing={isEditing}
                  onAdd={(val) => handleArrayChange("focusAreas", "add", val)}
                  onRemove={(idx) =>
                    handleArrayChange("focusAreas", "remove", idx)
                  }
                  placeholder="Add Area"
                  tagColor="bg-cyan-900/40 text-cyan-200 border-cyan-700/50"
                />
              </div>
            </Section>
          </div>

          {/* ================= RIGHT COLUMN (Side Panel) ================= */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={18} className="text-blue-400" /> Contact
              </h3>
              <div className="space-y-4 text-sm">
                <ContactRow
                  icon={<Mail size={16} />}
                  label="Email"
                  value={college.email}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("email", v)}
                />
                <ContactRow
                  icon={<Globe size={16} />}
                  label="Website"
                  value={college.website}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("website", v)}
                />

                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-3 uppercase font-semibold">
                    Social Media
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <SocialInput
                      icon={<Linkedin size={16} />}
                      label="LinkedIn"
                      value={college.socialLinks?.linkedin}
                      isEditing={isEditing}
                      onChange={(v) => handleChange("socialLinks.linkedin", v)}
                    />
                    <SocialInput
                      icon={<Twitter size={16} />}
                      label="Twitter"
                      value={college.socialLinks?.twitter}
                      isEditing={isEditing}
                      onChange={(v) => handleChange("socialLinks.twitter", v)}
                    />
                    <SocialInput
                      icon={<Instagram size={16} />}
                      label="Instagram"
                      value={college.socialLinks?.instagram}
                      isEditing={isEditing}
                      onChange={(v) => handleChange("socialLinks.instagram", v)}
                    />
                    <SocialInput
                      icon={<Facebook size={16} />}
                      label="Facebook"
                      value={college.socialLinks?.facebook}
                      isEditing={isEditing}
                      onChange={(v) => handleChange("socialLinks.facebook", v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Profile */}
            <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Award size={18} className="text-yellow-400" /> Competency
              </h3>
              <div className="space-y-4 w-full overflow-hidden">
                {Object.entries(college.competencyProfile || {}).map(
                  ([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1 text-gray-300 capitalize">
                        <span>{key}</span>
                        <span>{val}%</span>
                      </div>
                      <div
                        style={{ width: "100%" }}
                        className="bg-gray-700 rounded-full h-2 overflow-hidden"
                      >
                        {isEditing ? (
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) =>
                              handleChange(
                                `competencyProfile.${key}`,
                                parseInt(e.target.value)
                              )
                            }
                            style={{ width: "100%" }}
                            className="overflow-hidden -top-2 cursor-pointer relative opacity-0  z-10"
                          />
                        ) : null}
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-500 h-2 rounded-full transition-all duration-500 overflow-hidden relative -top-6my profile"
                          style={{ width: `${val}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Tags: Best For */}
            <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Best For</h3>
              <ArrayEditor
                items={college.bestFor}
                isEditing={isEditing}
                onAdd={(val) => handleArrayChange("bestFor", "add", val)}
                onRemove={(idx) => handleArrayChange("bestFor", "remove", idx)}
                placeholder="Tag..."
                tagColor="bg-yellow-900/30 text-yellow-200 border-yellow-700/50"
              />
            </div>

            {/* Location Details */}
            <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Location</h3>
              <div className="space-y-3">
                <DetailBox
                  label="City"
                  value={college.location?.city}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("location.city", v)}
                />
                <DetailBox
                  label="State"
                  value={college.location?.state}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("location.state", v)}
                />
                <DetailBox
                  label="Country"
                  value={college.location?.country}
                  isEditing={isEditing}
                  onChange={(v) => handleChange("location.country", v)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const Section = ({ title, icon, children }) => (
  <section className="bg-gray-800/40 rounded-2xl p-6 md:p-8 border border-gray-700 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
    </div>
    {children}
  </section>
);

const DetailBox = ({
  label,
  value,
  icon,
  isEditing,
  onChange,
  type = "text",
}) => (
  <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
    <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    {isEditing ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 w-full text-sm text-white focus:border-blue-500 outline-none"
      />
    ) : (
      <p className="text-gray-200 font-medium truncate">{value || "—"}</p>
    )}
  </div>
);

const StatCard = ({ label, value, icon, isEditing, onChange }) => (
  <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center hover:border-blue-500/30 transition">
    <div className="mb-2 opacity-90">{icon}</div>
    {isEditing ? (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 text-center bg-gray-800 border border-gray-600 rounded py-1 text-white font-bold"
      />
    ) : (
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    )}
    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
      {label}
    </p>
  </div>
);

const BooleanToggle = ({ label, value, isEditing, onToggle }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-3 h-3 rounded-full ${
        value
          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          : "bg-red-500"
      }`}
    ></div>
    <span className="text-gray-300 text-sm font-medium">{label}</span>
    {isEditing && (
      <button
        onClick={() => onToggle(!value)}
        className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300 ml-2"
      >
        Change
      </button>
    )}
  </div>
);

const ContactRow = ({ icon, label, value, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 flex items-center gap-1">
      {icon} {label}
    </span>
    {isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full text-gray-200 text-sm"
      />
    ) : (
      <span className="text-gray-200 font-medium truncate hover:text-blue-400 transition cursor-pointer">
        {value}
      </span>
    )}
  </div>
);

const SocialInput = ({ icon, label, value, isEditing, onChange }) => (
  <div className="flex items-center gap-2">
    <div className="text-gray-400">{icon}</div>
    {isEditing ? (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} URL`}
        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full text-xs text-gray-200"
      />
    ) : value ? (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 text-sm hover:underline truncate"
      >
        {label}
      </a>
    ) : (
      <span className="text-gray-600 text-sm italic">No {label}</span>
    )}
  </div>
);

const ArrayEditor = ({
  items = [],
  isEditing,
  onAdd,
  onRemove,
  placeholder,
  tagColor = "bg-blue-900/30 text-blue-200 border-blue-700/50",
}) => {
  const [temp, setTemp] = useState("");
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={idx}
          className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${tagColor}`}
        >
          {item}
          {isEditing && (
            <button
              onClick={() => onRemove(idx)}
              className="hover:text-red-400"
            >
              <X size={12} />
            </button>
          )}
        </span>
      ))}
      {isEditing && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && temp) {
                onAdd(temp);
                setTemp("");
              }
            }}
            placeholder={placeholder}
            className="bg-gray-800 border border-gray-600 rounded-full px-3 py-1 text-sm w-32 focus:w-48 transition-all outline-none"
          />
          <button
            onClick={() => {
              if (temp) {
                onAdd(temp);
                setTemp("");
              }
            }}
            className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-500"
          >
            <PlusIcon size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const ImageWithFallback = ({ src, fallback, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};
