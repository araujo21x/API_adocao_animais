import { Request, Response } from 'express';
import responseError from '../../helpers/response/responseError';
import repository from './user.repository';

class UserController {
  public async register (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.register(req, res);
    } catch (err) {
      return responseError(res, err.message);
    }
  }

  public async listUsers (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.listUsers(req, res);
    } catch (err) {
      return responseError(res, err.message);
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    try {
      return await repository.login(req, res);
    } catch (err) {
      return responseError(res, err.message);
    }
  }
}

export default new UserController();
