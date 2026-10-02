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

test('login rejects an email that does not exist', async () => {
  const res = await request(app)
    .post('/login')
    .send({ email: 'nobody@example.com', password: 'whatever123' });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Invalid email or password');
});
