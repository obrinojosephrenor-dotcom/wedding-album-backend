import { supabase } from "../config/supabase.js";
import { cloudinary } from "../config/cloudinary.js";


// GET /api/photos?page=1&limit=20

export async function getPhotos(req,res,next){

try{


const page =
Math.max(
1,
parseInt(req.query.page,10) || 1
);


const limit =
Math.min(
50,
parseInt(req.query.limit,10) || 20
);



const offset =
(page - 1) * limit;



const {

data:photos,

error,

count

} = await supabase

.from("photos")

.select(
`
id,
image_url,
public_id,
created_at,

guests(
name
)

`,
{
count:"exact"
}

)

.order(
"created_at",
{
ascending:false
}

)

.range(
offset,
offset + limit - 1
);



if(error)
throw error;



res.json({

photos: photos || [],

total: count || 0,

page,

limit,

hasMore:
offset + limit < (count || 0)

});



}
catch(err){

next(err);

}


}





// DELETE

export async function deletePhoto(req,res,next){


try{


const {id}=req.params;



const {

data:photo,

error:fErr

}=await supabase

.from("photos")

.select(
"id,public_id"
)

.eq("id",id)

.single();



if(fErr || !photo)

return res.status(404)
.json({

error:"Photo not found"

});




if(photo.public_id){

await cloudinary.uploader.destroy(
photo.public_id
);

}




const {error:dErr}=

await supabase

.from("photos")

.delete()

.eq("id",id);



if(dErr)
throw dErr;



res.json({

success:true,

id

});


}
catch(err){

next(err);

}


}