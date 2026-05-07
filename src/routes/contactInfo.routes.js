import express from "express";
import {
  createContactInfo,
  getContactInfo,
  updateContactInfo
} from "../controllers/contactInfo.controller.js";

const router = express.Router();

router.post("/contact-info", createContactInfo);
router.get("/contact-info", getContactInfo);
router.put("/contact-info", updateContactInfo);

export default router;
