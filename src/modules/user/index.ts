import { Router } from 'express';
import UserController from './user.controller';
const router = Router();

router.route('/v1/user/register')
  .post(UserController.register);

router.route('/v1/login')
  .post(UserController.login);

export default router;
