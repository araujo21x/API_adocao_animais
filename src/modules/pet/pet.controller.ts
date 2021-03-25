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
        const files: any = req.files;
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

  public async delete (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.delete(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async deletePhoto (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.deletePhoto(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async registerPhoto (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.registerPhoto(req, res);
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      return responseError(res, err.message, 404);
    }
  }

  public async oldestLost (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.oldestLost(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async lostLocation (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.lostLocation(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async searchLocation (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.searchLocation(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async filterPets (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.filterPets(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async ofUserAuth (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.ofUserAuth(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async ofUser (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.ofUser(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async seeToo (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.seeToo(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async userFavoritesPets (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.userFavoritesPets(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async showPetById (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.showPetById(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }
}

export default new PetController();
