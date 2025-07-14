import express from 'express';
import { getallUser, getBYId, deleteUser, updateProfile } from '../controllers/user.controllers';

const router = express.Router();

// Route to get all users
router.get('/', getallUser);

// Route to get a user by ID
router.get('/:userId', getBYId);

// Route to delete a user by ID
router.delete('/:userId', deleteUser);
 

// Route to update a user by ID
router.put('/update/:userId', updateProfile);


export default router;
