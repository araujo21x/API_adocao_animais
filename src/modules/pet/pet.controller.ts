import { Request, Response } from 'express';
import fs from 'fs';
import responseError from '../../helpers/response/responseError';
import repository from './pet.repository';

class PetController {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.register(req, res);
    } catch (err) {
      if (req.files.length > 0) {
        const files:any = req.files;
        files.forEach((file: any) => fs.unlinkSync(file.path));
      }
      return responseError(res, err.message, 404);
    }
  }

  public async edit (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.edit(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }
}

export default new PetController();
