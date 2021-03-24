import { EntityRepository, Repository } from 'typeorm';
import organizePetFileds, { OrganizedPet } from '../../helpers/organizePetFields';
import Pet from '../entity/Pet.entity';

@EntityRepository(Pet)
export default class PetQuerys extends Repository<Pet> {
  public async OldestLost (): Promise<Array<OrganizedPet>> {
    const pets = await this.createQueryBuilder('pet')
      .select()
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.status = :status', { status: 'lost' })
      .orderBy('pet.createdAt', 'ASC')
      .take(8)
      .getMany();

    return organizePetFileds(pets);
  }

  public async filter (params:any): Promise<Array<OrganizedPet>> {
    const { page, city, uf, status } = params;

    const pets = await this.createQueryBuilder('pet')
      .select()
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.status = :status', { status })
      .andWhere('address.city = :city', { city })
      .andWhere('address.uf = :uf', { uf })
      .orderBy('pet.createdAt', 'DESC')
      .skip(12 * (Number(page) - 1))
      .take(12)
      .getMany();

    const test: Array<OrganizedPet> = organizePetFileds(pets);
    return test;
  }
}
