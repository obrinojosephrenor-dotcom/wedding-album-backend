import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import guestRoutes from "./routes/guest.js";
import adminRoutes from "./routes/admin.js";
import photoRoutes from "./routes/photo.js";
import uploadRoutes from "./routes/upload.js";


const app = express();


/* ─────────────────────────────────────────
   CORS CONFIGURATION
───────────────────────────────────────── */

const allowedOrigins = [
  "https://wedding-album-frontend-dun.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];


app.use(cors({

  origin: function(origin, callback){

    // Allow requests without origin
    // (Postman, mobile apps, server-side calls)
    if(!origin){
      return callback(null, true);
    }


    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    }


    return callback(
      new Error("CORS blocked: Origin not allowed")
    );

  },


  methods:[
    "GET",
    "POST",
    "DELETE",
    "OPTIONS"
  ],


  allowedHeaders:[
    "Content-Type",
    "x-admin-password"
  ],


  credentials:true

}));


// Handle browser preflight requests
app.options("*", cors());



/* ─────────────────────────────────────────
   BODY PARSERS
───────────────────────────────────────── */

app.use(express.json({
  limit:"50mb"
}));


app.use(express.urlencoded({

  extended:true,

  limit:"50mb"

}));



/* ─────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────── */


app.get("/", (req,res)=>{

  res.json({

    message:"Wedding Album API Running 🌸",

    status:"ok"

  });

});



app.get("/health",(req,res)=>{

  res.json({

    status:"ok",

    timestamp:new Date().toISOString()

  });

});



/* ─────────────────────────────────────────
   API ROUTES
───────────────────────────────────────── */


app.use(
  "/api/guest",
  guestRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/photos",
  photoRoutes
);


app.use(
  "/api/upload",
  uploadRoutes
);



/* ─────────────────────────────────────────
   GLOBAL ERROR HANDLER
───────────────────────────────────────── */


app.use((err,req,res,next)=>{


  console.error("SERVER ERROR:", err);


  if(err.message?.includes("Only JPG")){

    return res.status(400).json({

      error:err.message

    });

  }



  if(err.code === "LIMIT_FILE_SIZE"){

    return res.status(400).json({

      error:"File must be under 10MB"

    });

  }



  if(err.message?.includes("CORS")){

    return res.status(403).json({

      error:"CORS blocked"

    });

  }



  res.status(
    err.status || 500
  )
  .json({

    error:
      err.message ||
      "Internal Server Error"

  });


});



/* ─────────────────────────────────────────
   START SERVER
───────────────────────────────────────── */


const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{


  console.log(
    `🌸 Wedding Album API running on port ${PORT}`
  );


});