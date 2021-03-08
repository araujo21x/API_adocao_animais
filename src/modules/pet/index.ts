import { Router } from 'express';
import auth from '../../middlewares/auth';
import controller from './pet.controller';
const router = Router();

router.route('/v1/pets/register')
  .post(auth, controller.register);

export default router;
