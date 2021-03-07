import supertest from 'supertest';

import { ResponseMessages } from '../src/helpers/response/responseMessages';
import app from '../src/server';
import { password } from './fields';
const request = supertest(app);

export const testErrors = (result: any, msg: string) => {
  const { code, type, mensagem } = result;
  Object.keys(ResponseMessages).forEach((codeErr) => {
    if (codeErr === code) {
      expect(type).toBe('E');
      expect(mensagem).toBe(msg);
    }
  });
};

export const getTokenIdUser = async (username: string) => {
  const { body: { token, id } } = await request.post('/v1/login').send({ username, password });
  return { token, id };
};
