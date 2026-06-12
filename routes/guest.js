import { Router } from 'express'
import { createGuest, getGuest } from '../controllers/guestController.js'

const router = Router()
router.post('/',    createGuest)
router.get('/:id',  getGuest)
export default router
