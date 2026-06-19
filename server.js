import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import guestRoutes from "./routes/guests.js";
import photoRoutes from "./routes/photos.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";

import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;



/*
=================================
SECURITY
=================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);



/*
=================================
CORS
=================================
*/

const allowedOrigins = [

  process.env.FRONTEND_URL,

  "https://wedding-album-frontend-dun.vercel.app",

  "http://localhost:5173"

];


app.use(
  cors({

    origin(origin, callback){


      // allow Postman / Render internal requests
      if(!origin){

        return callback(null,true);

      }


      if(
        allowedOrigins.includes(origin)
      ){

        return callback(null,true);

      }


      console.log(
        "Blocked CORS origin:",
        origin
      );


      callback(
        new Error("CORS blocked")
      );

    },


    credentials:true,


    methods:[

      "GET",
      "POST",
      "DELETE",
      "OPTIONS"

    ],


    allowedHeaders:[

      "Content-Type",
      "x-admin-password"

    ]


  })
);



/*
=================================
MIDDLEWARE
=================================
*/


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



app.use(
  generalLimiter
);





/*
=================================
TEST ROUTES
=================================
*/


// Render health check
app.get("/health",(req,res)=>{


  res.json({

    status:"ok"

  });


});



// Root test
app.get("/",(req,res)=>{


  res.json({

    message:"Wedding Album API Running 🌸",

    status:"ok"

  });


});





/*
=================================
API ROUTES
=================================
*/


app.use(

  "/api/guests",

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






/*
=================================
404 HANDLER
=================================
*/


app.use(

(req,res)=>{


  res.status(404)

  .json({

    error:"Not found"

  });


}

);






/*
=================================
ERROR HANDLER
=================================
*/


app.use(

(err,req,res,next)=>{


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


}

);






app.listen(

PORT,

()=>{


console.log(

`🌸 Server running on port ${PORT}`

);


}

);