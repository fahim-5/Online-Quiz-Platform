import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not authorized to access this route", 401));
    }

    // Verify token (fall back to default secret if not configured)
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    const decoded = jwt.verify(token, secret);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Not authorized to access this route", 401));
  }
};

export const authorize = (...roles) => {
  // Expand roles: treat `admin` as including `teacher` for this platform
  const allowed = new Set();
  roles.forEach((r) => {
    allowed.add(r);
    if (r === "admin") {
      allowed.add("teacher");
    }
  });

  return (req, res, next) => {
    if (!allowed.has(req.user.role)) {
      return next(new AppError("Not authorized to access this route", 403));
    }
    next();
  };
};
