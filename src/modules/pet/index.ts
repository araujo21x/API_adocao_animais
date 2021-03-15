import { Router } from 'express';
import auth from '../../middlewares/auth';
import multer from 'multer';

import multerConfig from '../../helpers/multerConfig';
import controller from './pet.controller';
const router = Router();

router.route('/v1/pets/register')
  .post(auth, multer(multerConfig).array('photos'), controller.register);

router.route('/v1/pets/edit/:id')
  .put(auth, controller.edit);
export default router;
