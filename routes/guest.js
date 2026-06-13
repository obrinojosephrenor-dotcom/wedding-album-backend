const express = require("express");
const router = express.Router();

const { createGuest, getGuest } = require("../controllers/guestController");

router.post("/", createGuest);
router.get("/:id", getGuest);

module.exports = router;