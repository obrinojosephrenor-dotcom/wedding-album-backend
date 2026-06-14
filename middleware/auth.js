export function adminAuth(req, res, next) {
  const pw = req.headers['x-admin-password']
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized.' })
  }
  next()
}
