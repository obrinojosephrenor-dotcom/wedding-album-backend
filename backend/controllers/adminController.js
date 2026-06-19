import { supabase }          from "../lib/supabase.js";
import { deleteFromCloudinary, getStorageUsage } from "../services/cloudinaryService.js";
import * as archiver from "archiver";
import https                 from "https";

export async function getStats(req, res) {
  const [guestsRes, photosRes, storageRes] = await Promise.all([
    supabase.from("guests").select("id", { count: "exact", head: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }),
    getStorageUsage(),
  ]);

  res.json({
    total_guests:  guestsRes.count || 0,
    total_photos:  photosRes.count || 0,
    storage:       storageRes,
  });
}

export async function deletePhoto(req, res) {
  const { id } = req.params;

  const { data: photo } = await supabase
    .from("photos").select("id, guest_id, public_id").eq("id", id).single();

  if (!photo) return res.status(404).json({ error: "Photo not found" });

  // Delete from Cloudinary
  if (photo.public_id) await deleteFromCloudinary(photo.public_id);

  // Delete from DB
  await supabase.from("photos").delete().eq("id", id);

  // Decrement guest count
  await supabase.rpc("decrement_photo_count", { guest_id_param: photo.guest_id });

  res.json({ success: true });
}

export async function getGuestList(req, res) {
  const { data, error } = await supabase
    .from("guests")
    .select("id, guest_name, photo_count, created_at")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ guests: data });
}

export async function generateQR(req, res) {
  const QRCode = (await import("qrcode")).default;
  const url    = req.query.url || process.env.FRONTEND_URL;
  const format = req.query.format || "png";

  if (format === "svg") {
    const svg = await QRCode.toString(url, { type: "svg", width: 300, margin: 2 });
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Content-Disposition", `attachment; filename="wedding-qr.svg"`);
    return res.send(svg);
  }

  const buffer = await QRCode.toBuffer(url, {
    type:   "png",
    width:  400,
    margin: 2,
    color:  { dark: "#C7B8A3", light: "#FAF8F5" },
  });
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", `attachment; filename="wedding-qr.png"`);
  res.send(buffer);
}

export async function downloadAllPhotos(req, res) {
  const { data: photos } = await supabase
    .from("photos")
    .select("image_url, uploaded_at, guests(guest_name)");

  if (!photos?.length) return res.status(404).json({ error: "No photos found" });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="wedding-album.zip"`);

  const archive = archiver("zip", { zlib: { level: 5 } });
  archive.pipe(res);

  for (const photo of photos) {
    const guestName = (photo.guests?.guest_name || "guest").replace(/[^a-z0-9]/gi, "_");
    const ts        = new Date(photo.uploaded_at).getTime();
    const filename  = `${guestName}-${ts}.jpg`;

    await new Promise((resolve, reject) => {
      https.get(photo.image_url, stream => {
        archive.append(stream, { name: filename });
        stream.on("end",   resolve);
        stream.on("error", reject);
      }).on("error", reject);
    });
  }

  archive.finalize();
}