import express from 'express'
import { book,cancel,confirm,getAllBookings, getAllBookingsByTourPackage, getById, getUsersBooking, update } from '../controllers/booking.controllers'
import { authenticate } from '../middlewares/authorization.middleware'
import { AllAdmins, ALLUserAndAdmins, OnlyUser } from '../types/global.types'



const router = express.Router()

router.post('/',authenticate(OnlyUser),book)
router.put('/confirm/:id',authenticate(AllAdmins),confirm)
router.put('/cancel/:id',authenticate(AllAdmins),cancel)
router.get('/',authenticate(AllAdmins),getAllBookings)
router.get('/:id',authenticate(ALLUserAndAdmins),getById)
router.get('/package/:packageId',authenticate(AllAdmins),getAllBookingsByTourPackage)
router.get('/user',authenticate(OnlyUser),getUsersBooking)
router.put('/:id',authenticate(OnlyUser),update)


export default router