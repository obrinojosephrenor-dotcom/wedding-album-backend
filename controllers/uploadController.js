import { supabase } from '../config/supabase.js'
import { v4 as uuid } from 'uuid'

const MAX_UPLOADS = 25

// POST /api/upload  — multer already processed req.file
export async function uploadPhoto(req, res, next) {
  try {
    const { guest_id, guest_name } = req.body

    if (!guest_id) return res.status(400).json({ error: 'guest_id is required.' })
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

    // Verify guest + check limit
    const { data: guest, error: gErr } = await supabase
      .from('guests')
      .select('id, name, upload_count')
      .eq('id', guest_id)
      .single()

    if (gErr || !guest) return res.status(404).json({ error: 'Guest not found.' })
    if (guest.upload_count >= MAX_UPLOADS) {
      return res.status(403).json({ error: 'Upload limit reached.' })
    }

    // Save photo record
    const photo = {
      id:         uuid(),
      guest_id,
      guest_name: guest_name || guest.name,
      image_url:  req.file.path,
      public_id:  req.file.filename,
      created_at: new Date().toISOString(),
    }

    const { data: saved, error: pErr } = await supabase
      .from('photos')
      .insert(photo)
      .select()
      .single()

    if (pErr) throw pErr

    // Increment counter
    await supabase
      .from('guests')
      .update({ upload_count: guest.upload_count + 1 })
      .eq('id', guest_id)

    res.status(201).json({ photo: saved, upload_count: guest.upload_count + 1 })
  } catch (err) { next(err) }
}