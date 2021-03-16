import { Request } from 'express';
import { getRepository } from 'typeorm';

import { ResponseCode } from '../../helpers/response/responseCode';
import { uploadCloud } from '../../helpers/cloudinary';
import Pet from '../../database/entity/Pet.entity';
import User from '../../database/entity/User.entity';
import PetPhoto from '../../database/entity/PetPhoto.entity';

class PetHelper {
  private validGenders = ['male', 'female'];
  private validRegisterStatus = ['lost', 'adoption'];
  private validStatus = ['lost', 'adoption', 'found', 'adopted'];
  private validSpecies = ['cat', 'dog'];
  private validPhase = ['puppy', 'adult', 'elderly'];
  private validCastration = ['Castrado', 'Não Castrado', 'Sem Informação'];
  private validVaccination = ['Vacinado', 'Não Vacinado', 'Sem Informação'];

  public isPetFieldsValid (req: Request): void {
    const {
      sex,
      status,
      species,
      phase,
      castration,
      vaccination
    } = req.body;
    if (!this.validGenders.includes(sex)) throw new Error(ResponseCode.E_002_001);
    if (!this.validRegisterStatus.includes(status)) throw new Error(ResponseCode.E_002_002);
    if (!this.validSpecies.includes(species)) throw new Error(ResponseCode.E_002_003);
    if (!this.validPhase.includes(phase)) throw new Error(ResponseCode.E_002_004);
    if (!this.validCastration.includes(castration)) throw new Error(ResponseCode.E_002_005);
    if (!this.validVaccination.includes(vaccination)) throw new Error(ResponseCode.E_002_006);
    if (req.files.length === 0) throw new Error(ResponseCode.E_002_007);
    if (req.files.length > 3) throw new Error(ResponseCode.E_002_008);
  }

  public isPetEditingFieldsValid (req: Request): void {
    const {
      sex,
      status,
      species,
      phase,
      castration,
      vaccination
    } = req.body;
    if (sex) {
      if (!this.validGenders.includes(sex)) throw new Error(ResponseCode.E_002_001);
    }
    if (status) {
      if (!this.validStatus.includes(status)) throw new Error(ResponseCode.E_002_002);
    }
    if (species) {
      if (!this.validSpecies.includes(species)) throw new Error(ResponseCode.E_002_003);
    }
    if (phase) {
      if (!this.validPhase.includes(phase)) throw new Error(ResponseCode.E_002_004);
    }
    if (castration) {
      if (!this.validCastration.includes(castration)) throw new Error(ResponseCode.E_002_005);
    }
    if (vaccination) {
      if (!this.validVaccination.includes(vaccination)) throw new Error(ResponseCode.E_002_006);
    }
  }

  public petFactory (body: any, user: User): Pet {
    const {
      name,
      sex,
      status,
      species,
      phase,
      castration,
      race,
      vaccination,
      eyeColor,
      hairColor,
      feature
    } = body;
    const pet: Pet = new Pet();
    if (name !== undefined) pet.name = name;
    if (race !== undefined) pet.race = race;
    if (eyeColor !== undefined) pet.eyeColor = eyeColor;
    if (hairColor !== undefined) pet.hairColor = hairColor;
    if (feature !== undefined) pet.feature = feature;
    pet.sex = sex;
    pet.status = status;
    pet.species = species;
    pet.phase = phase;
    pet.castration = castration;
    pet.vaccination = vaccination;
    pet.user = user;
    return pet;
  };

  public petFactoryEdit (body: any) {
    const {
      name,
      sex,
      status,
      species,
      phase,
      castration,
      race,
      vaccination,
      eyeColor,
      hairColor,
      feature
    } = body;
    const pet: any = {};
    if (name) pet.name = name;
    if (race) pet.race = race;
    if (eyeColor) pet.eyeColor = eyeColor;
    if (hairColor) pet.hairColor = hairColor;
    if (feature) pet.feature = feature;
    if (sex) pet.sex = sex;
    if (status) pet.status = status;
    if (species) pet.species = species;
    if (phase) pet.phase = phase;
    if (castration) pet.castration = castration;
    if (vaccination) pet.vaccination = vaccination;
    return pet;
  }

  public async petPhotosFactory (req: Request, pet: Pet): Promise<PetPhoto[]> {
    const uploadedPhotos = await uploadCloud(req, 'Pet');

    const petPhotos: PetPhoto[] = uploadedPhotos.map((photo: any) => {
      const petPhoto: PetPhoto = new PetPhoto();
      petPhoto.pet = pet;
      petPhoto.idPhoto = photo.idPhoto;
      petPhoto.photo = photo.url;
      return petPhoto;
    });

    return petPhotos;
  }

  public async userIsValid (idUser: number): Promise<any> {
    const user = getRepository(User).findOne(idUser);
    if (!user) throw new Error(ResponseCode.E_002_009);
    return user;
  }

  public async isUsersPet (req: Request): Promise<void> {
    const id: number = Number(req.params.id);
    const pet: any = await getRepository(Pet).createQueryBuilder('pet')
      .where('pet.id = :id', { id })
      .leftJoinAndSelect('pet.user', 'user')
      .getOne();
    if (pet.user.id !== req.userId) throw new Error(ResponseCode.E_006_001);
  }

  public async checkDeletePhotos (req: Request): Promise<number> {
    const id: number = Number(req.params.id);
    const photos: Array<PetPhoto> = await getRepository(PetPhoto).find({ where: { pet: id } });

    if (photos.length <= 1) throw new Error(ResponseCode.E_007_002);

    const idTable: Array<PetPhoto> = photos.filter((photo: PetPhoto) => {
      return photo.idPhoto === req.body.idPhoto;
    });

    if (idTable.length === 0) throw new Error(ResponseCode.E_007_003);

    return idTable[0].id;
  }
}
export default new PetHelper();
