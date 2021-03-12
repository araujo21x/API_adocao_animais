import supertest from 'supertest';
import path from 'path';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailCommon } from '../fields';
import startConnection from '../../src/database/index';

const endPoint: string = '/v1/user/edit';
const request = supertest(app);
const filePath = path.resolve(__dirname, '..', 'files', 'imgProfile1.png');

const editUser = () => ({
  name: 'successfully edited',
  lastName: 'common successfully',
  whatsApp: '31912345678',
  telephone: '31912345678',
  birthday: '21/02/1995',
  email: 'commonEditUser@example.com',
  password: '40302010',
  uf: 'MG',
  city: 'city editsuccessfully',
  postalCode: '35970-000',
  addressNumber: '370a',
  street: 'street editsuccessfully',
  district: 'district editsuccessfully'
});
let token: string;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(2));
});

describe('Suit de tests for edit Common user ', (): void => {
  test(`edit Common [ success ] [ ${endPoint} ]`,
    async (done: jest.DoneCallback) => {
      const { status, body } = await request.put(endPoint)
        .set('authorization', `Bearer ${token}`)
        .attach('photoProfile', filePath)
        .field(editUser());

      expect(status).toBe(200);
      expect(body).toBeTruthy();

      done();
    });

  test(`[ No token provided ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.put(endPoint)
      .field(editUser());

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint} ]`, async done => {
    const { status, body: { error } } = await request.put(endPoint)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .field(editUser());

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ 001-005 ] - [ ${endPoint} ]`, async done => {
    const send: any = editUser();
    send.email = 'error.com.br';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Email informado não é valido, EX: exemplo@exemplo.com.');
    done();
  });

  test(`[ 001-007 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.password = '102030';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Senha precisa ter oito ou mais dígitos.');
    done();
  });

  test(`[ 001-010 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.birthday = '21/02/2015';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'É obrigatório ter mais de 16 anos.');
    done();
  });

  test(`[ 001-013 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.uf = 'Bahia';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'UF informado não é valida, EX: BA.');
    done();
  });

  test(`[ 001-022 ] - [ ${endPoint} ]`, async done => {
    const send: any = editUser();
    send.email = 'login@example.com';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Email já cadastrado.');
    done();
  });

  test(`[ 001-023 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.telephone = '55664433';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Número de telefone inválido.');
    done();
  });

  test(`[ 001-024 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.whatsApp = '55664433';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Número de whatsapp inválido.');
    done();
  });

  test(`[ 001-025 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.postalCode = '489700';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'CEP inválido.');
    done();
  });

  test(`[ 001-026 ] - [ ${endPoint} ]`, async done => {
    const send = editUser();
    send.birthday = '55/55/2000';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Data de aniversario inválido, EX: 21/02/2000.');
    done();
  });

  test(`[ 005-001 ] - [ ${endPoint} ]`, async done => {
    const send: any = editUser();
    send.type = 'ong';
    const { status, body: { result } } = await request.put(endPoint)
      .set('authorization', `Bearer ${token}`)
      .field(send);

    expect(status).toBe(404);
    testErrors(result, 'Não é possível modificar tipo de usuário.');
    done();
  });
});
