// import React, { useEffect, useState } from "react";
// import {
//   BookOpen,
//   Users,
//   GraduationCap,
//   Edit3,
//   Plus,
//   ChevronRight,
//   ChevronDown,
//   FileText,
//   MapPin,
//   Building2,
//   X,
// } from "lucide-react";
// import Header from "../../components/common/Header";
// import { useParams } from "react-router-dom";
// import { useUserContext } from "../../context/UserContext";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export default function CourseDetail() {
//   const { id } = useParams();
//   const { user } = useUserContext();

//   const [course, setCourse] = useState(null);
//   const [learningPath, setLearningPath] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [expandedStage, setExpandedStage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({});
//   const [stageForm, setStageForm] = useState({ title: "", description: "" });
//   const [showModuleModal, setShowModuleModal] = useState(false);
//   const [selectedStageId, setSelectedStageId] = useState(null);
//   const [moduleForm, setModuleForm] = useState({
//     title: "",
//     overview: "",
//     estimatedTime: "",
//   });

//   /* ======================================================
//      🔹 Fetch Course + Learning Path
//   ====================================================== */
//   const fetchDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_URL}/api/courses/${id}`);
//       const data = await res.json();
//       if (res.ok) {
//         setCourse(data.course);
//         setLearningPath(data.learningPath);
//       }
//     } catch (err) {
//       console.error("Error fetching course:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [id]);

//   /* ======================================================
//      🔹 Course Update
//   ====================================================== */
//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/courses/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setCourse(data.course);
//         setEditing(false);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//   };

//   /* ======================================================
//      🔹 Create Learning Path if not exists
//   ====================================================== */
//   const handleCreateLearningPath = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/learning-paths`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify({
//           courseId: course._id,
//           title: `${course.title} - Learning Path`,
//           stages: [],
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setLearningPath(data.path);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error("Create learning path error:", err);
//     }
//   };

//   /* ======================================================
//      🔹 Add Stage
//   ====================================================== */
//   const handleAddStage = async () => {
//     if (!learningPath?._id)
//       return alert("Please create a learning path first.");
//     if (!stageForm.title.trim()) return alert("Stage title is required.");

//     try {
//       const res = await fetch(
//         `${API_URL}/api/learning-paths/${learningPath._id}/add-stage`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user?.token}`,
//           },
//           body: JSON.stringify({ stage: stageForm }),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setLearningPath(data.path);
//         setStageForm({ title: "", description: "" });
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error("Stage add error:", err);
//     }
//   };

//   /* ======================================================
//      🔹 Add Module
//   ====================================================== */
//   const handleAddModule = async () => {
//     if (!moduleForm.title.trim()) return alert("Module title required.");

//     const stageIndex = learningPath.stages.findIndex(
//       (s) => s._id === selectedStageId
//     );
//     if (stageIndex === -1) return alert("Stage not found.");

//     const updated = { ...learningPath };
//     updated.stages[stageIndex].modules.push({
//       ...moduleForm,
//       resources: [],
//     });

//     try {
//       const res = await fetch(
//         `${API_URL}/api/learning-paths/${learningPath._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user?.token}`,
//           },
//           body: JSON.stringify(updated),
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setLearningPath(data.path);
//         setShowModuleModal(false);
//         setModuleForm({ title: "", overview: "", estimatedTime: "" });
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error("Add module error:", err);
//     }
//   };

//   /* ======================================================
//      🔹 UI Rendering
//   ====================================================== */
//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
//         Loading course details...
//       </div>
//     );

//   if (!course)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
//         Course not found.
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 font-poppins">
//       <Header title={course.title} />

//       <main className="p-6 pt-20 space-y-8">
//         {/* ======================================================
//             🏫 COURSE OVERVIEW
//         ====================================================== */}
//         <section className="bg-gray-800 border border-blue-500/20 rounded-2xl p-6 shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold text-blue-400">
//               {course.title}
//             </h2>
//             <button
//               onClick={() => setEditing(!editing)}
//               className="flex items-center gap-2 px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-sm"
//             >
//               <Edit3 size={14} /> {editing ? "Cancel" : "Edit"}
//             </button>
//           </div>

//           {editing ? (
//             <div className="grid sm:grid-cols-2 gap-4">
//               {[
//                 ["description", "Description"],
//                 ["duration", "Duration"],
//                 ["intake", "Intake"],
//                 ["feePerYear", "Fee Per Year"],
//                 ["eligibility", "Eligibility"],
//               ].map(([key, label]) => (
//                 <div key={key}>
//                   <label className="text-gray-300 text-sm font-medium mb-1 block">
//                     {label}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData[key] ?? course[key] ?? ""}
//                     onChange={(e) => handleChange(key, e.target.value)}
//                     className="bg-gray-700 p-2 rounded w-full"
//                   />
//                 </div>
//               ))}
//               <div className="col-span-2 flex justify-end">
//                 <button
//                   onClick={handleSave}
//                   className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 mt-4"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="grid sm:grid-cols-2 gap-4 text-sm">
//               <p>
//                 <span className="font-semibold text-blue-300">Duration:</span>{" "}
//                 {course.duration}
//               </p>
//               <p>
//                 <span className="font-semibold text-blue-300">Mode:</span>{" "}
//                 {course.mode}
//               </p>
//               <p>
//                 <span className="font-semibold text-blue-300">Fee:</span> ₹
//                 {course.feePerYear}
//               </p>
//               <p>
//                 <span className="font-semibold text-blue-300">
//                   Eligibility:
//                 </span>{" "}
//                 {course.eligibility}
//               </p>
//               <p className="sm:col-span-2 text-gray-300">
//                 {course.description}
//               </p>
//             </div>
//           )}
//         </section>

//         {/* ======================================================
//             🎓 COLLEGE DETAILS (Always visible)
//         ====================================================== */}
//         {course.collegeId && (
//           <section className="bg-gray-800 border border-blue-500/20 rounded-2xl p-6">
//             <h3 className="text-lg font-semibold text-blue-400 mb-3">
//               College Information
//             </h3>
//             <p className="flex items-center gap-2 text-gray-300">
//               <Building2 size={14} /> {course.collegeId.name}
//             </p>
//             <p className="flex items-center gap-2 text-gray-400 mt-1 text-sm">
//               <MapPin size={14} /> {course.collegeId.location?.city},{" "}
//               {course.collegeId.location?.state}
//             </p>
//           </section>
//         )}

//         {/* ======================================================
//             🧭 LEARNING PATH SECTION (Fix)
//         ====================================================== */}
//         <section className="bg-gray-800 border border-blue-500/20 rounded-2xl p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-blue-400">
//               Learning Path
//             </h3>

//             {!learningPath ? (
//               <button
//                 onClick={handleCreateLearningPath}
//                 className="flex items-center gap-2 px-3 py-1 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-sm"
//               >
//                 <Plus size={14} /> Create Learning Path
//               </button>
//             ) : (
//               <button
//                 onClick={handleAddStage}
//                 className="flex items-center gap-2 px-3 py-1 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-sm"
//               >
//                 <Plus size={14} /> Add Stage
//               </button>
//             )}
//           </div>

//           {/* No path yet */}
//           {!learningPath ? (
//             <p className="text-gray-400 text-sm">
//               No learning path exists yet. Click “Create Learning Path” above.
//             </p>
//           ) : (
//             <>
//               {/* Stage Form */}
//               <div className="grid sm:grid-cols-2 gap-3 mb-4">
//                 <input
//                   type="text"
//                   placeholder="Stage Title"
//                   value={stageForm.title}
//                   onChange={(e) =>
//                     setStageForm({ ...stageForm, title: e.target.value })
//                   }
//                   className="bg-gray-700 p-2 rounded"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Description"
//                   value={stageForm.description}
//                   onChange={(e) =>
//                     setStageForm({ ...stageForm, description: e.target.value })
//                   }
//                   className="bg-gray-700 p-2 rounded"
//                 />
//               </div>

//               {/* Stages */}
//               {learningPath.stages?.length ? (
//                 <div className="space-y-3">
//                   {learningPath.stages.map((stage, idx) => (
//                     <div
//                       key={idx}
//                       className="bg-gray-700/60 p-4 rounded-xl border border-blue-500/20"
//                     >
//                       <div
//                         className="flex justify-between items-center cursor-pointer"
//                         onClick={() =>
//                           setExpandedStage(expandedStage === idx ? null : idx)
//                         }
//                       >
//                         <div className="flex items-center gap-2">
//                           {expandedStage === idx ? (
//                             <ChevronDown size={16} />
//                           ) : (
//                             <ChevronRight size={16} />
//                           )}
//                           <h4 className="font-semibold text-blue-300">
//                             {stage.title}
//                           </h4>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedStageId(stage._id);
//                             setShowModuleModal(true);
//                           }}
//                           className="text-xs flex items-center gap-1 bg-blue-600/30 hover:bg-blue-600/50 px-2 py-1 rounded"
//                         >
//                           <Plus size={10} /> Module
//                         </button>
//                       </div>

//                       {expandedStage === idx && (
//                         <div className="mt-3 pl-5 space-y-2">
//                           {stage.modules?.map((mod, mIdx) => (
//                             <div
//                               key={mIdx}
//                               className="bg-gray-800/70 p-3 rounded-lg border border-gray-600/30"
//                             >
//                               <p className="text-sm font-semibold text-gray-200">
//                                 {mod.title}
//                               </p>
//                               <p className="text-xs text-gray-400">
//                                 {mod.overview}
//                               </p>
//                               <div className="flex gap-2 mt-2 flex-wrap">
//                                 {mod.resources?.map((r, rIdx) => (
//                                   <span
//                                     key={rIdx}
//                                     className="text-xs bg-blue-600/20 px-2 py-1 rounded"
//                                   >
//                                     <FileText
//                                       size={10}
//                                       className="inline mr-1"
//                                     />
//                                     {r.title}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-sm">
//                   No stages yet. Add one using “Add Stage”.
//                 </p>
//               )}
//             </>
//           )}
//         </section>
//       </main>

//       {/* ======================================================
//           🧩 ADD MODULE MODAL
//       ====================================================== */}
//       {showModuleModal && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-blue-500/20 relative">
//             <button
//               onClick={() => setShowModuleModal(false)}
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
//             >
//               <X size={18} />
//             </button>
//             <h3 className="text-xl font-semibold mb-4 text-blue-400">
//               Add Module
//             </h3>
//             <div className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Module Title"
//                 value={moduleForm.title}
//                 onChange={(e) =>
//                   setModuleForm({ ...moduleForm, title: e.target.value })
//                 }
//                 className="bg-gray-700 p-2 rounded w-full"
//               />
//               <textarea
//                 placeholder="Overview"
//                 rows={3}
//                 value={moduleForm.overview}
//                 onChange={(e) =>
//                   setModuleForm({ ...moduleForm, overview: e.target.value })
//                 }
//                 className="bg-gray-700 p-2 rounded w-full"
//               />
//               <input
//                 type="text"
//                 placeholder="Estimated Time"
//                 value={moduleForm.estimatedTime}
//                 onChange={(e) =>
//                   setModuleForm({
//                     ...moduleForm,
//                     estimatedTime: e.target.value,
//                   })
//                 }
//                 className="bg-gray-700 p-2 rounded w-full"
//               />
//               <button
//                 onClick={handleAddModule}
//                 className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg w-full"
//               >
//                 Save Module
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
