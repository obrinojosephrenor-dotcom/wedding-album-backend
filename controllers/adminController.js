import { supabase } from '../config/supabase.js'

// GET /api/admin/stats
export async function getStats(req, res, next) {
  try {
    const [
      { count: totalGuests },
      { count: totalPhotos },
      { data: topGuest },
    ] = await Promise.all([
      supabase.from('guests').select('id', { count: 'exact', head: true }),
      supabase.from('photos').select('id', { count: 'exact', head: true }),
      supabase
        .from('guests')
        .select('name, upload_count')
        .order('upload_count', { ascending: false })
        .limit(1)
        .single(),
    ])

    res.json({
      totalGuests:     totalGuests  || 0,
      totalPhotos:     totalPhotos  || 0,
      avgPerGuest:     totalGuests  ? Math.round((totalPhotos || 0) / totalGuests) : 0,
      mostActiveGuest: topGuest?.name         || null,
      mostActiveCount: topGuest?.upload_count || 0,
    })
  } catch (err) { next(err) }
}

// GET /api/admin/guests
export async function getAllGuests(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, name, phone, upload_count, created_at')
      .order('upload_count', { ascending: false })

    if (error) throw error
    res.json({ guests: data || [] })
  } catch (err) { next(err) }
}

// GET /api/admin/photos?page=1&search=
export async function getAllPhotos(req, res, next) {
  try {
    const page   = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit  = 30
    const offset = (page - 1) * limit
    const search = (req.query.search || '').trim()

    let q = supabase
      .from('photos')
      .select('id, guest_id, guest_name, image_url, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) q = q.ilike('guest_name', `%${search}%`)

    const { data: photos, error, count } = await q
    if (error) throw error

    res.json({
      photos:  photos || [],
      total:   count  || 0,
      page,
      hasMore: offset + limit < (count || 0),
    })
  } catch (err) { next(err) }
}