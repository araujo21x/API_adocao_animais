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

const filePath = path.resolve(__dirname, '..', 'files', 'imgPet1.jpg');

let token: string;
let id: number;
let idError: number;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(4));

  const pet:any = await getRepository(Pet).findOne({ name: 'pet add photo 1' });
  id = pet.id;

  const pet2:any = await getRepository(Pet).findOne({ name: 'erroEditId' });
  idError = pet2.id;
});

describe('Suit de tests for add Photo pet ', (): void => {
  test(`add Photo pet [ success ] [ ${endPoint}:id ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}${id}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photo', filePath)
        .field({});

      expect(status).toBe(200);
      expect(body).toBeTruthy();
      done();
    });

  test(`[ No token provided ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.post(`${endPoint}${id}`)
      .send();

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.post(`${endPoint}${id}`)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .send();

    expect(status).toBe(401);
    testErrors(error, 'token error');
    done();
  });

  test(`[ 002-008 ] - [ ${endPoint}:id ]`, async done => {
    await request.post(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .attach('photo', filePath)
      .field({});
    await request.post(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .attach('photo', filePath)
      .field({});
    const { status, body: { result } } = await request.post(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .attach('photo', filePath)
      .field({});

    expect(status).toBe(404);
    testErrors(result, 'O limite são 3 fotos por animal.');
    done();
  });

  test(`[ 006-001 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.post(`${endPoint}${idError}`)
      .set('authorization', `Bearer ${token}`)
      .attach('photo', filePath)
      .field({});

    expect(status).toBe(404);
    testErrors(result, 'Animal não pertence a usuário logado.');
    done();
  });
  test(`[ 008-001 ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { result } } = await request.post(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .field({});

    expect(status).toBe(404);
    testErrors(result, 'Foto é obrigatório.');
    done();
  });
});
