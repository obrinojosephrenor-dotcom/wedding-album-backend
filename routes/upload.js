import express from "express";
import uploadLimiter from "../middleware/uploadLimiter.js";

import upload from "../middleware/upload.js";


const router = express.Router();





router.post(

"/",

uploadLimiter,


upload.single("photo"),


async(req,res)=>{


try{


console.log(
"UPLOAD:",
req.file
);



if(!req.file){

return res.status(400)
.json({

error:"No photo uploaded"

});


}



res.json({

message:
"Photo uploaded successfully",


file:req.file


});



}

catch(err){


console.error(err);



res.status(500)
.json({

error:
"Upload failed"

});


}


}



);



export default router;