import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import guestRoutes from "./routes/guest.js";
import adminRoutes from "./routes/admin.js";
import photoRoutes from "./routes/photo.js";
import uploadRoutes from "./routes/upload.js";


const app = express();


/* ── CORS ───────────────────────────────── */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "x-admin-password"
  ],
}));


/* ── Handle preflight OPTIONS ───────────── */
app.options("/{*splat}", cors());


/* ── Body parsers ───────────────────────── */
app.use(express.json({
  limit: "50mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));



/* ── Health routes ───────────────────────── */

app.get("/", (req,res)=>{
  res.json({
    message:"Wedding Album API Running",
    status:"ok"
  });
});


app.get("/health",(req,res)=>{
  res.json({
    status:"ok",
    ts:new Date().toISOString()
  });
});



/* ── API Routes ─────────────────────────── */

app.use("/api/guest", guestRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/photos", photoRoutes);

app.use("/api/upload", uploadRoutes);



/* ── Global Error Handler ───────────────── */

app.use((err,req,res,next)=>{

  console.error("[ERROR]", err);


  if(err.message?.includes("Only JPG")){
    return res.status(400).json({
      error:err.message
    });
  }


  if(err.code === "LIMIT_FILE_SIZE"){
    return res.status(400).json({
      error:"File must be under 10MB."
    });
  }


  res.status(err.status || 500).json({
    error:err.message || "Server Error"
  });

});



const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

 console.log(
   `🌸 Server running on port ${PORT}`
 );

});