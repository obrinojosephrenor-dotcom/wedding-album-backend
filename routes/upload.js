import express from "express";

import uploadLimiter from "../middleware/uploadLimiter.js";

import upload 
from "../middleware/upload.js";

import {
uploadPhoto
}
from "../controllers/uploadController.js";



const router = express.Router();



router.post(

"/",

uploadLimiter,

upload.single("photo"),

uploadPhoto

);



export default router;