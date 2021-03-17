import supertest from 'supertest';

import { testErrors } from '../helper';
import { emailONG } from '../fields';
import app from '../../src/server';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/recoverPassword';
const request = supertest(app);

beforeAll(async () => {
  await startConnection();
});

describe('Suit de tests for recover password', (): void => {
  test('recover password sucess [ success ] [ /v1/login]',
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(endPoint)
        .send({ email: emailONG(4) });

      expect(status).toBe(200);
      expect(body).toBeTruthy();
      done();
    });

  test('[ ERR: 001-004 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.post(endPoint)
        .send();

      expect(status).toBe(404);
      testErrors(result, 'Email é obrigatório.');
      done();
    });

  test('[ ERR: 001-005 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.post(endPoint)
        .send({ email: 'erro.com' });

      expect(status).toBe(404);
      testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
      done();
    });

  test('[ ERR: 003-001 ] - [ /v1/login ]',
    async (done: jest.DoneCallback) => {
      const { status, body: { result } } = await request.post(endPoint)
        .send({ email: 'erro@example.com' });

      expect(status).toBe(404);
      testErrors(result, 'E-mail informado não cadastrado.');
      done();
    });
});
