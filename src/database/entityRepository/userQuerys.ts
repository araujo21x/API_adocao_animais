import { EntityRepository, Repository } from 'typeorm';
import {
  OrganizedUser,
  organizeUserFileds,
  organizeOngLocation,
  OrganizedUserLocation,
  organizeUserHeader,
  UserHeader
} from '../../helpers/organizeUserFields';
import User from '../entity/User.entity';
import { ResponseCode } from '../../helpers/response/responseCode';

@EntityRepository(User)
export default class UserQuerys extends Repository<User> {
  public async filter (queryParams: any): Promise<Array<OrganizedUser>> {
    const { uf, city, page } = queryParams;

    const users: Array<User> = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .where('user.type = :type', { type: 'ong' })
      .andWhere('address.city = :city', { city })
      .andWhere('address.uf = :uf', { uf })
      .orderBy('user.createdAt', 'DESC')
      .skip(12 * (Number(page) - 1))
      .take(12)
      .getMany();

    return organizeUserFileds(users);
  }

  public async getAllOngsLocation (): Promise<Array<OrganizedUserLocation>> {
    const users: Array<User> = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .where('user.type = :type', { type: 'ong' })
      .getMany();

    return organizeOngLocation(users);
  }

  public async getHeader (id: number): Promise<UserHeader> {
    const user: (User | undefined) = await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new Error(ResponseCode.E_013_001);
    return organizeUserHeader(user);
  }
}
