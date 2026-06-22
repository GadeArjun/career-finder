// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// /**
//  * @desc Protect routes using JWT verification
//  */
// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.redirect("/");
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user)
//       return res.status(401).json({ message: "User not found or inactive." });

//     if (req.user.status !== "active")
//       return res
//         .status(403)
//         .json({ message: "Your account is inactive or banned." });

//     next();
//   } catch (err) {
//     console.error("Auth Middleware Error:", err);
//     res.status(401).json({ message: "Token verification failed." });
//   }
// };

// /**
//  * @desc Role-based authorization
//  */
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role))
//       return res.status(403).json({ message: "Access denied." });
//     next();
//   };
// };



const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * In-memory user cache
 * Key: userId
 * Value: { expiresAt, payload }
 */
const USER_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const userCache = new Map();

const getCachedValue = (cache, key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.payload;
};

const setCachedValue = (cache, key, payload, ttl = USER_CACHE_TTL) => {
  cache.set(key, {
    payload,
    expiresAt: Date.now() + ttl,
  });
};

/**
 * @desc Protect routes using JWT verification
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = String(decoded.id);

    // 1. Try cache first
    let user = getCachedValue(userCache, userId);

    // 2. Fallback to DB only on cache miss
    if (!user) {
      user = await User.findById(decoded.id)
        .select("_id name avatar role isVerified profileCompletion status updatedAt")
        .lean();

      if (!user) {
        return res.status(401).json({ message: "User not found or inactive." });
      }

      setCachedValue(userCache, userId, user);
    }

    if (user.status !== "active") {
      return res
        .status(403)
        .json({ message: "Your account is inactive or banned." });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Token verification failed." });
  }
};

/**
 * @desc Role-based authorization
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

/**
 * Optional helper if you want to clear auth cache after user updates
 */
exports.clearUserCache = (userId) => {
  if (!userId) return;
  userCache.delete(String(userId));
};