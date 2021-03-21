import { config } from 'dotenv';
import { getConnection } from 'typeorm';
import path from 'path';

import startConnection from '../src/database/index';
import { upload } from '../src/helpers/cloudinary';
import { password, emailONG, emailCommon } from './fields';

import User from '../src/database/entity/User.entity';
import Address from '../src/database/entity/Address.entity';
import Pet from '../src/database/entity/Pet.entity';
import PetPhoto from '../src/database/entity/PetPhoto.entity';
import Favorite from '../src/database/entity/Favorite.entity';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const userFactory = (
  name: string,
  whatsApp: string,
  telephone: string,
  type: string,
  email: string,
  photoProfile: string,
  idPhotoProfile: string,
  lastName?: string
): User => {
  const newUser = new User();
  newUser.name = name;
  newUser.lastName = lastName!;
  newUser.whatsApp = whatsApp;
  newUser.telephone = telephone;
  newUser.type = type;
  if (type === 'common') newUser.birthday = new Date('1997-02-21');
  newUser.email = email;
  newUser.password = password;
  newUser.photoProfile = photoProfile;
  newUser.idPhotoProfile = idPhotoProfile;
  return newUser;
};

const addressFactory = (
  user: User,
  uf: string,
  city: string,
  postalCode: string,
  street: string,
  district: string,
  addressNumber: string,
  complement: string,
  latitude?: number,
  longitude?: number
): Address => {
  const newAddress = new Address();
  newAddress.uf = uf;
  newAddress.city = city;
  newAddress.postalCode = postalCode;
  newAddress.street = street;
  newAddress.district = district;
  newAddress.addressNumber = addressNumber;
  newAddress.complement = complement;
  newAddress.user = user;
  newAddress.latitude = latitude!;
  newAddress.longitude = longitude!;
  return newAddress;
};

const petFactory = (
  user: User,
  name: string,
  sex: string,
  status: string,
  species: string,
  phase: string,
  castration: string,
  race: string,
  vaccination: string,
  eyeColor: string,
  hairColor: string,
  feature: string
): Pet => {
  const pet = new Pet();
  pet.user = user;
  pet.name = name;
  pet.sex = sex;
  pet.status = status;
  pet.species = species;
  pet.phase = phase;
  pet.castration = castration;
  pet.race = race;
  pet.vaccination = vaccination;
  pet.eyeColor = eyeColor;
  pet.hairColor = hairColor;
  pet.feature = feature;
  return pet;
};

const petPhotoFactory = (
  pet: Pet,
  photo: string,
  idPhoto: string
): any => {
  const petPhoto = new PetPhoto();
  petPhoto.pet = pet;
  petPhoto.photo = photo;
  petPhoto.idPhoto = idPhoto;
  return petPhoto;
};

const favoriteFactory = (
  pet: Pet,
  user: User
): Favorite => {
  const favorite = new Favorite();
  favorite.pet = pet;
  favorite.user = user;
  return favorite;
};

async function Dump () {
  try {
    await startConnection();
    await getConnection().transaction(async transaction => {
      const userLogin = await transaction.save(userFactory('loginRegister', '74987456321', '74987456321', 'common', 'login@example.com', 'fasdfasdf', 'fadsdfasd', 'test login'));
      await transaction.save(addressFactory(userLogin, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente'));

      const userOngPet = await transaction.save(userFactory('ongRegister', '74987456321', '74987456321', 'ong', emailONG(1), 'fasdfasdf', 'fadsdfasd'));
      await transaction.save(addressFactory(userOngPet, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente', -10.4287, -40.1012));

      const photoUserCommon = await upload(path.resolve(__dirname, 'files', 'imgProfile1.png'), 'User', 'Edite User Common 1');
      const userEditCommon = await transaction.save(userFactory('editCommon', '74987456321', '74987456321', 'common', emailCommon(2), photoUserCommon.url, photoUserCommon.idPhoto, 'test edit common'));
      await transaction.save(addressFactory(userEditCommon, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente'));

      const photoUserONG = await upload(path.resolve(__dirname, 'files', 'imgProfile1.png'), 'User', 'Edite User ONG 1');
      const userEditONG = await transaction.save(userFactory('editONG', '74987456321', '74987456321', 'ong', emailONG(3), photoUserONG.url, photoUserONG.idPhoto));
      await transaction.save(addressFactory(userEditONG, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente', -10.4287, -40.1012));

      const photoUserEditPet = await upload(path.resolve(__dirname, 'files', 'imgProfile1.png'), 'User', 'Edite pet 1');
      const userEditPet = await transaction.save(userFactory('editPet', '74987456321', '74987456321', 'common', emailCommon(3), photoUserEditPet.url, photoUserEditPet.idPhoto, 'test edit pet'));
      await transaction.save(addressFactory(userEditPet, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente'));
      await transaction.save(petFactory(userEditPet, 'loganEdit1', 'male', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Problema na pata traseira e nas unhas.'));
      await transaction.save(petFactory(userLogin, 'erroEditId', 'male', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Problema na pata traseira e nas unhas.'));

      const userPhotoPet = await transaction.save(userFactory('PhotoPet', '74987456321', '74987456321', 'common', emailCommon(4), 'asdfasdfasdfasdf', 'asdfasdfasdfasdf', 'add e delete photo pet'));
      await transaction.save(petFactory(userPhotoPet, 'pet add photo 1', 'male', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Nenhum.'));

      const deletePhotoPet = await transaction.save(petFactory(userPhotoPet, 'pet delete photo 1', 'female', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Nenhum.'));
      const deletePhotoPet1 = await upload(path.resolve(__dirname, 'files', 'imgPet1.jpg'), 'Pet', 'Pet Remove 1');
      const deletePhotoPet2 = await upload(path.resolve(__dirname, 'files', 'imgPet2.jpg'), 'Pet', 'Pet Remove 2');
      await transaction.save(petPhotoFactory(deletePhotoPet, deletePhotoPet1.url, deletePhotoPet1.idPhoto));
      await transaction.save(petPhotoFactory(deletePhotoPet, deletePhotoPet2.url, deletePhotoPet2.idPhoto));

      const deletePet = await transaction.save(petFactory(userPhotoPet, 'pet delete', 'female', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Nenhum.'));
      const deletePet1 = await upload(path.resolve(__dirname, 'files', 'imgPet1.jpg'), 'Pet', 'Pet delete 1');
      await transaction.save(petPhotoFactory(deletePet, deletePet1.url, deletePet1.idPhoto));

      await transaction.save(userFactory('recoveryPassword', '74987456321', '74987456321', 'ong', emailONG(4), 'sssss', 'ddddd'));

      const userFavoriteCreate = await transaction.save(userFactory('userFavoriteCreate', '74987456321', '74987456321', 'common', emailCommon(5), 'asdfasdfasdfasdf', 'asdfasdfasdfasdf', 'favorite pet'));
      await transaction.save(petFactory(userFavoriteCreate, 'favorite pet', 'male', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Nenhum.'));

      const userFavoriteDelete = await transaction.save(userFactory('userFavoriteDelete', '74987456321', '74987456321', 'common', emailCommon(6), 'asdfasdfasdfasdf', 'asdfasdfasdfasdf', 'user Favorite Delete'));
      const petdisfavor = await transaction.save(petFactory(userFavoriteDelete, 'pet Favorite Delete', 'male', 'adoption', 'cat', 'puppy', 'Castrado', 'Vira-Lata', 'Vacinado', 'Azul', 'Marrom com branco', 'Nenhum.'));
      await transaction.save(favoriteFactory(petdisfavor, userFavoriteDelete));
    });
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}

Dump();
