import '../../helpers/env';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ResponseCode } from '../../helpers/response/responseCode';
import bcryptjs from 'bcryptjs';
import Users from '../../database/entity/users.entity';
import jwt from 'jsonwebtoken';

class UserRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.store(req));
  }

  public async listUsers (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.index(req));
  }

  public async login (req: Request, res: Response): Promise<Response> {
    return res.jsonp(await this.autheticate(req));
  }

  private async store (req: Request): Promise<Object> {
    const repository = getRepository(Users);
    const { email, password } = req.body;

    const user = repository.create({ email, password });

    await repository.save(user);
    return user;
  }

  private async index (req: Request): Promise<Object> {
    const repository = getRepository(Users);
    return await repository.find();
  }

  private async autheticate (req: Request): Promise<Object> {
    const repository = getRepository(Users);
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });

    if (!user) throw new Error(ResponseCode.E_001_001);
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) throw new Error(ResponseCode.E_001_001);

    const token = jwt.sign({ id: user.id }, `${process.env.SECRET}`, { expiresIn: process.env.EXPIRES_TOKEN });
    return { user, token };
  }
}

export default new UserRepository();
