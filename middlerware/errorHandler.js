export function errorHandler(err, _req, res, _next) {
  console.error('[ERROR]', err.message || err)

  if (err.message?.includes('Only JPG'))  return res.status(400).json({ error: err.message })
  if (err.code === 'LIMIT_FILE_SIZE')     return res.status(400).json({ error: 'File must be under 10 MB.' })

  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({ error: message })
}
