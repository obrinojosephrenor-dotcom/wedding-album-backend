import { Router } from "express";
import { registerGuest, getGuestById } from "../controllers/guestController.js";

const router = Router();

router.post("/register", registerGuest);
router.get("/:id",       getGuestById);

export default router;