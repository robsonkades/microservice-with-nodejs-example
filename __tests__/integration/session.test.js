import request from 'supertest';

import app from '../../src/app';
import factory from '../utils/factories';
import MongoMock from '../utils/mongoMock';
import truncate from '../utils/truncate';

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  it('Deve retornar erro 400 ao validar o input', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'admin@super.com',
        password: null,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({ error: 'Validação falhou!' });
  });

  it('Deve retornar erro 400 ao validar o input', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: null,
        password: 'sads',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({ error: 'Validação falhou!' });
  });

  it('Deve retornar erro 401 quando não encontrar o usuário', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'admin@super.com',
        password: '123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Usuário e/ou senha inválidos',
    });
  });

  it('Deve retornar erro 401 quando a senha for inválida', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body).toMatchObject({
      error: 'Usuário e/ou senha inválidos',
    });
  });

  it('Deve retornar erro 200 com um token válido', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });
});
