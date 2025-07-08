import express from 'express'
import { getAllUser, getBYId } from '../controllers/user.controllers'


const router = express.Router()
router.get ('/',getAllUser)

router.get('/:userId', getBYId)

export default router
