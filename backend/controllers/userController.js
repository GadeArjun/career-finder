const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* -------------------------------------------------------------
   Utility: Generate JWT Token
------------------------------------------------------------- */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/* -------------------------------------------------------------
   Utility: Calculate Profile Completion
------------------------------------------------------------- */
function calculateProfileCompletion(user) {
  let filled = 0;
  let total = 0;

  function countFields(obj) {
    if (!obj || typeof obj !== "object") return;

    for (const key of Object.keys(obj)) {
      if (["_id", "__v", "createdAt", "updatedAt", "password"].includes(key))
        continue;

      const value = obj[key];
      if (Array.isArray(value)) {
        total++;
        if (value.length > 0) filled++;
      } else if (typeof value === "object" && value !== null) {
        countFields(value);
      } else {
        total++;
        if (value !== undefined && value !== null && value !== "") filled++;
      }
    }
  }

  countFields(user);
  return Math.min(Math.round((filled / (total || 1)) * 100), 100);
}

/* -------------------------------------------------------------
   @desc    Register new user
   @route   POST /api/users/register
   @access  Public
------------------------------------------------------------- */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    console.log({ existingUser });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const newUser = new User({ name, email, password, role });
    newUser.profileCompletion = calculateProfileCompletion(newUser);
    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileCompletion: newUser.profileCompletion,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   @desc    Login user
   @route   POST /api/users/login
   @access  Public
------------------------------------------------------------- */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });

    // Select + password for verification
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const sanitized = user.toObject();
    delete sanitized.password;

    res.json({
      token,
      user: {
        ...sanitized,
        id: user._id,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
    console.log({
      token,
      user: {
        ...sanitized,
        id: user._id,
        profileCompletion: calculateProfileCompletion(user),
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   @desc    Get logged-in user profile
   @route   GET /api/users/profile
   @access  Private
------------------------------------------------------------- */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   @desc    Update user profile
   @route   PUT /api/users/profile
   @access  Private
------------------------------------------------------------- */
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id || req.user.id);

    if (!user) return res.status(404).json({ message: "User not found." });

    // Merge allowed updates
    Object.assign(user, updates);

    // Recalculate profile completion
    user.profileCompletion = calculateProfileCompletion(user);
    user.lastActivity = new Date();

    await user.save();
    const sanitized = user.toObject();
    delete sanitized.password;

    res.json(sanitized);
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   @desc    Admin - Get all users
   @route   GET /api/users
   @access  Private/Admin
------------------------------------------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   @desc    Admin - Delete user
   @route   DELETE /api/users/:id
   @access  Private/Admin
------------------------------------------------------------- */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.deleteOne();
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
