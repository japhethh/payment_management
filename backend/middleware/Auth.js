import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  // Get token from Authorization header instead of cookies
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.userId; // Attach full user object to request

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    let message = "Not authorized";
    if (error instanceof jwt.TokenExpiredError) {
      message = "Session expired, please login again";
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid token";
    }

    res.status(401).json({
      success: false,
      message,
      code: "AUTH_FAILED",
    });
  }
});
