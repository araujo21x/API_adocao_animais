import { Request, Response } from 'express';
import { getConnection, getCustomRepository, getRepository } from 'typeorm';
import { OrganizedPet, CompletePet } from '../../helpers/organizePetFields';
import { OrganizedUser } from '../../helpers/organizeUserFields';

import { ResponseCode } from '../../helpers/response/responseCode';
import { deleteCloudinary } from '../../helpers/cloudinary';
import petHelper from './pet.helper';
import PetPhoto from '../../database/entity/PetPhoto.entity';
import Pet from '../../database/entity/Pet.entity';

import PetQuerys from '../../database/entityRepository/petQuerys';
import UserQuerys from '../../database/entityRepository/userQuerys';
import FavoriteQuerys from '../../database/entityRepository/favoriteQueys';

class PetRepository {
  public async register (req: Request, res: Response): Promise<Response> {
    await this.storePet(req);
    return res.status(200).jsonp({});
  }

  public async edit (req: Request, res: Response): Promise<Response> {
    await this.editPet(req);
    return res.status(200).jsonp({});
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    await this.deletePet(req);
    return res.status(200).jsonp({});
  }

  public async deletePhoto (req: Request, res: Response): Promise<Response> {
    await this.removePhoto(req);
    return res.status(200).jsonp({});
  }

  public async registerPhoto (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.storePhoto(req));
  }

  public async oldestLost (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getOldestLost());
  }

  public async lostLocation (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getLostLocation(req));
  }

  public async searchLocation (req: Request, res: Response): Promise<Response> {
    const { typeSearch } = req.query;
    let awswer: (Array<OrganizedPet> | Array<any>);
    if (typeSearch !== 'pet' && typeSearch !== 'ong') throw new Error(ResponseCode.E_012_002);
    if (typeSearch === 'pet') awswer = await this.searchLocationPet(req.query);
    else awswer = await this.searchLocationOng(req.query);
    return res.status(200).jsonp(awswer);
  }

  public async filterPets (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.completeFilter(req.query));
  }

  public async ofUserAuth (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getUserPetsAuth(req));
  }

  public async ofUser (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.getUserPets(req.query));
  }

  public async seeToo (req: Request, res: Response): Promise<Response> {
    let awswer: Array<OrganizedPet>;
    if (req.query.idUser) awswer = await this.seeTooById(req.query);
    else awswer = await this.seeTooByLocation(req.query);
    return res.status(200).jsonp(awswer);
  }

  public async userFavoritesPets (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.showUserFavoritesPets(req.userId));
  }

  public async showPetById (req: Request, res: Response): Promise<Response> {
    return res.status(200).jsonp(await this.showPet(Number(req.params.id)));
  }

  private async storePet (req: Request): Promise<void> {
    petHelper.isPetFieldsValid(req);
    const user = await petHelper.userIsValid(req.userId);

    try {
      await getConnection().transaction(async transaction => {
        const pet = await transaction.save(petHelper.petFactory(req.body, user));
        await transaction.getRepository(PetPhoto)
          .save(await petHelper.petPhotosFactory(req, pet));
      });
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }

  private async editPet (req: Request): Promise<void> {
    petHelper.isPetEditingFieldsValid(req);
    await petHelper.isUsersPet(req);
    await getRepository(Pet)
      .update(Number(req.params.id), petHelper.petFactoryEdit(req.body));
  }

  private async deletePet (req: Request): Promise<void> {
    await petHelper.isUsersPet(req);
    const id: number = Number(req.params.id);
    try {
      const photosPet = await getRepository(PetPhoto).find({ where: { pet: id } });
      getRepository(Pet).delete({ id });
      if (photosPet.length > 0) {
        photosPet.forEach(async photo => {
          await deleteCloudinary(photo.idPhoto);
        });
      }
    } catch (err) {
      throw new Error(ResponseCode.E_000_001);
    }
  }

  private async removePhoto (req: Request): Promise<void> {
    if (!req.body.idPhoto) throw new Error(ResponseCode.E_007_001);
    await petHelper.isUsersPet(req);
    const idPhotoTable: number = await petHelper.checkDeletePhotos(req);

    try {
      await getRepository(PetPhoto).delete({ id: idPhotoTable });
      await deleteCloudinary(req.body.idPhoto);
    } catch (err) {
      if (err.message === '004-002') throw new Error(ResponseCode.E_004_002);
      else throw new Error(ResponseCode.E_000_001);
    }
  }

  private async storePhoto (req: Request): Promise<PetPhoto> {
    if (!req.file) throw new Error(ResponseCode.E_008_001);
    await petHelper.isUsersPet(req);
    const pet: Pet = await petHelper.checkAddPhotos(req);

    try {
      const photoPet = await getRepository(PetPhoto)
        .save(await petHelper.petPhotosFactory(req, pet));
      return photoPet[0];
    } catch (err) {
      if (err.message === '004-001') throw new Error(ResponseCode.E_004_001);
      else throw new Error(ResponseCode.E_000_001);
    }
  }

  private async getOldestLost (): Promise<Array<OrganizedPet>> {
    const petQuerys: PetQuerys = getCustomRepository(PetQuerys);
    return await petQuerys.OldestLost();
  }

  private async getLostLocation (req: Request): Promise<Array<OrganizedPet>> {
    const petQuerys: PetQuerys = getCustomRepository(PetQuerys);
    petHelper.isLostLocation(req.query);
    req.query.status = 'lost';
    return await petQuerys.filter(req.query);
  }

  private async searchLocationPet (queryParams: any): Promise<Array<OrganizedPet>> {
    petHelper.isLostLocation(queryParams);
    if (queryParams.species !== 'cat' && queryParams.species !== 'dog') {
      throw new Error(ResponseCode.E_002_003);
    }
    const petQuerys: PetQuerys = getCustomRepository(PetQuerys);
    return await petQuerys.filter(queryParams);
  }

  private async searchLocationOng (queryParams: any): Promise<Array<OrganizedUser>> {
    petHelper.isLostLocation(queryParams);
    const userQuerys: UserQuerys = getCustomRepository(UserQuerys);
    return await userQuerys.filter(queryParams);
  }

  private async completeFilter (queryParams: any): Promise<Array<OrganizedPet>> {
    petHelper.filterIsValid(queryParams);
    const petQuerys: PetQuerys = getCustomRepository(PetQuerys);
    return await petQuerys.filter(queryParams);
  }

  private async getUserPetsAuth (req: Request): Promise<Array<OrganizedPet>> {
    if (!req.query.page || isNaN(Number(req.query.page))) throw new Error(ResponseCode.E_012_001);
    return await getCustomRepository(PetQuerys).userPets(req.userId, Number(req.query.page));
  }

  private async getUserPets (queryParams: any): Promise<Array<OrganizedPet>> {
    if (!queryParams.page || isNaN(Number(queryParams.page))) {
      throw new Error(ResponseCode.E_012_001);
    }
    if (!queryParams.idUser || isNaN(Number(queryParams.idUser))) {
      throw new Error(ResponseCode.E_014_001);
    }
    return await getCustomRepository(PetQuerys).userPets(Number(queryParams.idUser), Number(queryParams.page));
  }

  private async seeTooById (queryParams: any): Promise<Array<OrganizedPet>> {
    if (isNaN(Number(queryParams.idUser))) throw new Error(ResponseCode.E_014_001);
    return await getCustomRepository(PetQuerys)
      .seeToo(Number(queryParams.idUser), undefined, undefined);
  }

  private async seeTooByLocation (queryParams: any): Promise<Array<OrganizedPet>> {
    petHelper.isCityAndUf(queryParams);
    return await getCustomRepository(PetQuerys)
      .seeToo(undefined, queryParams.city, queryParams.uf);
  }

  private async showUserFavoritesPets (id:number): Promise<Array<OrganizedPet>> {
    return await getCustomRepository(FavoriteQuerys)
      .getUserPets(id);
  }

  private async showPet (id:number): Promise<CompletePet> {
    return await getCustomRepository(PetQuerys)
      .showPet(id);
  }
}

export default new PetRepository();
