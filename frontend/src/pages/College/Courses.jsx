// import React, { useEffect, useState } from "react";
// import {
//   Plus,
//   Edit3,
//   Trash2,
//   Search,
//   Clock,
//   Users,
//   Building2,
//   Eye,
// } from "lucide-react";
// import Header from "../../components/common/Header";
// import { useUserContext } from "../../context/UserContext";
// import { useCourseContext } from "../../context/CourseContext";
// import { useCollegeContext } from "../../context/CollegeContext";
// import { Link, useNavigate } from "react-router-dom";

// export default function Courses() {
//   const navigate = useNavigate();
//   const { user } = useUserContext();
//   const { colleges } = useCollegeContext();
//   const {
//     courses,
//     loading,
//     fetchCourses,
//     addCourse,
//     updateCourse,
//     deleteCourse,
//   } = useCourseContext();

//   const [search, setSearch] = useState("");
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedCollege, setSelectedCollege] = useState("");
//   const [filteredCourses, setFilteredCourses] = useState([]);

//   const emptyCourse = {
//     collegeId: "",
//     title: "",
//     description: "",
//     duration: "",
//     intake: 0,
//     feePerYear: 0,
//     mode: "Offline",
//     eligibility: "",
//     admissionProcess: "",
//     tags: [],
//     placementRate: 0,
//   };

//   const [formData, setFormData] = useState(emptyCourse);

//   useEffect(() => {
//     if (user?.role === "college") {
//       const myCollege = colleges.find((c) => c.ownerId === user._id);
//       if (myCollege) {
//         setSelectedCollege(myCollege._id);
//       }
//     }
//   }, [user, colleges]);

//   useEffect(() => {
//     const result = courses.filter((course) =>
//       course.title.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredCourses(result);
//   }, [search, courses]);

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const payload = { ...formData, collegeId: selectedCollege };
//       if (editingCourse) {
//         const res = await updateCourse(editingCourse._id, payload);
//         if (res.success) {
//           setEditingCourse(null);
//           setShowForm(false);
//         }
//       } else {
//         const res = await addCourse(payload);
//         if (res.success) setShowForm(false);
//       }
//       setFormData(emptyCourse);
//       fetchCourses(selectedCollege);
//     } catch (err) {
//       console.error("Save Error:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this course?")) return;
//     const res = await deleteCourse(id);
//     if (res.success) fetchCourses(selectedCollege);
//   };

//   const startEdit = (course) => {
//     setEditingCourse(course);
//     setFormData(course);
//     setShowForm(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 font-poppins">
//       <Header title="Manage Courses" />
//       <main className="p-6 pt-20">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg w-full max-w-md">
//             <Search size={18} className="text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="bg-transparent outline-none w-full text-sm"
//             />
//           </div>

//           <button
//             onClick={() => {
//               setShowForm(true);
//               setEditingCourse(null);
//               setFormData(emptyCourse);
//             }}
//             className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Plus size={18} /> Add Course
//           </button>
//         </div>

//         {/* Course Grid */}
//         {loading ? (
//           <p>Loading courses...</p>
//         ) : filteredCourses.length ? (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCourses.map((course) => (
//               <div
//                 key={course._id}
//                 className="bg-gray-800 border border-blue-500/20 rounded-2xl p-5 hover:shadow-blue-500/20 transition-all"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <h3 className="text-lg font-semibold text-blue-400 leading-tight">
//                     {course.title}
//                   </h3>
//                   <span className="text-xs text-gray-400">
//                     {course.mode || "Offline"}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-300 line-clamp-3 mb-3">
//                   {course.description || "No description available."}
//                 </p>

//                 <div className="text-xs text-gray-400 space-y-1">
//                   <p className="flex items-center gap-1">
//                     <Clock size={12} /> Duration: {course.duration || "N/A"}
//                   </p>
//                   <p className="flex items-center gap-1">
//                     <Users size={12} /> Intake: {course.intake || 0} students
//                   </p>
//                   <p className="flex items-center gap-1">
//                     <Building2 size={12} /> Fee: ₹{course.feePerYear || 0}/year
//                   </p>
//                 </div>

//                 <div className="flex gap-2 mt-4">
//                   <button
//                     onClick={() => startEdit(course)}
//                     className="bg-blue-600/30 hover:bg-blue-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
//                   >
//                     <Edit3 size={14} /> Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(course._id)}
//                     className="bg-red-600/30 hover:bg-red-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
//                   >
//                     <Trash2 size={14} /> Delete
//                   </button>
//                   <Link
//                     to={`/college/course/${course._id}`}
//                     className="bg-green-600/30 hover:bg-green-600/50 px-3 py-1 rounded flex items-center gap-1 text-sm"
//                   >
//                     <Eye size={14} /> View
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No courses found.</p>
//         )}

//         {/* Add / Edit Form */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-lg border border-blue-500/20 max-h-[500px] overflow-auto">
//               <h3 className="text-xl font-semibold mb-4 text-blue-400">
//                 {editingCourse ? "Edit Course" : "Add New Course"}
//               </h3>

//               <div className="grid gap-4 text-sm">
//                 {/* Course Title */}
//                 <label className="text-gray-300 font-medium">
//                   Course Title
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => handleChange("title", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="e.g. B.Tech in Computer Science"
//                 />

//                 {/* Description */}
//                 <label className="text-gray-300 font-medium">Description</label>
//                 <textarea
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="Short description about the course"
//                 />

//                 {/* Duration */}
//                 <label className="text-gray-300 font-medium">Duration</label>
//                 <input
//                   type="text"
//                   value={formData.duration}
//                   onChange={(e) => handleChange("duration", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="e.g. 4 Years"
//                 />

//                 {/* Intake */}
//                 <label className="text-gray-300 font-medium">Intake</label>
//                 <input
//                   type="number"
//                   value={formData.intake}
//                   onChange={(e) => handleChange("intake", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="Number of students"
//                 />

//                 {/* Fee per Year */}
//                 <label className="text-gray-300 font-medium">
//                   Fee Per Year (₹)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.feePerYear}
//                   onChange={(e) => handleChange("feePerYear", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="e.g. 150000"
//                 />

//                 {/* Mode */}
//                 <label className="text-gray-300 font-medium">Mode</label>
//                 <select
//                   value={formData.mode}
//                   onChange={(e) => handleChange("mode", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                 >
//                   <option value="Offline">Offline</option>
//                   <option value="Online">Online</option>
//                   <option value="Hybrid">Hybrid</option>
//                 </select>

//                 {/* College Select */}
//                 <label className="text-gray-300 font-medium">
//                   Select College
//                 </label>
//                 <select
//                   value={selectedCollege}
//                   onChange={(e) => setSelectedCollege(e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                 >
//                   {colleges.map((cl) => (
//                     <option key={cl._id} value={cl._id}>
//                       {cl.name}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Eligibility */}
//                 <label className="text-gray-300 font-medium">Eligibility</label>
//                 <input
//                   type="text"
//                   value={formData.eligibility}
//                   onChange={(e) => handleChange("eligibility", e.target.value)}
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="e.g. 12th PCM with 60%"
//                 />

//                 {/* Admission Process */}
//                 <label className="text-gray-300 font-medium">
//                   Admission Process (Step-wise)
//                 </label>
//                 <textarea
//                   rows={4}
//                   value={formData.admissionProcess}
//                   onChange={(e) =>
//                     handleChange("admissionProcess", e.target.value)
//                   }
//                   className="bg-gray-700 p-2 rounded leading-relaxed whitespace-pre-line"
//                   placeholder={`Example:\n1. Apply online through the portal\n2. Appear for entrance test\n3. Attend counselling session`}
//                 />

//                 {/* Tags */}
//                 <label className="text-gray-300 font-medium">Tags</label>
//                 <input
//                   type="text"
//                   value={formData.tags?.join(", ")}
//                   onChange={(e) =>
//                     handleChange(
//                       "tags",
//                       e.target.value.split(",").map((t) => t.trim())
//                     )
//                   }
//                   className="bg-gray-700 p-2 rounded"
//                   placeholder="e.g. Engineering, CS, AI"
//                 />
//               </div>

//               <div className="flex justify-end gap-3 mt-5">
//                 <button
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
//                 >
//                   {editingCourse ? "Update" : "Save"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
