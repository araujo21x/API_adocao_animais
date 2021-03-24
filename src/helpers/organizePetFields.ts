import Pet from '../database/entity/Pet.entity';

export interface OrganizedPet {
  idPet: number;
  name: string;
  city: string;
  uf: string;
  status: string;
  phase: string;
  sex: string;
  photo: string;
  userType: string;
  idUser: number;
}

export default function (pets: Array<Pet>): Array<OrganizedPet> {
  return pets.map((pet: Pet): OrganizedPet => {
    const organizedPet: OrganizedPet = {
      idPet: pet.id,
      name: pet.name,
      city: pet.user.address[0].city,
      uf: pet.user.address[0].uf,
      status: pet.status,
      phase: pet.phase,
      sex: pet.sex,
      photo: pet.petPhotos[0].photo,
      userType: pet.user.type,
      idUser: pet.user.id
    };
    return organizedPet;
  });
};
