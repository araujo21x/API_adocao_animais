import { Request, Response } from 'express';
import fs from 'fs';
import responseError from '../../helpers/response/responseError';
import repository from './user.repository';

class UserController {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.register(req, res);
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      return responseError(res, err.message, 404);
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.login(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async edit (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.edit(req, res);
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      return responseError(res, err.message, 404);
    }
  }

  public async recoverPassword (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.recoverPassword(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async favoritePet (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.favoritePet(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async disfavorPet (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.disfavorPet(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async allOngsLocation (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.allOngsLocation(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }

  public async getUserHeaderData (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.getUserHeaderData(req, res);
    } catch (err) {
      return responseError(res, err.message, 404);
    }
  }
}

export default new UserController();
