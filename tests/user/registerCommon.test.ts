import supertest from 'supertest';

import app from '../../src/server';
import { testErrors } from '../helper';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/user/register';
const request = supertest(app);

const user = ():any => ({
  name: 'joao'
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

  test(`[ ERR:  ] - [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.post(`${endPoint}`)
        .send();

      expect(status).toBe(404);
      testErrors(body, '');
      done();
    });
});
