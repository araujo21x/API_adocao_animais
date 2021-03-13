import supertest from 'supertest';

import app from '../../src/server';
import { testErrors } from '../helper';
import startConnection from '../../src/database/index';
import { password } from '../fields';

const loginEndPoint: string = '/v1/login';
const request = supertest(app);

const login = () => ({
  email: 'login@example.com',
  password
});

beforeAll(async () => {
  await startConnection();
});

describe('Suit de tests for login', (): void => {
  test('login sucess [ success ] [ /v1/login]',
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(loginEndPoint)
        .send(login());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test('[ ERR: 001-004 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.email = undefined;
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'Email é obrigatório.');
      done();
    });

  test('[ ERR: 001-005 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.email = 'erro.com';
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
      done();
    });

  test('[ ERR: 001-006 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.password = undefined;
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'Senha é Obrigatória.');
      done();
    });

  test('[ ERR: 001-007 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.password = '102030';
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'Senha precisa ter oito ou mais dígitos.');
      done();
    });

  test('[ ERR: 003-001 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.email = 'erro@example.com';
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'E-mail informado não cadastrado.');
      done();
    });

  test('[ ERR: 003-002 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const value: any = login();
      value.password = '40302010';
      const { status, body: { result } } = await request.post(loginEndPoint)
        .send(value);

      expect(status).toBe(404);
      testErrors(result, 'Senha informada não pertence a esse usuário.');
      done();
    });
});
