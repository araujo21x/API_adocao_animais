import { Router } from 'express';
import UserController from './user.controller';
const router = Router();

router.route('/v1/user/register')
  .post(UserController.register);

export default router;
