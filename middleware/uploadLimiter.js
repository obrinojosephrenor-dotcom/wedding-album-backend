import rateLimit from "express-rate-limit";



const uploadLimiter = rateLimit({

windowMs:
60 * 60 * 1000,


max:25,


standardHeaders:true,


legacyHeaders:false,


message:{

error:
"Upload limit reached. Maximum 25 photos allowed."

}


});



export default uploadLimiter;