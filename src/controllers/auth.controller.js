import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config(); // THIS IS IMPORTANT


const signToken = (admin) => {
  return jwt.sign({ id: admin._id, email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Signup (create first admin manually or allow signup)

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken(admin);

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please provide email and password" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin);

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password — generate token and send reset link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Please provide email" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "No admin with that email" });

    // token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    admin.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <p>You requested a password reset. Click the link below to reset your password (valid 15 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail({ to: admin.email, subject: "Password Reset", html: message });

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password — use token from URL + new password

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password)
      return res.status(400).json({ message: "Token and password required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin)
      return res.status(400).json({ message: "Token is invalid or expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    const jwtToken = signToken(admin);

    res.json({ message: "Password reset successful", token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
