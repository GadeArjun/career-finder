const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔧 Utility: Count all non-empty fields dynamically
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
        countFields(value); // recursive for nested objects
      } else {
        total++;
        if (value !== undefined && value !== null && value !== "") filled++;
      }
    }
  }

  countFields(user);

  const completion = total > 0 ? Math.round((filled / total) * 100) : 0;
  return completion > 100 ? 100 : completion;
}

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log({ name, email, password, role });

  try {
    let user = await User.findOne({ email });
    console.log({ user });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    user.personalInfo.name = name;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log({ token, user: { id: user._id, name, email, role } });

    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  try {
    const user = await User.findOne({ email });
    console.log({ user });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Dynamic profile completion
    const completion = calculateProfileCompletion(user);

    if (user.profileCompletion !== completion) {
      user.profileCompletion = completion;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log({
      token,
      user: {
        ...user,
        profileCompletion: completion,
        id: user._id,
      },
    });

    const updatedUser = await User.findOne({ email }).lean();

    res.json({
      token,
      user: {
        ...updatedUser,
        id: user._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { ...updateUserData } = req.body;
  console.log({ updateUserData });

  try {
    const user = await User.findById(req.user._id || req.user.id);
    console.log({ user });

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Dynamic profile completion
    const completion = calculateProfileCompletion(user);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      {
        ...updateUserData,
        personalInfo: {
          name: updateUserData.personalInfo?.name || updateUserData.name,
          contact:
            updateUserData.personalInfo?.contact || updateUserData.contact,
          address:
            updateUserData.personalInfo?.address || updateUserData.address,
          theme: updateUserData.personalInfo?.theme || updateUserData.theme,
          notifications:
            updateUserData.personalInfo?.notifications ||
            updateUserData.notifications,
        },
        profileCompletion: completion,
      },

      { new: true }
    );
    console.log({ updatedUser });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
