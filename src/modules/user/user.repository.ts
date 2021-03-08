import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import bcryptjs from 'bcryptjs';

import { ResponseCode } from '../../helpers/response/responseCode';
import userHelper from './user.helper';
import isUserValid from '../../helpers/isUserValid';
import token from '../../helpers/generateJWT';
import User from '../../database/entity/User.entity';

class UserRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    const { type } = req.body;
    let answer: any = {};
    isUserValid(type);
    if (type === 'ong') answer = await this.storeOng(req);
    if (type === 'common') answer = await this.storeCommon(req);
    return res.jsonp(answer);
  }

  public async login (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.autheticate(req.body));
  }

  private async storeOng (req: Request): Promise<string> {
    userHelper.isOngValid(req);
    await userHelper.existingEmail(req.body.email);
    let user: any = {};

    try {
      await getConnection().transaction(async transaction => {
        user = await transaction.save(await userHelper.ongFactory(req));
        await transaction.save(userHelper.ongAddressFactory(req, user));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }

    return token(user.id, user.type);
  }

  private async storeCommon (req: Request): Promise<string> {
    userHelper.isCommonValid(req);
    await userHelper.existingEmail(req.body.email);
    let user: any = {};

    try {
      await getConnection().transaction(async transaction => {
        user = await transaction.save(await userHelper.commonFactory(req));
        await transaction.save(userHelper.commonAddressFactory(req, user));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }

    return token(user.id, user.type);
  }

  private async autheticate (body: any): Promise<string> {
    const { email, password } = body;
    userHelper.isLoginFieldsValid(body);

    const user = await getRepository(User).findOne({ email });
    if (!user) throw new Error(ResponseCode.E_003_001);

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error(ResponseCode.E_003_002);

    return token(user.id, user.type);
  }
}

export default new UserRepository();
