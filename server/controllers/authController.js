import { OAuth2Client } from "google-auth-library";
import { ENV } from "../config/env.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

// Helper function to generate JWT token
const generateToken = (userId) =>
  jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "15d" });

// User registration handler
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists with given email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user record
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    // Return token and user info
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server error occurred while registering" });
  }
};

// User login handler
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Prevent password login for Google-authenticated users
    if (user.googleAuth)
      return res.status(400).json({ message: "Please use Google Login instead" });

    // Verify password correctness
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    // Return token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error occurred while logging in" });
  }
};

// Google OAuth login handler
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Find existing user or create new user with Google authentication flag
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-oauth", // Placeholder password for OAuth users
        googleAuth: true,
      });
    }

    const token = generateToken(user._id);

    // Return token and user info
    res.json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};
