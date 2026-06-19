import { Router }     from "express";
import { adminAuth }  from "../middleware/auth.js";
import {
  getStats, deletePhoto, getGuestList, generateQR, downloadAllPhotos
} from "../controllers/adminController.js";

const router = Router();

router.use(adminAuth); // all admin routes require auth

router.get("/stats",         getStats);
router.get("/guests",        getGuestList);
router.get("/qr",            generateQR);
router.get("/download",      downloadAllPhotos);
router.delete("/photos/:id", deletePhoto);

export default router;