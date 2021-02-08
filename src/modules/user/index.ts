import { Router } from 'express';
import UserController from './user.controller';
import auth from '../../middlewares/auth';
const router = Router();

router.route('/user')
  .post(UserController.register)
  .get(auth, UserController.listUsers);

router.route('/login')
  .post(UserController.login);

export default router;
