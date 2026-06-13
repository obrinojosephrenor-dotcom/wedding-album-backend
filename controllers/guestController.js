import { supabase } from '../config/supabase.js'
import { v4 as uuid } from 'uuid'

// POST /api/guest
export async function createGuest(req, res, next) {
  try {
    const { name, phone = '' } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'Guest name is required.' })

    const guest = {
      id:           uuid(),
      name:         name.trim().slice(0, 80),
      phone:        phone.trim().slice(0, 24),
      upload_count: 0,
      created_at:   new Date().toISOString(),
    }

    const { data, error } = await supabase.from('guests').insert(guest).select().single()
    if (error) throw error

    res.status(201).json(data)
  } catch (err) { next(err) }
}

// GET /api/guest/:id
export async function getGuest(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, name, phone, upload_count, created_at')
      .eq('id', req.params.id)
      .single()

    if (error || !data) return res.status(404).json({ error: 'Guest not found.' })
    res.json(data)
  } catch (err) { next(err) }
}