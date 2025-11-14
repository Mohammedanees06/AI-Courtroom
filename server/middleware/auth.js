import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, Authorization denied" });
  }

  try {
    // If token was sent as "Bearer token", split
    const realToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const decoded = jwt.verify(realToken, ENV.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
