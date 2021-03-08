import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { ResponseCode } from '../../helpers/response/responseCode';
import petHelper from './pet.helper';

class PetRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    await this.storePet(req);
    return res.status(200).jsonp();
  }

  private async storePet (req: Request): Promise<void> {
    petHelper.isPetFieldsValid(req.body);
    const user = await petHelper.userIsValid(req.userId);

    try {
      await getConnection().transaction(async transaction => {
        await transaction.save(petHelper.petFactory(req.body, user));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }
}

export default new PetRepository();
