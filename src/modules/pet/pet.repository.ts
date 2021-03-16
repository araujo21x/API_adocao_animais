import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';

import { ResponseCode } from '../../helpers/response/responseCode';
import { deleteCloudinary } from '../../helpers/cloudinary';
import petHelper from './pet.helper';
import PetPhoto from '../../database/entity/PetPhoto.entity';
import Pet from '../../database/entity/Pet.entity';

class PetRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    await this.storePet(req);
    return res.status(200).jsonp({});
  }

  public async edit (req: Request, res: Response): Promise<Response> {
    await this.editPet(req);
    return res.status(200).jsonp({});
  }

  public async deletePhoto (req: Request, res: Response): Promise<Response> {
    await this.removePhoto(req);
    return res.status(200).jsonp({});
  }

  public async registerPhoto (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.storePhoto(req));
  }

  private async storePet (req: Request): Promise<void> {
    petHelper.isPetFieldsValid(req);
    const user = await petHelper.userIsValid(req.userId);

    try {
      await getConnection().transaction(async transaction => {
        const pet = await transaction.save(petHelper.petFactory(req.body, user));
        await transaction.getRepository(PetPhoto)
          .save(await petHelper.petPhotosFactory(req, pet));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }

  private async editPet (req: Request): Promise<void> {
    petHelper.isPetEditingFieldsValid(req);
    await petHelper.isUsersPet(req);
    await getRepository(Pet)
      .update(Number(req.params.id), petHelper.petFactoryEdit(req.body));
  }

  private async removePhoto (req: Request): Promise<void> {
    if (!req.body.idPhoto) throw new Error(ResponseCode.E_007_001);
    await petHelper.isUsersPet(req);
    const idPhotoTable: number = await petHelper.checkDeletePhotos(req);

    try {
      await getRepository(PetPhoto).delete({ id: idPhotoTable });
      await deleteCloudinary(req.body.idPhoto);
    } catch (err) {
      if (err.message === '004-002') throw new Error(ResponseCode.E_004_002);
      else throw new Error(ResponseCode.E_000_001);
    }
  }

  private async storePhoto (req: Request): Promise<PetPhoto> {
    if (!req.file) throw new Error(ResponseCode.E_008_001);
    await petHelper.isUsersPet(req);
    const pet: Pet = await petHelper.checkAddPhotos(req);

    try {
      const photoPet = await getRepository(PetPhoto)
        .save(await petHelper.petPhotosFactory(req, pet));
      return photoPet[0];
    } catch (err) {
      if (err.message === '004-001') throw new Error(ResponseCode.E_004_001);
      else throw new Error(ResponseCode.E_000_001);
    }
  }
}

export default new PetRepository();
