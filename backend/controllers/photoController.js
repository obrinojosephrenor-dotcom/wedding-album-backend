import { supabase }            from "../lib/supabase.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinaryService.js";

const MAX_PHOTOS = 25;

export async function uploadPhoto(req, res) {
  const { guest_id } = req.body;
  const file = req.file;

  if (!file)     return res.status(400).json({ error: "No file provided" });
  if (!guest_id) return res.status(400).json({ error: "Guest ID required" });

  // Check guest exists and photo limit
  const { data: guest, error: guestErr } = await supabase
    .from("guests")
    .select("id, photo_count")
    .eq("id", guest_id)
    .single();

  if (guestErr || !guest) return res.status(404).json({ error: "Guest not found" });

  if (guest.photo_count >= MAX_PHOTOS) {
    return res.status(429).json({
      error:      "limit_reached",
      message:    `You've reached your ${MAX_PHOTOS}-photo memory limit. Thank you for celebrating with us!`,
      photo_count: guest.photo_count,
    });
  }

  try {
    // Upload to Cloudinary
    const { original_url, thumbnail_url, medium_url, public_id } =
      await uploadToCloudinary(file.buffer, guest_id, file.originalname);

    // Save photo record
    const { data: photo, error: photoErr } = await supabase
      .from("photos")
      .insert({
        guest_id,
        image_url:     original_url,
        thumbnail_url,
        medium_url,
        public_id,
      })
      .select()
      .single();

    if (photoErr) throw new Error(photoErr.message);

    // Increment photo count
    await supabase.rpc("increment_photo_count", { guest_id_param: guest_id });
    // (We create this function below as a Postgres function)

    res.status(201).json({
      photo,
      photos_remaining: MAX_PHOTOS - (guest.photo_count + 1),
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload photo. Please try again." });
  }
}

export async function getPhotos(req, res) {
  const limit  = parseInt(req.query.limit  || "24");
  const offset = parseInt(req.query.offset || "0");

  const { data, error, count } = await supabase
    .from("photos")
    .select(`
      id, image_url, thumbnail_url, medium_url, uploaded_at,
      guests(guest_name)
    `, { count: "exact" })
    .order("uploaded_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    photos: data.map(p => ({
      ...p,
      guest_name: p.guests?.guest_name || "Anonymous",
    })),
    total: count,
    limit,
    offset,
  });
}