import { Router } from 'express'
import { getStats, getAllGuests, getAllPhotos } from '../controllers/adminController.js'
import { adminAuth } from '../middleware/auth.js'

const router = Router()
router.use(adminAuth)
router.get('/stats',  getStats)
router.get('/guests', getAllGuests)
router.get('/photos', getAllPhotos)
export default router
