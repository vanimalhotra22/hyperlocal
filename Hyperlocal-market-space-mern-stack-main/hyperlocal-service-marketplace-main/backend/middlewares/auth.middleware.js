import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import handleError from "../utils/handleError.js";

/* Middleware to check if the user is authenticated */
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return handleError(res, "Unauthorized: No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decodedValue = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from token payload
    const user = await User.findById(decodedValue.id).select("-password");
    if (!user) return handleError(res, "User does not exists", 404);

    // Attach user to request for downstream access
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") return handleError(res, "Unauthorized: Token expired", 401);
    return handleError(res, "Unauthorized: Invalid token", 401);
  }
};

/* Middleware to check if the user has the required role */
export const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return handleError(res, "Access denied: You are not authorized to perform this action", 403);
    }
    next();
  };
