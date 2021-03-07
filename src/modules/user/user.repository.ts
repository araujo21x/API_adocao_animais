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
    if (type === 'ong') answer = await this.storeOng(req.body);
    if (type === 'common') answer = await this.storeCommon(req.body);
    return res.jsonp(answer);
  }

  public async login (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.autheticate(req.body));
  }

  private async storeOng (body: any): Promise<string> {
    userHelper.isOngValid(body);
    await userHelper.existingEmail(body.email);
    let user: any = {};

    try {
      await getConnection().transaction(async transaction => {
        user = await transaction.save(userHelper.ongFactory(body));
        await transaction.save(userHelper.ongAddressFactory(body, user));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }

    return token(user.id, user.type);
  }

  private async storeCommon (body: any): Promise<string> {
    userHelper.isCommonValid(body);
    await userHelper.existingEmail(body.email);
    let user: any = {};

    try {
      await getConnection().transaction(async transaction => {
        user = await transaction.save(userHelper.commonFactory(body));
        await transaction.save(userHelper.commonAddressFactory(body, user));
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
