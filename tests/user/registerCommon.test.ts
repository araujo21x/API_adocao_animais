import supertest from 'supertest';
import path from 'path';

import app from '../../src/server';
import { testErrors } from '../helper';
import startConnection from '../../src/database/index';
import { emailCommon, emailONG, password } from '../fields';

const endPoint: string = '/v1/user/register';
const request = supertest(app);
const filePath = path.resolve(__dirname, '..', 'files', 'imgProfile1.png');

const user = () => ({
  name: 'User',
  lastName: 'common',
  whatsApp: '(31) 9 1234-5678',
  telephone: '(31) 9 1234-5678',
  type: 'common',
  birthday: '21/02/1997',
  email: emailCommon(1),
  password,
  uf: 'BA',
  city: 'city test',
  postalCode: '48970-000',
  addressNumber: '1200a',
  street: 'street test',
  district: 'district test'
});

beforeAll(async () => {
  await startConnection();
});

describe('Suit de tests register user type common', () => {
  test(`register common user [ success ] [ ${endPoint} ]`, async done => {
    const { status, body } = await request.post(endPoint)
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

      const { status, body: { result } } = await request.post(endPoint)
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
      testErrors(result, 'Senha precisa ter oito ou mais dígitos.');
      done();
    });

  test(`[ ERR: 001-008 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.lastName;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Sobrenome é obrigatório para usuário comum.');
      done();
    });

  test(`[ ERR: 001-009 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      delete send.birthday;

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Aniversário é obrigatório.');
      done();
    });

  test(`[ ERR: 001-010 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.birthday = '21/02/2010';

      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'É obrigatório ter mais de 16 anos.');
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

  test(`[ ERR: 001-026 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = user();
      send.birthday = '9999.555';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .attach('photoProfile', filePath)
        .field(send);

      expect(status).toBe(404);
      testErrors(result, 'Data de aniversario inválido, EX: 21/02/2000.');
      done();
    });
});
