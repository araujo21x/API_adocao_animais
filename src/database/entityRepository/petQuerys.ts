import { EntityRepository, Repository } from 'typeorm';
import { ResponseCode } from '../../helpers/response/responseCode';
import { organizePetFileds, OrganizedPet, organizeCompletePet, CompletePet } from '../../helpers/organizePetFields';
import Pet from '../entity/Pet.entity';

@EntityRepository(Pet)
export default class PetQuerys extends Repository<Pet> {
  public async OldestLost (): Promise<Array<OrganizedPet>> {
    const pets: Array<Pet> = await this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.status = :status', { status: 'lost' })
      .orderBy('pet.createdAt', 'ASC')
      .take(5)
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
    if (phase) pets.andWhere('pet.phase = :phase', { phase });
    if (species && species !== 'all') pets.andWhere('pet.species = :species', { species });

    return organizePetFileds(await pets.getMany());
  }

  public async userPets (id: number, page: number): Promise<Array<OrganizedPet>> {
    const pets: Array<Pet> = await this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.user = :id', { id })
      .orderBy('pet.createdAt', 'DESC')
      .skip(12 * (Number(page) - 1))
      .take(12)
      .getMany();

    return organizePetFileds(pets);
  }

  public async seeToo (idUser?: number, city?: string, uf?: string): Promise<Array<OrganizedPet>> {
    const pets = this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .orderBy('pet.createdAt', 'DESC')
      .take(8);

    if (idUser) pets.andWhere('pet.user = :idUser', { idUser });
    if (city && uf) {
      pets.andWhere('address.city = :city', { city });
      pets.andWhere('address.uf = :uf', { uf });
    }

    return organizePetFileds(await pets.getMany());
  }

  public async showPet (id: number): Promise<CompletePet> {
    const pet: (Pet | undefined) = await this.createQueryBuilder('pet')
      .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
      .leftJoinAndSelect('pet.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .where('pet.id = :id', { id })
      .getOne();
    if (!pet) throw new Error(ResponseCode.E_009_001);
    return organizeCompletePet(pet);
  }
}
