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



// Security
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



app.use(
  morgan("dev")
);



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



app.use(generalLimiter);




// TEST ROUTE

app.get("/",(req,res)=>{

  res.json({

    message:"Wedding Album API Running 🌸",

    status:"ok"

  });

});



app.get("/health",(req,res)=>{

  res.json({

    status:"ok"

  });

});




// API ROUTES

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


res.status(
err.status || 500
)
.json({

error:
err.message || "Server Error"

});


});




app.listen(
PORT,
()=>{

console.log(
`🌸 Server running on port ${PORT}`
);

});