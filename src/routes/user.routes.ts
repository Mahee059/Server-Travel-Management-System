import express from 'express'
import { deleteUser, getAllUser, getById, updateProfile} from '../controllers/user.controllers'
import { authenticate } from '../middlewares/authorization.middleware'
import { AllAdmins, ALLUserAndAdmins, OnlyUser } from '../types/global.types'
import { upload } from '../middlewares/file-uploader.middleware'

const uploader = upload()
const router = express.Router()

router.get('/',authenticate(AllAdmins),getAllUser)
router.get('/:userId',authenticate(ALLUserAndAdmins),getById)
router.put('/:userId',authenticate(ALLUserAndAdmins),uploader.single('profile_image'), updateProfile)
router.delete('/:userId', authenticate(ALLUserAndAdmins), deleteUser)



export default router
