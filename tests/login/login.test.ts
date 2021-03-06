import supertest from 'supertest';

import app from '../../src/server';
import { testErrors } from '../helper';
import { password } from '../fields';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/login';
const request = supertest(app);

const login = (): any => ({
  email: 'login@example.com',
  password
});

beforeAll(async () => {
  await startConnection();
});

describe('Suit de tests login', (): void => {
  test(`login [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .send(login());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test(`[ ERR: 001-004 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.email = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Email é obrigatório.');
      done();
    });

  test(`[ ERR: 001-005 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.email = 'erro.com';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
      done();
    });

  test(`[ ERR: 001-006 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.password = undefined;
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha é Obrigatória.');
      done();
    });

  test(`[ ERR: 001-007 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.password = '102030';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha precisa ter mais de oitos digtos.');
      done();
    });

  test(`[ ERR: 003-001 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.email = 'erro@example.com';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'E-mail informado não cadastrado.');
      done();
    });

  test(`[ ERR: 003-002 ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const send: any = login();
      send.password = 'erro@example.com';
      const { status, body: { result } } = await request.post(`${endPoint}`)
        .send(send);

      expect(status).toBe(404);
      testErrors(result, 'Senha informada não pertence a esse usuário.');
      done();
    });
});
