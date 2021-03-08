import { Request, Response } from 'express';
import responseError from '../../helpers/response/responseError';
import repository from './pet.repository';

class PetController {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.register(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }
}

export default new PetController();
