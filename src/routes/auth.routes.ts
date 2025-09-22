import express from 'express'
import { login, register,logout, profile } from '../controllers/auth.controllers'
import { authenticate } from '../middlewares/authorization.middleware'
import { ALLUserAndAdmins } from '../types/global.types'
const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authenticate(ALLUserAndAdmins), profile)

export default router; 

