import request from 'supertest';

import app from '../../src/app';
import Queue from '../../src/lib/Queue';
import MongoMock from '../utils/mongoMock';
import truncate from '../utils/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  it('Deve criar um usuário', async () => {
    // Assemble
    const spy = jest.spyOn(Queue, 'add').mockReturnThis();

    // Action
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Robson Kades',
        email: 'robsonkades@outlook.com',
        password: '123456',
      });

    // Assertions
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith(expect.anything(), expect.anything());
    expect(response.body).toHaveProperty('id', 'name', 'provider');
  });
});
