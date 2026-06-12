import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'nikki-michael-wedding',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ quality: 'auto:good', fetch_format: 'auto', width: 2400, crop: 'limit' }],
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp']
    if (!ok.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WEBP images are allowed.'), false)
    }
    cb(null, true)
  },
})

export { cloudinary }
