import express from "express";
import {
  createContactMessage,
  getAllMessages,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/contact", createContactMessage);
router.get("/contact", getAllMessages);

export default router;
