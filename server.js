import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import guestRoutes from "./routes/guest.js";
import photoRoutes from "./routes/photo.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

import { generalLimiter } from "./middleware/rateLimiter.js";


dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;



// SECURITY

app.use(
  helmet({
    crossOriginResourcePolicy:false
  })
);



// CORS

app.use(
cors({

origin:[
process.env.FRONTEND_URL,
"https://wedding-album-frontend-dun.vercel.app",
"http://localhost:5173"
],

credentials:true

})
);



// LOGGER

app.use(
morgan("dev")
);



// BODY

app.use(
express.json({
limit:"50mb"
})
);


app.use(
express.urlencoded({

extended:true,

limit:"50mb"

})
);



// RATE LIMIT

app.use(generalLimiter);




// TEST ROOT

app.get("/",(req,res)=>{

res.json({

message:"Wedding Album API Running 🌸",

status:"ok"

});

});




// HEALTH

app.get("/health",(req,res)=>{

res.json({

status:"ok"

});

});




// ROUTES

app.use(
"/api/guest",
guestRoutes
);


app.use(
"/api/photos",
photoRoutes
);


app.use(
"/api/admin",
adminRoutes
);


app.use(
"/api/upload",
uploadRoutes
);




// 404

app.use((req,res)=>{

res.status(404).json({

error:"Not found"

});

});




// ERROR

app.use((err,req,res,next)=>{

console.error(err);


res.status(500).json({

error:err.message || "Server error"

});

});




app.listen(PORT,()=>{

console.log(
`🌸 Server running on port ${PORT}`
);

});