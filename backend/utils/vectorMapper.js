exports.mapStudentToCourseVector = (student) => ({
  analytical: student.analytical || 0,
  technical: student.technical || 0,
  creative: student.creative || 0,
  communication: student.verbal || 0,
  research: student.scientific || 0,
  leadership: student.social || 0,
});

exports.mapStudentToJobVector = (student) => ({
  analytical: student.analytical || 0,
  technical: student.technical || 0,
  creative: student.creative || 0,
  communication: student.verbal || 0,
  leadership: student.social || 0,
  research: student.scientific || 0,
});
