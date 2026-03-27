const College = require("../models/College");
const CollegeOwner = require("../models/CollegeOwner");
const User = require("../models/User");

/* -------------------------------------------------------------------
   🧠 Helper: Check if user is authorized to manage a college
------------------------------------------------------------------- */
const verifyOwnership = async (user, collegeId) => {
  if (user.role === "admin") return true;
  const owner = await CollegeOwner.findOne({ userId: user._id });
  if (!owner) return false;
  return owner.linkedColleges.some(
    (id) => id.toString() === collegeId.toString()
  );
};

/* -------------------------------------------------------------------
   @desc   Add new college
   @route  POST /api/colleges
   @access Private (college owner)
------------------------------------------------------------------- */
exports.addCollege = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "college" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const {
      name,
      location,
      logo,
      bannerImage,
      accreditation,
      establishedYear,
      collegeType,
      email,
      website,
      description,
      socialLinks,
    } = req.body;

    // Validate required field
    if (!name) {
      return res.status(400).json({ message: "College name is required." });
    }

    // ✅ Create new college
    const newCollege = new College({
      ownerId: user._id,
      name,
      location,
      logo,
      bannerImage,
      accreditation,
      establishedYear,
      collegeType,
      email,
      website,
      description,
      socialLinks,
      status: "pending",
    });

    await newCollege.save();

    // ✅ Link to CollegeOwner
    let ownerProfile = await CollegeOwner.findOne({ userId: user._id });
    if (!ownerProfile) {
      ownerProfile = new CollegeOwner({
        userId: user._id,
        organizationName: user.name,
        linkedColleges: [newCollege._id],
      });
    } else {
      ownerProfile.linkedColleges.push(newCollege._id);
    }

    await ownerProfile.save();

    res.status(201).json({
      message: "College added successfully (pending admin approval).",
      college: newCollege,
    });
  } catch (err) {
    console.error("❌ Error adding college:", err);
    res.status(500).json({ message: "Server error adding college." });
  }
};

/* -------------------------------------------------------------------
   @desc   Get all colleges by logged-in owner
   @route  GET /api/colleges/my
   @access Private (college owner)
------------------------------------------------------------------- */
exports.getMyColleges = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "college" && user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const colleges = await College.find({ ownerId: user._id }).sort({
      createdAt: -1,
    });

    if (!colleges || !colleges.length) {
      return res.status(404).json({ message: "No colleges found." });
    }

    res.json({
      count: colleges.length,
      colleges: colleges,
    });
  } catch (err) {
    console.error("❌ Error fetching owner colleges:", err);
    res.status(500).json({ message: "Server error fetching colleges." });
  }
};

/* -------------------------------------------------------------------
   @desc   Update college details
   @route  PUT /api/colleges/:id
   @access Private (college owner / admin)
------------------------------------------------------------------- */
exports.updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const isOwner = await verifyOwnership(user, id);
    if (!isOwner && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this college." });
    }

    const updates = req.body;
    const updated = await College.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "College not found." });
    }

    res.json({ message: "College updated successfully.", college: updated });
  } catch (err) {
    console.error("❌ Error updating college:", err);
    res.status(500).json({ message: "Server error updating college." });
  }
};

/* -------------------------------------------------------------------
   @desc   Get single college details (public or private)
   @route  GET /api/colleges/:id
   @access Public
------------------------------------------------------------------- */
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college)
      return res.status(404).json({ message: "College not found." });

    res.json(college);
  } catch (err) {
    console.error("❌ Error fetching college:", err);
    res.status(500).json({ message: "Server error fetching college details." });
  }
};

/* -------------------------------------------------------------------
   @desc   Admin approve / deactivate a college
   @route  PATCH /api/colleges/:id/status
   @access Private (admin)
------------------------------------------------------------------- */
exports.updateCollegeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const college = await College.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!college)
      return res.status(404).json({ message: "College not found." });

    res.json({ message: `College status updated to ${status}`, college });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error updating college status." });
  }
};

/* -------------------------------------------------------------------
   @desc   Delete a college (owner or admin)
   @route  DELETE /api/colleges/:id
   @access Private
------------------------------------------------------------------- */
exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const isOwner = await verifyOwnership(user, id);
    if (!isOwner && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this college." });
    }

    const deleted = await College.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "College not found." });

    // Remove from owner's linked list
    await CollegeOwner.updateOne(
      { userId: user._id },
      { $pull: { linkedColleges: id } }
    );

    res.json({ message: "College deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting college:", err);
    res.status(500).json({ message: "Server error deleting college." });
  }
};
