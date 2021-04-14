import User from '../database/entity/User.entity';
import DateValidation from '../helpers/DateValidations';

export interface OrganizedUser {
  idUser: number;
  name: string;
  city: string;
  uf: string;
  photoProfile: string;
  typeUser: string;
}

export interface OrganizedUserLocation {
  idUser: number,
  lat: number,
  long: number,
  name: string,
  photoProfile: string,
  typeUser: string
}

export interface UserHeader {
  idUser: number,
  photoProfile: string,
  name: string,
  lastName: string,
  passwordChance: boolean
}

export interface PetOwner {
  idUser: number,
  name: string,
  lastName: string,
  whatsapp: string,
  email: string,
  city: string,
  uf: string,
  postalCode?: string,
  street?: string,
  district?: string,
  addressNumber?: string,
  complement?: string

}

export interface UserCommon {
  idUser: number,
  name: string,
  lastName: string,
  birthday: string,
  type: string;
  photoProfile: string
  email: string,
  city: string,
  uf: string,
  street: string,
  district: string,
  addressNumber: string,
  complement: string,
  whatsapp?: string,
  telephone?: string,
}

export interface UserOng {
  idUser: number,
  name: string,
  type: string;
  photoProfile: string
  email: string,
  city: string,
  uf: string,
  street: string,
  district: string,
  addressNumber: string,
  complement: string,
  latitude: number,
  longitude: number,
  whatsapp?: string,
  telephone?: string,

}
export function organizeUserFileds (users: Array<User>): Array<OrganizedUser> {
  return users.map((user: User): OrganizedUser => {
    const organizedUser: OrganizedUser = {
      idUser: user.id,
      name: user.name,
      city: user.address[0].city,
      uf: user.address[0].uf,
      photoProfile: user.photoProfile,
      typeUser: user.type
    };
    return organizedUser;
  });
};

export function organizeOngLocation (users: Array<User>): Array<OrganizedUserLocation> {
  return users.map((user: User): OrganizedUserLocation => {
    const organizedUser: OrganizedUserLocation = {
      idUser: user.id,
      lat: user.address[0].latitude,
      long: user.address[0].longitude,
      name: user.name,
      photoProfile: user.photoProfile,
      typeUser: user.type
    };
    return organizedUser;
  });
}

export function organizeUserHeader (user: User): UserHeader {
  const userHeader: UserHeader = {
    idUser: user.id,
    photoProfile: user.photoProfile,
    name: user.name,
    lastName: user.lastName,
    passwordChance: user.passwordChange
  };
  return userHeader;
}

export function organizePetOwner (user: User): PetOwner {
  const petOwner: PetOwner = {
    idUser: user.id,
    name: user.name,
    lastName: user.lastName,
    whatsapp: user.whatsApp,
    email: user.email,
    city: user.address[0].city,
    uf: user.address[0].uf
  };
  if (user.type === 'ong') {
    petOwner.postalCode = user.address[0].postalCode!;
    petOwner.street = user.address[0].street!;
    petOwner.district = user.address[0].district!;
    petOwner.addressNumber = user.address[0].addressNumber!;
    petOwner.complement = user.address[0].complement!;
  } else {
    petOwner.postalCode = undefined;
    petOwner.street = undefined;
    petOwner.district = undefined;
    petOwner.addressNumber = undefined;
    petOwner.complement = undefined;
  }
  return petOwner;
}

export function organizeUserCommon (user: User): UserCommon {
  const userCommon: UserCommon = {
    idUser: user.id,
    name: user.name,
    lastName: user.lastName,
    type: user.type,
    photoProfile: user.photoProfile,
    email: user.email,
    city: user.address[0].city,
    uf: user.address[0].uf,
    street: user.address[0].street,
    district: user.address[0].district,
    addressNumber: user.address[0].addressNumber,
    complement: user.address[0].complement,
    birthday: DateValidation.ConvertServerToClient(user.birthday),
    whatsapp: user.whatsApp!,
    telephone: user.telephone!
  };
  return userCommon;
}

export function organizeUserOng (user: User): UserOng {
  const userOng: UserOng = {
    idUser: user.id,
    name: user.name,
    type: user.type,
    photoProfile: user.photoProfile,
    email: user.email,
    city: user.address[0].city,
    uf: user.address[0].uf,
    street: user.address[0].street,
    district: user.address[0].district,
    addressNumber: user.address[0].addressNumber,
    complement: user.address[0].complement,
    latitude: user.address[0].latitude,
    longitude: user.address[0].longitude,
    whatsapp: user.whatsApp!,
    telephone: user.telephone!
  };
  return userOng;
}
