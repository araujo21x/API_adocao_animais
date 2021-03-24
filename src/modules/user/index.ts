import { Router } from 'express';
import multer from 'multer';

import auth from '../../middlewares/auth';
import controller from './user.controller';

import multerConfig from '../../helpers/multerConfig';
const router = Router();

router.route('/v1/user/register')
  .post(multer(multerConfig).single('photoProfile'), controller.register);

router.route('/v1/user/edit')
  .put(auth, multer(multerConfig).single('photoProfile'), controller.edit);

router.route('/v1/login')
  .post(controller.login);

router.route('/v1/recoverPassword')
  .post(controller.recoverPassword);

router.route('/v1/user/favoritePet')
  .post(auth, controller.favoritePet)
  .delete(auth, controller.disfavorPet);

router.route('/v1/user/searchLocation')
  .get(controller.allOngsLocation);

router.route('/v1/user/searchUser')
  .get(auth, controller.getUserHeaderData);
export default router;
