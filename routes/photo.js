const express = require("express");
const router = express.Router();

const { getPhotos, deletePhoto } = require("../controllers/photoController");
const { adminAuth } = require("../middleware/auth");

router.get("/", getPhotos);
router.delete("/:id", adminAuth, deletePhoto);

module.exports = router;