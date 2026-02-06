import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Clock,
  BookOpen,
  IndianRupee,
  ChevronLeft,
  Plus,
  Calendar,
  Award,
  Layers,
  ArrowRight,
  Search,
  Users,
} from "lucide-react";
import { useCourses } from "../../context/CourseContext";

const CollegeCoursesPage = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const { collegeCourses, loading, getCoursesByCollege, deleteCourse } =
    useCourses();

  useEffect(() => {
    if (collegeId) {
      getCoursesByCollege(collegeId);
    }
  }, [collegeId]);

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to remove the course: ${name}?`)
    ) {
      await deleteCourse(id);
    }
  };
  console.log({ collegeCourses });

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading Curriculum...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* --- TOP NAVIGATION --- */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition mb-8 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition"
          />
          Back to College Profile
        </button>

        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-gray-800 pb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Academic Programs
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Manage and view the {collegeCourses.length} active courses offered
              by this institution.
            </p>
          </div>

          <Link
            to={`/college/course/add/${collegeId}`}
            className="group flex items-center gap-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 p-1 pr-6 rounded-2xl transition-all"
          >
            <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-900/20 group-hover:scale-105 transition">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                New Program
              </p>
              <p className="text-white font-bold">Add Course</p>
            </div>
          </Link>
        </div>

        {/* --- COURSES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collegeCourses.length > 0 ? (
            collegeCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                navigate={navigate}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full py-32 bg-gray-900/20 rounded-[40px] border border-dashed border-gray-800 text-center">
              <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400">
                No Courses Registered
              </h3>
              <p className="text-gray-600 mt-2 max-w-sm mx-auto">
                Start by adding your first degree or certification program to
                the college catalog.
              </p>
              <Link
                to={`/college/course/add/${collegeId}`}
                className="inline-flex items-center gap-2 mt-8 text-blue-500 hover:text-blue-400 font-bold"
              >
                Create your first course <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: COURSE CARD ---
const CourseCard = ({ course, navigate, onDelete }) => {
  return (
    <div
      onClick={() => navigate(`/college/course/edit/${course._id}`)}
      className="group relative bg-gray-900 border border-gray-800 rounded-[32px] p-7 hover:border-blue-500/50 hover:bg-gray-900/80 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Visual Accent */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/10 blur-[50px] group-hover:bg-blue-600/20 transition"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-gray-950 border border-gray-800 rounded-2xl group-hover:rotate-6 transition duration-500">
          <GraduationCap className="text-blue-500" size={28} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black bg-blue-900/30 text-blue-400 px-3 py-1 rounded-lg uppercase tracking-widest mb-2">
            {course.degreeType || "UG"}
          </span>
          <span className="text-[10px] font-bold bg-gray-800 text-gray-500 px-3 py-1 rounded-lg uppercase tracking-widest">
            {course.duration} Years
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition leading-tight mb-2">
          {course.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6">
          {course.specialization || "General Specialization"} •{" "}
          {course.department || "Academic"}
        </p>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-950/50 p-3 rounded-2xl border border-gray-800/50">
          <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">
            Total Semesters
          </p>
          <div className="flex items-center gap-2 text-gray-300 font-bold">
            <Layers size={14} className="text-blue-500" />{" "}
            {course.semesters || 8}
          </div>
        </div>
        <div className="bg-gray-950/50 p-3 rounded-2xl border border-gray-800/50">
          <p className="text-[10px] text-gray-600 font-bold uppercase mb-1">
            Seats
          </p>
          <div className="flex items-center gap-2 text-gray-300 font-bold">
            <Users size={14} className="text-blue-500" /> {course.intake || 60}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-800/50 mt-auto">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
            Annual Fee
          </p>
          <p className="text-lg font-black text-white">
            {course.feeStructure?.scholarshipAvailable ? (
              <span className="flex items-center gap-1">
                ₹{course.feeStructure?.perYear}{" "}
                <Award size={14} className="text-yellow-500" />
              </span>
            ) : (
              `₹${course.feeStructure?.perYear || "N/A"}`
            )}
          </p>
        </div>
        <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-900/40">
          <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );
};

export default CollegeCoursesPage;
