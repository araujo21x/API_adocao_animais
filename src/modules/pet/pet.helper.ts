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
}
export default new PetHelper();
