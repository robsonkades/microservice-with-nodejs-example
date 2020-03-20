import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('Deve registrar um usuário', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Robson Kades',
        email: 'robsonkades@outlook.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });
});
