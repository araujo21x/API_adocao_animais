import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import bcryptjs from 'bcryptjs';

import { ResponseCode } from '../../helpers/response/responseCode';
import { deleteCloudinary } from '../../helpers/cloudinary';
import userHelper from './user.helper';
import isUserValid from '../../helpers/isUserValid';
import token from '../../helpers/generateJWT';
import User from '../../database/entity/User.entity';
import Address from '../../database/entity/Address.entity';

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

  public async edit (req: Request, res: Response): Promise<Response> {
    const { userType } = req;
    if (req.body.type) throw new Error(ResponseCode.E_005_001);
    if (userType === 'ong') await this.editOng(req);
    if (userType === 'common') await this.editCommon(req);
    return res.jsonp({});
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

  private async editOng (req:Request):Promise<void> {
    userHelper.isOngValidEdit(req);
    if (req.body.email) await userHelper.existingEmail(req.body.email);
    const user:any = await getRepository(User).findOne({ id: req.userId });

    try {
      await getConnection().transaction(async transaction => {
        if (userHelper.isNeedUserOng(req.body)) {
          await transaction.getRepository(User)
            .update(req.userId, await userHelper.ongFactoryEdit(req));
        }

        if (userHelper.isNeedAddressOng(req.body)) {
          await transaction.getRepository(Address)
            .update(req.userId, userHelper.ongAddressFactoryEdit(req));
        }

        if (req.file) await deleteCloudinary(user.idPhotoProfile);
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }

  private async editCommon (req:Request):Promise<void> {
    userHelper.isCommonValidEdit(req);
    if (req.body.email) await userHelper.existingEmail(req.body.email);
    const user:any = await getRepository(User).findOne({ id: req.userId });

    try {
      await getConnection().transaction(async transaction => {
        if (userHelper.isNeedUserCommon(req.body)) {
          await transaction.getRepository(User)
            .update(req.userId, await userHelper.commonFactoryEdit(req));
        }

        if (userHelper.isNeedAddressCommon(req.body)) {
          await transaction.getRepository(Address)
            .update(req.userId, userHelper.commonAddressFactoryEdit(req));
        }

        if (req.file) await deleteCloudinary(user.idPhotoProfile);
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }
}

export default new UserRepository();
