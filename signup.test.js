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

test('adding a resource without a token is blocked', async () => {
  const res = await request(app)
    .post('/resources')
    .send({ name: 'Test Pantry', category: 'food' });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Not logged in');
});

test('filtering by a category with no resources returns an empty list', async () => {
  const res = await request(app)
    .get('/resources?category=nothing-here');

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual([]);
});

const jwt = require('jsonwebtoken');

test('deleting a resource that does not exist returns 404', async () => {
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);

  const res = await request(app)
    .delete('/resources/999999')
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(404);
  expect(res.body.error).toBe('Resource not found');
});
