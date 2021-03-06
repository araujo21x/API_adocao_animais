import { config } from 'dotenv';
import { getConnection } from 'typeorm';

import startConnection from '../src/database/index';
import { password, emailONG } from './fields';
import User from '../src/database/entity/User.entity';
import Address from '../src/database/entity/Address.entity';

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const userFactory = (
  name: string,
  lastName: string,
  whatsApp: string,
  telephone: string,
  type: string,
  email: string,
  photoProfile: string,
  idPhotoProfile: string
) => {
  const newUser = new User();
  newUser.name = name;
  newUser.lastName = lastName;
  newUser.whatsApp = whatsApp;
  newUser.telephone = telephone;
  newUser.type = type;
  newUser.birthday = new Date('1997-02-21');
  newUser.email = email;
  newUser.password = password;
  newUser.photoProfile = photoProfile;
  newUser.idPhotoProfile = idPhotoProfile;
  return newUser;
};

const addressFactory = (
  user:User,
  uf: string,
  city: string,
  postalCode: string,
  street: string,
  district: string,
  addressNumber: string,
  complement: string,
  latitude?: number,
  longitude?: number
) => {
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

async function Dump () {
  try {
    await startConnection();
    await getConnection().transaction(async transaction => {
      const userLogin = await transaction.save(userFactory('login', 'test login', '74987456321', '74987456321', 'common', 'login@example.com', 'fasdfasdf', 'fadsdfasd'));
      await transaction.save(addressFactory(userLogin, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente'));

      const userOngPet = await transaction.save(userFactory('ong', 'register pet', '74987456321', '74987456321', 'ong', emailONG(2), 'fasdfasdf', 'fadsdfasd'));
      await transaction.save(addressFactory(userOngPet, 'BA', 'city test', '48970-000', 'street test', 'district test', '1200 a', 'casa, que tem casas do lado e na frente', -10.4287, -40.1012));
    });
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
}

Dump();
