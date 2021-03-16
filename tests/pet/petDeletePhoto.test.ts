import supertest from 'supertest';
import path from 'path';
import { getRepository } from 'typeorm';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailCommon } from '../fields';
import startConnection from '../../src/database/index';
import Pet from '../../src/database/entity/Pet.entity';

const endPoint: string = '/v1/petsPhoto/';
const request = supertest(app);

let token: string;
let id: number;
let idError: number;
let idPhoto: string;
let idPhoto2: string;
const filePath = path.resolve(__dirname, '..', 'files', 'imgPet1.jpg');

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(4));

  const pet: any = await getRepository(Pet).createQueryBuilder('pet')
    .where('pet.name = :name', { name: 'pet delete photo 1' })
    .leftJoinAndSelect('pet.petPhotos', 'petPhotos')
    .getOne();
  idPhoto = pet.petPhotos[0].idPhoto;
  idPhoto2 = pet.petPhotos[1].idPhoto;
  id = pet.id;

  const pet2: any = await getRepository(Pet).findOne({ name: 'erroEditId' });
  idError = pet2.id;
});

describe('Suit de tests for delete Photo pet ', (): void => {
  test(`delete Photo pet [ success ] [ ${endPoint}:id ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.delete(`${endPoint}${id}`)
        .set('authorization', `Bearer ${token}`)
        .send({ idPhoto });

      expect(status).toBe(200);
      expect(body).toBeTruthy();
      done();
    });

  test(`[ No token provided ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.delete(`${endPoint}${id}`)
      .send({ idPhoto: idPhoto2 });

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.delete(`${endPoint}${id}`)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .send({ idPhoto: idPhoto2 });

    expect(status).toBe(401);
    testErrors(error, 'token error');
    done();
  });

  test(`[ 006-001 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.delete(`${endPoint}${idError}`)
      .set('authorization', `Bearer ${token}`)
      .send({ idPhoto: idPhoto2 });

    expect(status).toBe(404);
    testErrors(result, 'Animal não pertence a usuário logado.');
    done();
  });

  test(`[ 007-001 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.delete(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ });

    expect(status).toBe(404);
    testErrors(result, 'idPhoto é obrigatório.');
    done();
  });

  test(`[ 007-002 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.delete(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ idPhoto: idPhoto2 });

    expect(status).toBe(404);
    testErrors(result, 'Você só tem uma foto, é obrigatório ter ao menos uma foto do animal.');
    done();
  });

  test(`[ 007-003 ] - [ ${endPoint}:id ]`, async done => {
    await request.post(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .attach('photo', filePath)
      .field({});
    const { status, body: { result } } = await request.delete(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send({ idPhoto: '55555' });

    expect(status).toBe(404);
    testErrors(result, 'idPhoto não pertence ao animal.');
    done();
  });
});
