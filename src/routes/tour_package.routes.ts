import express from 'express'
import { create, getAll, getBYId, remove, update} from '../controllers/tour_package.controllers';
import { authenticate } from '../middlewares/authorization.middleware';

const router = express.Router()

router.post('/', create)
router.get('/',authenticate(), getAll)
router.get('/:id',getBYId)
router.put('/:id',update)
router.delete('/:id',remove)


export default router; 

