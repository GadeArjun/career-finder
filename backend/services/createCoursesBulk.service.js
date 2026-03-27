const College = require("../models/College");
const Course = require("../models/Course");
const { getYouTubeCourses } = require("./youtube.service");

exports.createBulkCourse = async (courses = [], collegeId) => {
  try {
    if (!Array.isArray(courses) || courses.length === 0) {
      throw new Error("Courses array is required");
    }

    const college = await College.findById(collegeId);
    if (!college) {
      throw new Error("College not found");
    }

    // 🔥 Attach collegeId + fetch YouTube data
    const coursesWithExtras = await Promise.all(
      courses.map(async (course) => {
        let youtubeData = [];

        try {
          // Call YouTube service using course name
          youtubeData = await getYouTubeCourses(
            course.title + " for " + college.name + " course"
          );
        } catch (err) {
          console.error("YouTube fetch failed:", err.message);
        }

        return {
          ...course,
          collegeId: collegeId,
          youtubeVideos: youtubeData, // 👈 store videos
        };
      })
    );

    // Insert multiple courses
    const createdCourses = await Course.insertMany(coursesWithExtras);

    // Update totalCourses count
    college.totalCourses = (college.totalCourses || 0) + createdCourses.length;
    await college.save();

    console.log({
      message: "Courses created successfully",
      courses: createdCourses,
    });

    return {
      message: "Courses created successfully",
      courses: createdCourses,
    };
  } catch (err) {
    console.error("Bulk Create Course Error:", err);
    throw err;
  }
};

exports.createBulkCollege = async (colleges = [], ownerId) => {
  try {
    if (!Array.isArray(colleges) || colleges.length === 0) {
      throw new Error("Colleges array is required");
    }

    if (!ownerId) {
      throw new Error("OwnerId is required");
    }

    // 🔥 Attach ownerId to each college
    const collegesWithOwner = colleges.map((college) => ({
      ...college,
      ownerId: ownerId,
    }));

    // 🚀 Insert all colleges at once
    const createdColleges = await College.insertMany(collegesWithOwner);

    createdColleges.map((clg) => {
      console.log({
        name: clg.name,
        _id: clg._id,
        ownerId: clg.ownerId,
      });
    });

    return {
      message: "Colleges created successfully",
      total: createdColleges.length,
      colleges: createdColleges,
    };
  } catch (err) {
    console.error("Bulk Create College Error:", err);
    throw err;
  }
};
