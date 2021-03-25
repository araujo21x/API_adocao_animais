import Favorite from '../database/entity/Favorite.entity';
import { OrganizedPet } from './organizePetFields';

export default function (favorites: Array<Favorite>): Array<OrganizedPet> {
  return favorites.map((favorite: Favorite): any => {
    const organizedPet: OrganizedPet = {
      idPet: favorite.pet.id,
      name: favorite.pet.name,
      city: favorite.user.address[0].city,
      uf: favorite.user.address[0].uf,
      status: favorite.pet.status,
      phase: favorite.pet.phase,
      sex: favorite.pet.sex,
      photo: favorite.pet.petPhotos[0].photo,
      userType: favorite.user.type,
      idUser: favorite.user.id
    };
    return organizedPet;
  });
};
