import { Router }      from "express";
import { uploadPhoto, getPhotos } from "../controllers/photoController.js";
import { upload }      from "../middleware/upload.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/upload", uploadLimiter, upload.single("photo"), uploadPhoto);
router.get("/",        getPhotos);

export default router;