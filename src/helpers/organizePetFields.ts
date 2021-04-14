import Pet from '../database/entity/Pet.entity';
import PetPhoto from '../database/entity/PetPhoto.entity';

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

export interface CompletePet {
  idPet: number;
  name: string;
  sex: string;
  status: string;
  species: string;
  phase: string;
  castration: string;
  race: string;
  vaccination: string;
  eyeColor: string;
  feature: string
  city: string;
  uf: string;
  photos: Array<{ photo: string, idPhoto: string }>;
  userType: string;
  idUser: number;
  nameUser: string;
  lastNameUser: string;
  hairColor: string;
}

export function organizePetFileds (pets: Array<Pet>): Array<OrganizedPet> {
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

export function organizeCompletePet (pet: Pet): CompletePet {
  let newPhase = pet.phase;
  if (pet.phase === 'puppy') newPhase = 'Filhote';
  if (pet.phase === 'elderly') newPhase = 'Idoso';
  if (pet.phase === 'adult') newPhase = 'Adulto';
  const completePet: CompletePet = {
    idPet: pet.id,
    name: pet.name,
    sex: pet.sex,
    status: pet.status,
    species: pet.species,
    phase: newPhase,
    castration: pet.castration,
    race: pet.race,
    vaccination: pet.vaccination,
    eyeColor: pet.eyeColor,
    feature: pet.feature,
    hairColor: pet.hairColor,
    city: pet.user.address[0].city,
    uf: pet.user.address[0].uf,
    userType: pet.user.type,
    idUser: pet.user.id,
    nameUser: pet.user.name,
    lastNameUser: pet.user.lastName,
    photos: []
  };

  completePet.photos = pet.petPhotos.map((photo: PetPhoto): any => {
    return { photo: photo.photo, idPhoto: photo.idPhoto };
  });

  return completePet;
};
