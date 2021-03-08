import { Router } from 'express';
import multer from 'multer';
import UserController from './user.controller';

import multerConfig from '../../helpers/multerConfig';
const router = Router();

router.route('/v1/user/register')
  .post(multer(multerConfig).single('photoProfile'), UserController.register);

router.route('/v1/login')
  .post(UserController.login);

export default router;
