import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/reviewController.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), handleFileUpload);

export default router;
