import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';

import { ResponseCode } from '../../helpers/response/responseCode';
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
}

export default new PetRepository();
