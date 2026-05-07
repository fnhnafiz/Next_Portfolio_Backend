import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import upload from "../utils/cloudinaryUpload.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
// Multer error handler wrapper
const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary Error:", err.message);
      console.error("Full error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// 🔐 Admin Protected Routes
// router.post("/",  upload.single("image"), createProject);
router.post("/", protect, uploadMiddleware, createProject);
router.put("/:id", protect, uploadMiddleware, updateProject);
router.delete("/:id", protect, deleteProject);

// 🌐 Public Routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
