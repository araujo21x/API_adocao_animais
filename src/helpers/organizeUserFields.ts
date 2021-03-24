import User from '../database/entity/User.entity';

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
