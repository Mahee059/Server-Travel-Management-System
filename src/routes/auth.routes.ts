import express from 'express'
import { login, register,logout, profile } from '../controllers/auth.controller'
const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', profile)

export default router; 

