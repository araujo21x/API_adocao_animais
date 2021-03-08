import supertest from 'supertest';
import path from 'path';

import app from '../../src/server';
import { testErrors } from '../helper';
import startConnection from '../../src/database/index';
import { emailONG, password } from '../fields';

const endPoint: string = '/v1/user/register';
const request = supertest(app);
const filePath = path.resolve(__dirname, '..', 'files', 'imgProfile1.png');

const user = (): any => ({
  name: 'UserOng',
  type: 'ong',
  whatsApp: '74987654321',
  telephone: '74987654321',
  email: emailONG(2),
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

describe('Suit de tests register user type common', () => {
  test(`register common user [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(user());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test(`[ ERR: 001-001 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.name;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Nome é obrigatório.');
      done();
    });

  test(`[ ERR: 001-002 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.type = 'erro';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Tipo informado não cadastrado.');
      done();
    });

  test(`[ ERR: 001-004 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.email;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Email é obrigatório.');
      done();
    });

  test(`[ ERR: 001-005 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.email = 'erro.com.br';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
      done();
    });

  test(`[ ERR: 001-006 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.password;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha é Obrigatória.');
      done();
    });

  test(`[ ERR: 001-007 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.password = '1526';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha precisa ter oito ou mais digtos.');
      done();
    });
  test(`[ ERR: 001-011 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Foto é obrigatória.');
      done();
    });
  test(`[ ERR: 001-012 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.uf;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'UF é obrigatória.');
      done();
    });

  test(`[ ERR: 001-013 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.uf = 'Bahia';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'UF informado não é valida, EX: BA.');
      done();
    });

  test(`[ ERR: 001-014 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.city;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Cidade é obrigatória.');
      done();
    });

  test(`[ ERR: 001-015 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.street;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Rua é obrigatória.');
      done();
    });

  test(`[ ERR: 001-016 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.district;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Bairro é obrigatória.');
      done();
    });

  test(`[ ERR: 001-017 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.postalCode;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'CEP é obrigatória.');
      done();
    });

  test(`[ ERR: 001-018 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.latitude;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Latitude é obrigatória.');
      done();
    });

  test(`[ ERR: 001-019 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.latitude = 5555;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Latitude informada não é valida.');
      done();
    });

  test(`[ ERR: 001-020 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.longitude;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Longitude é obrigatoria.');
      done();
    });

  test(`[ ERR: 001-021 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.longitude = 5555;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Longitude informada não é valida.');
      done();
    });

  test(`[ ERR: 001-022 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.email = emailONG(1);

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Email já cadastrado.');
      done();
    });

  test(`[ ERR: 001-023 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.telephone = '987654321';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Número de telefone inválido.');
      done();
    });

  test(`[ ERR: 001-024 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.whatsApp = '987654321';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Número de whatsapp inválido.');
      done();
    });

  test(`[ ERR: 001-025 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.postalCode = '9999';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'CEP inválido.');
      done();
    });
});
