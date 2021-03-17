import { Router } from 'express';
import multer from 'multer';

import auth from '../../middlewares/auth';
import UserController from './user.controller';

import multerConfig from '../../helpers/multerConfig';
const router = Router();

router.route('/v1/user/register')
  .post(multer(multerConfig).single('photoProfile'), UserController.register);

router.route('/v1/user/edit')
  .put(auth, multer(multerConfig).single('photoProfile'), UserController.edit);

router.route('/v1/login')
  .post(UserController.login);

router.route('/v1/recoverPassword')
  .post(UserController.recoverPassword);

export default router;
