import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


import guestRoutes from "./routes/guest.js";
import adminRoutes from "./routes/admin.js";
import photoRoutes from "./routes/photo.js";
import uploadRoutes from "./routes/upload.js";



const app = express();



/*
=================================
RENDER PROXY FIX
=================================
*/

app.set(
  "trust proxy",
  true
);



/*
=================================
CORS
=================================
*/


const allowedOrigins = [

  "https://wedding-album-frontend-dun.vercel.app",

  "http://localhost:5173"

];



app.use(cors({

  origin:function(origin,callback){


    if(!origin){

      return callback(null,true);

    }


    if(allowedOrigins.includes(origin)){

      return callback(null,true);

    }


    callback(
      new Error("CORS blocked")
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



app.options("*",cors());




/*
=================================
BODY
=================================
*/


app.use(express.json({

 limit:"50mb"

}));


app.use(express.urlencoded({

 extended:true,

 limit:"50mb"

}));





/*
=================================
TEST
=================================
*/


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





/*
=================================
ROUTES
=================================
*/


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





/*
=================================
ERROR HANDLER
=================================
*/


app.use((err,req,res,next)=>{


console.error(
"SERVER ERROR:",
err
);



res.status(
err.status || 500
)
.json({

error:
err.message ||
"Server Error"

});


});





const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{


console.log(

`🌸 Wedding Album API running on ${PORT}`

);


});