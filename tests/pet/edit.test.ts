import supertest from 'supertest';
import { getRepository } from 'typeorm';

import app from '../../src/server';
import { testErrors, getTokenIdUser } from '../helper';
import { emailCommon } from '../fields';
import startConnection from '../../src/database/index';
import Pet from '../../src/database/entity/Pet.entity';

const endPoint: string = '/v1/pets/';
const request = supertest(app);

const editPet = () => ({
  name: 'editado com Sucesso',
  sex: 'female',
  status: 'adopted',
  species: 'dog',
  phase: 'adult',
  castration: 'Não Castrado',
  race: 'Vira-lata',
  vaccination: 'Não Vacinado',
  eyeColor: 'Verde',
  hairColor: 'Branco',
  feature: 'Problema no olho esquerdo'
});

let token: string;
let id: number;
let idError: number;

beforeAll(async () => {
  await startConnection();
  token = await getTokenIdUser(emailCommon(3));

  const pet:any = await getRepository(Pet).findOne({ name: 'loganEdit1' });
  id = pet.id;

  const pet2:any = await getRepository(Pet).findOne({ name: 'erroEditId' });
  idError = pet2.id;
});

describe('Suit de tests for edit pet ', (): void => {
  test(`edit pet [ success ] [ ${endPoint}:id ]`,
    async (done: jest.DoneCallback) => {
      const send = editPet();
      const { status, body } = await request.put(`${endPoint}${id}`)
        .set('authorization', `Bearer ${token}`)
        .send(send);

      expect(status).toBe(200);
      expect(body).toBeTruthy();
      done();
    });

  test(`[ No token provided ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.put(`${endPoint}${id}`)
      .send(editPet());

    expect(status).toBe(401);
    testErrors(error, 'No token provided');
    done();
  });

  test(`[ token error ] - [ ${endPoint}:id ]`, async done => {
    const { status, body: { error } } = await request.put(`${endPoint}${id}`)
      .set('authorization', 'Bearer djfaklsdjflajsldjfljkas')
      .send(editPet());

    expect(status).toBe(401);
    testErrors(error, 'token error');
    done();
  });

  test(`[ 002-001 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.sex = 'masculino';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Sexo informado não é valido.');
    done();
  });

  test(`[ 002-002 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.status = 'adotado';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Status informado inválido.');
    done();
  });

  test(`[ 002-003 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.species = 'papagaio';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Especie informado inválido, EX: gato ou cachorro.');
    done();
  });

  test(`[ 002-004 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.phase = 'feto';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'fase informada inválida.');
    done();
  });

  test(`[ 002-005 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.castration = 'erro';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Castração informada inválida.');
    done();
  });

  test(`[ 002-006 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    send.vaccination = 'erro';
    const { status, body: { result } } = await request.put(`${endPoint}${id}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Vacinação informada inválida.');
    done();
  });

  test(`[ 006-001 ] - [ ${endPoint}:id ]`, async done => {
    const send: any = editPet();
    const { status, body: { result } } = await request.put(`${endPoint}${idError}`)
      .set('authorization', `Bearer ${token}`)
      .send(send);

    expect(status).toBe(404);
    testErrors(result, 'Animal não pertence a usuário logado.');
    done();
  });
});
