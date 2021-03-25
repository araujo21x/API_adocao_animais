import { Request, Response } from 'express';
import { getRepository, getConnection, getCustomRepository } from 'typeorm';
import bcryptjs from 'bcryptjs';
import { OrganizedUserLocation, UserHeader, PetOwner, UserCommon, UserOng } from '../../helpers/organizeUserFields';

import { transport, mailOptions } from '../../helpers/transport';
import { ResponseCode } from '../../helpers/response/responseCode';
import { deleteCloudinary } from '../../helpers/cloudinary';
import userHelper from './user.helper';
import isUserValid from '../../helpers/isUserValid';
import isEmailValid from '../../helpers/isEmailValid';
import token from '../../helpers/generateJWT';

import User from '../../database/entity/User.entity';
import Address from '../../database/entity/Address.entity';
import Pet from '../../database/entity/Pet.entity';
import Favorite from '../../database/entity/Favorite.entity';

import UserQuerys from '../../database/entityRepository/userQuerys';

class UserRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    const { type } = req.body;
    let answer: any = {};
    isUserValid(type);
    if (type === 'ong') answer = await this.storeOng(req);
    if (type === 'common') answer = await this.storeCommon(req);
    return res.jsonp(answer);
  }

  public async edit (req: Request, res: Response): Promise<Response> {
    const { userType } = req;
    if (req.body.type) throw new Error(ResponseCode.E_005_001);
    if (userType === 'ong') await this.editOng(req);
    if (userType === 'common') await this.editCommon(req);
    return res.jsonp({});
  }

  public async login (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.autheticate(req.body));
  }

  public async recoverPassword (req: Request, res: Response): Promise<Response> {
    await this.retrieveByEmail(req);
    return res.jsonp({});
  }

  public async favoritePet (req: Request, res: Response): Promise<Response> {
    await this.favoritePetStore(req);
    return res.status(200).jsonp({});
  }

  public async disfavorPet (req: Request, res: Response): Promise<Response> {
    await this.favoritePetdelete(req);
    return res.status(200).jsonp({});
  }

  public async allOngsLocation (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getOngsByLocation());
  }

  public async getUserHeaderData (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getUserHeader(req));
  }

  public async showPetOwner (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getPetOwner(req));
  }

  public async showUser (req: Request, res: Response): Promise<Response> {
    let awswer: (UserOng | UserCommon);
    if (req.userType === 'ong') awswer = await this.showOng(req.userId);
    else awswer = await this.showCommon(req.userId);
    return res.status(200).jsonp(awswer);
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

  private async editOng (req: Request): Promise<void> {
    userHelper.isOngValidEdit(req);
    if (req.body.email) await userHelper.existingEmail(req.body.email);
    const user: any = await getRepository(User).findOne({ id: req.userId });

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

  private async editCommon (req: Request): Promise<void> {
    userHelper.isCommonValidEdit(req);
    if (req.body.email) await userHelper.existingEmail(req.body.email);
    const user: any = await getRepository(User).findOne({ id: req.userId });

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

  private async autheticate (body: any): Promise<string> {
    const { email, password } = body;
    userHelper.isLoginFieldsValid(body);

    const user = await getRepository(User).findOne({ email });
    if (!user) throw new Error(ResponseCode.E_003_001);

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error(ResponseCode.E_003_002);

    return token(user.id, user.type);
  }

  private async retrieveByEmail (req: Request): Promise<any> {
    const { email } = req.body;
    isEmailValid(email);

    const user = await getRepository(User).findOne({ email });
    if (!user) throw new Error(ResponseCode.E_003_001);
    try {
      const { userChanges, newPassword } = userHelper.recoverFactory();
      await getRepository(User).update(user.id, userChanges);
      await transport.sendMail(mailOptions(email, newPassword));
    } catch (err) {
      throw new Error(ResponseCode.E_010_001);
    }
  }

  private async favoritePetStore (req: Request): Promise<void> {
    if (!req.body.idPet) throw new Error(ResponseCode.E_011_002);
    const user = await getRepository(User).findOne(req.userId);
    const pet = await getRepository(Pet).findOne(req.body.idPet);
    if (!pet) throw new Error(ResponseCode.E_009_001);

    try {
      await getRepository(Favorite).save({ pet, user });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }

  private async favoritePetdelete (req: Request): Promise<void> {
    if (!req.body.idPet) throw new Error(ResponseCode.E_011_002);

    const favoritePet: (Favorite | undefined) = await getRepository(Favorite)
      .findOne({ where: { pet: req.body.idPet, user: req.userId } });

    if (!favoritePet) throw new Error(ResponseCode.E_011_001);
    await getRepository(Favorite).delete(favoritePet.id);
  }

  private async getOngsByLocation (): Promise<Array<OrganizedUserLocation>> {
    return await getCustomRepository(UserQuerys).getAllOngsLocation();
  }

  private async getUserHeader (req: Request): Promise<UserHeader> {
    return await getCustomRepository(UserQuerys).getHeader(req.userId);
  }

  private async getPetOwner (req: Request): Promise<PetOwner> {
    if (!req.query.idUser) throw new Error(ResponseCode.E_014_001);
    return await getCustomRepository(UserQuerys).getPetOwner(Number(req.query.idUser));
  }

  private async showCommon (id: number): Promise<UserCommon> {
    return await getCustomRepository(UserQuerys).findCommon(id);
  }

  private async showOng (id: number): Promise<UserOng> {
    return await getCustomRepository(UserQuerys).findOng(id);
  }
}

export default new UserRepository();
