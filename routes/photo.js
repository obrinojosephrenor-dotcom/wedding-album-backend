import { Router } from "express";
import { getPhotos, deletePhoto } from "../controllers/photoController.js";
import { adminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getPhotos);
router.delete("/:id", adminAuth, deletePhoto);

export default router;