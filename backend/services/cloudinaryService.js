import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

/**
 * Upload a buffer/stream to Cloudinary under wedding-album/{guestId}/
 * Returns { original_url, thumbnail_url, medium_url, public_id }
 */
export async function uploadToCloudinary(fileBuffer, guestId, originalName) {
  return new Promise((resolve, reject) => {
    const folder    = `wedding-album/${guestId}`;
    const publicId  = `${Date.now()}-${originalName.replace(/\.[^/.]+$/, "")}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id:       publicId,
        resource_type:   "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        eager: [
          { width: 200, height: 200, crop: "fill", quality: "auto" },       // thumb
          { width: 800,             crop: "scale", quality: "auto" },       // medium
        ],
        eager_async: false,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          original_url:  result.secure_url,
          thumbnail_url: result.eager?.[0]?.secure_url || result.secure_url,
          medium_url:    result.eager?.[1]?.secure_url || result.secure_url,
          public_id:     result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export async function getStorageUsage() {
  const result = await cloudinary.api.usage();
  return {
    used_bytes:  result.storage?.usage,
    used_gb:     (result.storage?.usage / 1e9).toFixed(2),
    total_bytes: result.storage?.limit,
  };
}

export { cloudinary };