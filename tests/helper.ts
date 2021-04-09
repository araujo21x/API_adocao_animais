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

export const getTokenIdUser = async (email: string): Promise<string> => {
  const { body } = await request.post('/v1/login').send({ email, password });
  return body.token;
};
