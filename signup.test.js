const request = require('supertest');
const app = require('./app.js');
const pool = require('./db.js');

afterAll(() => pool.end());

test('signup rejects a missing password', async () => {
  const res = await request(app)
    .post('/signup')
    .send({ email: 'nopassword@example.com' });

  expect(res.statusCode).toBe(400);
});
