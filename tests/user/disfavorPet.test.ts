import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailCommon } from '../fields';
import startConnection from '../../src/database/index';
import Pet from '../../src/database/entity/Pet.entity';

const endPoint: string = '/v1/user/favoritePet';
const request = supertest(app);
let token: string;
let idPet: number;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(6));

  const pet:any = await getRepository(Pet).findOne({ name: 'pet Favorite Delete' });
  idPet = pet.id;
});

describe('Suit de tests disfavorPet', (): void => {
  test(`disfavorPet sucess [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.delete(endPoint)
        .set('authorization', `Bearer ${token}`)
        .send({ idPet });

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });
  test(`[ No token provided ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.delete(endPoint)
      .send({ idPet });

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.delete(endPoint)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .send({ idPet });

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ ERR: 011-001 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.delete(endPoint)
        .set('authorization', `Bearer ${token}`)
        .send({ idPet: 50000 });

      expect(status).toBe(404);
      testErrors(result, 'Não foi encontrado o seu favoritar no animal informado.');
      done();
    });

  test(`[ ERR: 011-002 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.delete(endPoint)
        .set('authorization', `Bearer ${token}`)
        .send();

      expect(status).toBe(404);
      testErrors(result, 'Id do animal é obrigatório.');
      done();
    });
});
