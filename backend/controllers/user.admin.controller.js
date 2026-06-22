const mongoose = require("mongoose");
const User = require("../models/User");

/* =========================================================
   HELPERS
========================================================= */

const VALID_ROLES = ["student", "college", "company", "admin"];
const VALID_STATUSES = ["active", "inactive", "banned"];
const VALID_THEMES = ["light", "dark"];

function toBoolean(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  return Boolean(value);
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function trimString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function safeUserSelect() {
  return "-password";
}

function buildUserResponse(user) {
  if (!user) return null;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    status: user.status,
    lastLogin: user.lastLogin,
    lastActivity: user.lastActivity,
    profileCompletion: user.profileCompletion,
    contact: user.contact,
    settings: user.settings,
    studentProfileId: user.studentProfileId,
    collegeOwnerId: user.collegeOwnerId,
    companyOwnerId: user.companyOwnerId,
    resumeUrl: user.resumeUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function applyAdminUserUpdates(user, body) {
  if (body.name !== undefined) user.name = trimString(body.name, user.name);
  if (body.email !== undefined) user.email = trimString(body.email, user.email).toLowerCase();

  if (body.role !== undefined) {
    if (!VALID_ROLES.includes(body.role)) {
      throw new Error("Invalid role.");
    }
    user.role = body.role;
  }

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      throw new Error("Invalid status.");
    }
    user.status = body.status;
  }

  if (body.isVerified !== undefined) {
    user.isVerified = toBoolean(body.isVerified, user.isVerified);
  }

  if (body.avatar !== undefined) user.avatar = trimString(body.avatar, user.avatar);
  if (body.resumeUrl !== undefined) user.resumeUrl = trimString(body.resumeUrl, user.resumeUrl);

  if (body.profileCompletion !== undefined) {
    user.profileCompletion = Math.max(0, Math.min(100, toNumber(body.profileCompletion, user.profileCompletion)));
  }

  if (body.lastLogin !== undefined) {
    const d = new Date(body.lastLogin);
    if (!Number.isNaN(d.getTime())) user.lastLogin = d;
  }

  if (body.lastActivity !== undefined) {
    const d = new Date(body.lastActivity);
    if (!Number.isNaN(d.getTime())) user.lastActivity = d;
  }

  if (body.contact !== undefined && typeof body.contact === "object" && body.contact !== null) {
    user.contact = {
      phone: body.contact.phone !== undefined ? trimString(body.contact.phone, user.contact?.phone) : user.contact?.phone,
      address: body.contact.address !== undefined ? trimString(body.contact.address, user.contact?.address) : user.contact?.address,
      city: body.contact.city !== undefined ? trimString(body.contact.city, user.contact?.city) : user.contact?.city,
      state: body.contact.state !== undefined ? trimString(body.contact.state, user.contact?.state) : user.contact?.state,
      country: body.contact.country !== undefined ? trimString(body.contact.country, user.contact?.country || "India") : user.contact?.country || "India",
    };
  }

  if (body.settings !== undefined && typeof body.settings === "object" && body.settings !== null) {
    const nextTheme =
      body.settings.theme !== undefined && VALID_THEMES.includes(body.settings.theme)
        ? body.settings.theme
        : user.settings?.theme || "dark";

    user.settings = {
      notifications:
        body.settings.notifications !== undefined
          ? toBoolean(body.settings.notifications, user.settings?.notifications)
          : user.settings?.notifications ?? true,
      theme: nextTheme,
      language:
        body.settings.language !== undefined
          ? trimString(body.settings.language, user.settings?.language || "en")
          : user.settings?.language || "en",
    };
  }

  if (body.studentProfileId !== undefined) {
    user.studentProfileId = body.studentProfileId || undefined;
  }

  if (body.collegeOwnerId !== undefined) {
    user.collegeOwnerId = body.collegeOwnerId || undefined;
  }

  if (body.companyOwnerId !== undefined) {
    user.companyOwnerId = body.companyOwnerId || undefined;
  }

  return user;
}

async function findUserOrFail(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  const user = await User.findById(userId)
    .select(safeUserSelect())
    .populate("studentProfileId")
    .populate("collegeOwnerId")
    .populate("companyOwnerId");

  return user;
}

/* =========================================================
   GET ALL USERS
========================================================= */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "",
      status = "",
      isVerified,
    } = req.query;

    const query = {};

    if (role && VALID_ROLES.includes(role)) {
      query.role = role;
    }

    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (isVerified !== undefined && isVerified !== "") {
      query.isVerified = toBoolean(isVerified, false);
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { "contact.phone": { $regex: term, $options: "i" } },
        { "contact.city": { $regex: term, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select(safeUserSelect())
        .sort({ createdAt: -1 })
        .skip(skip)
        // .limit(limitNum)
        .lean(),

      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users.map(buildUserResponse),
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

/* =========================================================
   GET SINGLE USER
========================================================= */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await findUserOrFail(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

/* =========================================================
   UPDATE USER (FULL ADMIN EDIT)
   - Updates profile, contact, settings, role, verify, status
========================================================= */
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId).select(safeUserSelect());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const originalEmail = user.email;

    applyAdminUserUpdates(user, req.body);

    if (user.email !== originalEmail) {
      const duplicate = await User.findOne({
        email: user.email,
        _id: { $ne: userId },
      }).select("_id");

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("updateUserByAdmin error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update user.",
    });
  }
};

/* =========================================================
   UPDATE STATUS ONLY
========================================================= */
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const user = await User.findById(userId).select(safeUserSelect());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("updateUserStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status.",
    });
  }
};

/* =========================================================
   UPDATE VERIFY ONLY
========================================================= */
exports.updateUserVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId).select(safeUserSelect());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isVerified = toBoolean(isVerified, user.isVerified);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User verification updated successfully.",
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("updateUserVerification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update verification.",
    });
  }
};

/* =========================================================
   UPDATE ROLE ONLY
========================================================= */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const user = await User.findById(userId).select(safeUserSelect());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update role.",
    });
  }
};

/* =========================================================
   DELETE USER (OPTIONAL HARD DELETE)
========================================================= */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const deleted = await User.findByIdAndDelete(userId).select("_id");

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};