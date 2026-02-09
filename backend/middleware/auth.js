const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * @desc Protect routes using JWT verification
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.redirect("/");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user)
      return res.status(401).json({ message: "User not found or inactive." });

    if (req.user.status !== "active")
      return res
        .status(403)
        .json({ message: "Your account is inactive or banned." });

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ message: "Token verification failed." });
  }
};

/**
 * @desc Role-based authorization
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied." });
    next();
  };
};
