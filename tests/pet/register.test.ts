import supertest from 'supertest';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailONG } from '../fields';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/pets/register';
const request = supertest(app);

const pet = (): any => ({
  name: 'Logan',
  sex: 'male',
  status: 'adoption',
  species: 'cat',
  phase: 'puppy',
  castration: 'Castrado',
  race: 'Vira-lata',
  vaccination: 'Em dia',
  eyeColor: 'Azul',
  hairColor: 'Branco com marrom',
  feature: 'Só tem dois dedos nas patas de tras e todas as unhas são tortas'
});

let token: string;

beforeAll(async () => {
  await startConnection();
  token = (await getTokenIdUser(emailONG(1))).token;
});

describe('Suit de tests register pet', (): void => {
  test(`register pet [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(pet());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test(`[ ERR: 002-001 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.sex = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Sexo informada não é valido.');
      done();
    });

  test(`[ ERR: 002-001 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.sex = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Sexo informada não é valido.');
      done();
    });

  test(`[ ERR: 002-002 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.status = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Status informado invalido.');
      done();
    });

  test(`[ ERR: 002-002 ] string- [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.status = 'error';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Status informado invalido.');
      done();
    });

  test(`[ ERR: 002-003 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.species = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Especie informado invalido, EX: gato ou cachorro.');
      done();
    });

  test(`[ ERR: 002-003 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.species = 'papagaio';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Especie informado invalido, EX: gato ou cachorro.');
      done();
    });

  test(`[ ERR: 002-004 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.phase = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'fase informada invalida.');
      done();
    });

  test(`[ ERR: 002-004 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.phase = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'fase informada invalida.');
      done();
    });

  test(`[ ERR: 002-005 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.castration = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Castração informada invalida.');
      done();
    });

  test(`[ ERR: 002-005 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.castration = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Castração informada invalida.');
      done();
    });

  test(`[ ERR: 002-006 ] undefined - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.vaccination = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Vacinação informada invalida.');
      done();
    });

  test(`[ ERR: 002-006 ] string - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.vaccination = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Vacinação informada invalida.');
      done();
    });

  // test(`[ ERR: 002-007 ] - [ ${endPoint} ]`,
  //   async (done: jest.DoneCallback) => {
  //     const { status, body: { result } } = await request.post(`${endPoint}`)
  //       .set('authorization', `Bearer ${token}`)
  //       .send(pet());

  //     expect(status).toBe(404);
  //     testErrors(result, 'É obrigatório cadastrar pelo menos uma foto do animal.');
  //     done();
  //   });

  // test(`[ ERR: 002-008 ] - [ ${endPoint} ]`,
  //   async (done: jest.DoneCallback) => {
  //     const { status, body: { result } } = await request.post(`${endPoint}`)
  //       .set('authorization', `Bearer ${token}`)
  //       .send(pet());

  //     expect(status).toBe(404);
  //     testErrors(result, 'O limite são 3 fotos por animal.');
  //     done();
  //   });

  test(`[ ERR: 002-009 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = pet();
      send.race = 'adolescente';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .set('authorization', `Bearer ${token}`)
        .send(pet());

      expect(status).toBe(404);
      testErrors(result, 'Raça é obrigatório.');
      done();
    });
});
