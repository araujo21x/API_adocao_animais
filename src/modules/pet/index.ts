import { Router } from 'express';
import auth from '../../middlewares/auth';
import multer from 'multer';

import multerConfig from '../../helpers/multerConfig';
import controller from './pet.controller';
const router = Router();

router.route('/v1/pets/register')
  .post(auth, multer(multerConfig).array('photos'), controller.register);

router.route('/v1/pets/:id')
  .put(auth, controller.edit)
  .delete(auth, controller.delete);

router.route('/v1/petsPhoto/:id')
  .delete(auth, controller.deletePhoto)
  .post(auth, multer(multerConfig).single('photo'), controller.registerPhoto);

router.route('/v1/pets/lost/oldest').get(controller.oldestLost);
router.route('/v1/pets/lost/searchLocation').get(controller.lostLocation);
router.route('/v1/searchLocation').get(controller.searchLocation);
router.route('/v1/pet/filter').get(controller.filterPets);
router.route('/v1/pet/filterByUser').get(controller.filterByUser);
router.route('/v1/pets/ofUserAuth').get(auth, controller.ofUserAuth);
router.route('/v1/pets/searchOng').get(controller.ofUser);
router.route('/v1/pets/seeToo').get(controller.seeToo);
router.route('/v1/pet/userFavorites').get(auth, controller.userFavoritesPets);
router.route('/v1/pets/show/:id').get(controller.showPetById);

export default router;
