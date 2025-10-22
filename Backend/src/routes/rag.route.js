// routes/rag.route.js
import express from "express";
import { askFromPdf } from "../controllers/rag.controller.js";
const router = express.Router();

router.post("/ask", askFromPdf);

export default router;
