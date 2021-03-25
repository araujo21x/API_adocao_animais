import { EntityRepository, Repository } from 'typeorm';
import Favorite from '../entity/Favorite.entity';

import organizeFavorite from '../../helpers/organizeFavoriteFields';
import { OrganizedPet } from '../../helpers/organizePetFields';
@EntityRepository(Favorite)
export default class FavoriteQuerys extends Repository<Favorite> {
  public async getUserPets (id: number): Promise<Array<OrganizedPet>> {
    const user: Array<Favorite> = await this.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.pet', 'pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('favorite.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('user.id = :id', { id })
      .getMany();

    console.log(user);

    return organizeFavorite(user);
  }
}
