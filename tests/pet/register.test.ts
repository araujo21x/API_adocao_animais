import supertest from 'supertest';
import path from 'path';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailONG } from '../fields';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/pets/register';
const request = supertest(app);
const filePath = path.resolve(__dirname, '..', 'files', 'imgPet1.jpg');
const filePath2 = path.resolve(__dirname, '..', 'files', 'imgPet2.jpg');

const pet = (): any => ({
  name: 'Logan',
  sex: 'male',
  status: 'adoption',
  species: 'cat',
  phase: 'puppy',
  castration: 'Castrado',
  race: 'Vira-lata',
  vaccination: 'Vacinado',
  eyeColor: 'Azul',
  hairColor: 'Branco com marrom',
  feature: 'Só tem dois dedos nas patas de tras e todas as unhas são tortas'
});

let token: string;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailONG(1));
});

describe('Suit de tests register pet', (): void => {
  test(`register pet [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(pet());

      expect(status).toBe(200);
      expect(body).toBeFalsy();

      done();
    });
  test(`[ No token provided ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.post(endPoint)
      .field(pet());

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.post(endPoint)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .field(pet());

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });
  test(`[ ERR: 002-001 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.sex;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Sexo informado não é valido.');
      done();
    });

  test(`[ ERR: 002-001 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.sex;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Sexo informado não é valido.');
      done();
    });

  test(`[ ERR: 002-002 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.status;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Status informado inválido.');
      done();
    });

  test(`[ ERR: 002-002 ] string- [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.status = 'error';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Status informado inválido.');
      done();
    });

  test(`[ ERR: 002-003 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.species;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Especie informado inválido, EX: gato ou cachorro.');
      done();
    });

  test(`[ ERR: 002-003 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.species = 'papagaio';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Especie informado inválido, EX: gato ou cachorro.');
      done();
    });

  test(`[ ERR: 002-004 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.phase;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'fase informada inválida.');
      done();
    });

  test(`[ ERR: 002-004 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.phase = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'fase informada inválida.');
      done();
    });

  test(`[ ERR: 002-005 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.castration;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Castração informada inválida.');
      done();
    });

  test(`[ ERR: 002-005 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.castration = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Castração informada inválida.');
      done();
    });

  test(`[ ERR: 002-006 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      delete send.vaccination;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Vacinação informada inválida.');
      done();
    });

  test(`[ ERR: 002-006 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.vaccination = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Vacinação informada inválida.');
      done();
    });

  test(`[ ERR: 002-007 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .field(pet());

      expect(status).toBe(404);
      testErrors(result, 'É obrigatório cadastrar pelo menos uma foto do animal.');
      done();
    });

  test(`[ ERR: 002-008 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .attach('photos', filePath)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .attach('photos', filePath)
        .attach('photos', filePath2)
        .field(pet());

      expect(status).toBe(404);
      testErrors(result, 'O limite são 3 fotos por animal.');
      done();
    });
});
