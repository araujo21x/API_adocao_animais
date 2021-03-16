import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailCommon } from '../fields';
import startConnection from '../../src/database/index';
import Pet from '../../src/database/entity/Pet.entity';

const endPoint: string = '/v1/pets/';
const request = supertest(app);

let token: string;
let id: number;
let idError: number;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(4));

  const pet:any = await getRepository(Pet).findOne({ name: 'pet delete' });
  id = pet.id;

  const pet2:any = await getRepository(Pet).findOne({ name: 'erroEditId' });
  idError = pet2.id;
});

describe('Suit de tests for delete pet ', (): void => {
  test(`edit pet [ success ] [ ${endPoint}:id ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.delete(`${endPoint}${id}`)
        .set('authorization', `Bearer ${token}`)
        .send();

      expect(status).toBe(200);
      expect(body).toBeTruthy();
      done();
    });

  test(`[ No token provided ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.delete(`${endPoint}${id}`)
      .send();

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.delete(`${endPoint}${id}`)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .send();

    expect(status).toBe(401);
    testErrors(error, 'token error');
    done();
  });

  test(`[ 006-001 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.delete(`${endPoint}${idError}`)
      .set('authorization', `Bearer ${token}`)
      .send();

    expect(status).toBe(404);
    testErrors(result, 'Animal não pertence a usuário logado.');
    done();
  });
});
