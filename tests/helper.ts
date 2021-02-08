import { ResponseMessages } from '../src/helpers/response/responseMessages';

export const testErrors = (result: any, msg: string) => {
  const { code, type, mensagem } = result;
  Object.keys(ResponseMessages).forEach((codeErr) => {
    if (codeErr === code) {
      expect(type).toBe('E');
      expect(mensagem).toBe(msg);
    }
  });
};
