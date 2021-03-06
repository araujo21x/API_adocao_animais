import supertest from 'supertest';

import app from '../../src/server';
import { testErrors } from '../helper';
import startConnection from '../../src/database/index';
import { emailCommon, password } from '../fields';

const endPoint: string = '/v1/user/register';
const request = supertest(app);

const user = (): any => ({
  name: 'UserOng',
  type: 'ong',
  whatsApp: '7498765-4321',
  telephone: '7498765-4321',
  email: emailCommon(1),
  password,
  photoProfile: 'fasdfasdfasdf',
  idPhotoProfile: 'fasdfasdf',
  uf: 'BA',
  city: 'city test',
  postalCode: '48970-000',
  addressNumber: '1200a',
  street: 'street test',
  district: 'district test',
  latitude: -10.4287,
  longitude: -40.1012
});

beforeAll(async () => {
  await startConnection();
});

describe('Suit de tests register user type common', (): void => {
  test(`register common user [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .send(user());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test(`[ ERR: 001-001 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.name = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Nome é obrigatório.');
      done();
    });

  test(`[ ERR: 001-002 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.type = 'erro';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Tipo informado não cadastrado.');
      done();
    });

  test(`[ ERR: 001-004 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.email = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Email é obrigatório.');
      done();
    });

  test(`[ ERR: 001-005 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.email = 'erro.com.br';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
      done();
    });

  test(`[ ERR: 001-006 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.password = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha é Obrigatória.');
      done();
    });

  test(`[ ERR: 001-007 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.password = '1526';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha precisa ter mais de oitos digitos.');
      done();
    });
  test(`[ ERR: 001-011 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.photoProfile = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Foto é obrigatória para usuário ONG.');
      done();
    });
  test(`[ ERR: 001-012 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.uf = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'UF é obrigatória.');
      done();
    });

  test(`[ ERR: 001-013 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.uf = 'Bahia';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'UF informado não é valida, EX: BA.');
      done();
    });

  test(`[ ERR: 001-014 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.city = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Cidade é obrigatória.');
      done();
    });

  test(`[ ERR: 001-015 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.street = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Rua é obrigatória.');
      done();
    });

  test(`[ ERR: 001-016 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.district = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Bairro é obrigatória.');
      done();
    });

  test(`[ ERR: 001-017 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'CEP é obrigatória.');
      done();
    });

  test(`[ ERR: 001-018 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Latitude é obrigatória.');
      done();
    });

  test(`[ ERR: 001-019 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = '5555';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Latitude informada não é valida.');
      done();
    });

  test(`[ ERR: 001-020 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = undefined;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Longitude é obrigatoria.');
      done();
    });

  test(`[ ERR: 001-021 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = '5555';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Longitude informada não é valida.');
      done();
    });
});
