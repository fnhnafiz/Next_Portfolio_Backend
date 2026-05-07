import express from "express";

import { createFooter, getFooter, updateFooter } from "../controllers/footer.controller.js";

const router = express.Router();

router.post("/footer", createFooter);
router.get("/footer", getFooter);
router.put("/footer", updateFooter);

export default router;