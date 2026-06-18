import { Router } from "express";
import { upload } from "../config/cloudinary.js";
import { uploadPhoto } from "../controllers/uploadController.js";

const router = Router();

router.post("/", upload.single("photo"), uploadPhoto);

export default router;