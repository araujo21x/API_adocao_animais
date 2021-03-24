import { EntityRepository, Repository } from 'typeorm';
import organizePetFileds, { OrganizedPet } from '../../helpers/organizePetFields';
import Pet from '../entity/Pet.entity';

@EntityRepository(Pet)
export default class PetQuerys extends Repository<Pet> {
  public async OldestLost (): Promise<Array<OrganizedPet>> {
    const pets:Array<Pet> = await this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.status = :status', { status: 'lost' })
      .orderBy('pet.createdAt', 'ASC')
      .take(8)
      .getMany();

    return organizePetFileds(pets);
  }

  public async filter (queryParams: any): Promise<Array<OrganizedPet>> {
    const { page, city, uf, status, species, sex, phase } = queryParams;

    const pets: any = this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('address.city = :city', { city })
      .andWhere('address.uf = :uf', { uf })
      .orderBy('pet.createdAt', 'DESC')
      .skip(12 * (Number(page) - 1))
      .take(12);

    if (status) pets.andWhere('pet.status = :status', { status });
    if (sex) pets.andWhere('pet.sex = :sex', { sex });
    if (phase)pets.andWhere('pet.phase = :phase', { phase });
    if (species) pets.andWhere('pet.species = :species', { species });

    return organizePetFileds(await pets.getMany());
  }
}
