import express from "express";
import { createGuest, getGuest } from "../controllers/guestController.js";

const router = express.Router();

router.post("/", createGuest);
router.get("/:id", getGuest);

export default router;