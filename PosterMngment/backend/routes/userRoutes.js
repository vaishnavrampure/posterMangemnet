import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getAllUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { checkPermissions } from '../middleware/checkPermissionsMiddleware.js';
const router = express.Router();


router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logoutUser); 

router.route('/')
  .get(checkPermissions(['manage_users']), getAllUsers);

router.route('/:id')
  .put(checkPermissions(['manage_users']), updateUser)
  .delete(checkPermissions(['manage_users']), deleteUser);

export default router;
