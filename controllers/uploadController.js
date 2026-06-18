import { supabase } from "../config/supabase.js";
import { cloudinary } from "../config/cloudinary.js";
import { v4 as uuid } from "uuid";


const MAX_UPLOADS = 25;


function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "nikki-michael-wedding",
        transformation: [
          {
            quality: "auto:good",
            fetch_format: "auto",
            width: 2400,
            crop: "limit",
          },
        ],
      },

      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );


    stream.end(buffer);

  });
}



export async function uploadPhoto(req, res, next) {

  try {

    const { guest_id, guest_name } = req.body;


    if (!guest_id)
      return res.status(400)
      .json({ error:"guest_id is required." });


    if (!req.file)
      return res.status(400)
      .json({ error:"No file uploaded." });



    const { data: guest, error:gErr } =
      await supabase
      .from("guests")
      .select("id,name,upload_count")
      .eq("id", guest_id)
      .single();



    if (gErr || !guest)
      return res.status(404)
      .json({error:"Guest not found."});



    if (guest.upload_count >= MAX_UPLOADS)
      return res.status(403)
      .json({error:"Upload limit reached."});



    const uploaded =
      await uploadToCloudinary(req.file.buffer);



    const photo = {

      id: uuid(),

      guest_id,

      guest_name:
        guest_name || guest.name,

      image_url:
        uploaded.secure_url,

      public_id:
        uploaded.public_id,

      created_at:
        new Date().toISOString()

    };



    const {data:saved,error:pErr} =
      await supabase
      .from("photos")
      .insert(photo)
      .select()
      .single();



    if(pErr) throw pErr;



    await supabase
    .from("guests")
    .update({
      upload_count:
      guest.upload_count + 1
    })
    .eq("id",guest_id);



    res.status(201).json({

      photo:saved,

      upload_count:
      guest.upload_count + 1

    });



  } catch(err){

    next(err);

  }

}