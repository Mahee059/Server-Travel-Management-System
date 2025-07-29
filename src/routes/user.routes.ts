import express from 'express';
import { getallUser, getBYId, deleteUser, updateProfile } from '../controllers/user.controllers';
import { authenticate } from '../middlewares/authorization.middleware';
import { AllAdmins, ALLUserAndAdmins } from '../types/global.types';


const router = express.Router();

router.get('/',authenticate(AllAdmins),getallUser)
router.get('/:userId',authenticate(ALLUserAndAdmins),getBYId)
router.put('/:userId',authenticate(ALLUserAndAdmins),updateProfile)


router.delete('/:userId', deleteUser);
 





export default router
