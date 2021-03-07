import '../../helpers/env';
import { Request, Response } from 'express';

import userHelper from './user.helper';
import isUserValid from '../../helpers/isUserValid';

class UserRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    const { type } = req.body;
    let answer:any = {};
    isUserValid(type);
    if (type === 'ong') answer = await this.storeOng(req.body);
    if (type === 'common') answer = await this.storeCommon(req.body);
    return res.jsonp(answer);
  }

  private async storeOng (body:any):Promise<any> {
    userHelper.isOngValid(body);
    await userHelper.existingEmail(body.email);
    return '0';
  }

  private async storeCommon (body:any):Promise<any> {
    userHelper.isCommonValid(body);
    await userHelper.existingEmail(body.email);
    return '0';
  }
}

export default new UserRepository();
