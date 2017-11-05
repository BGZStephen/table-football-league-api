const request = require('supertest');

describe('Test the users PUT route', () => {
  test('It should respond with 200 and an updated user', (done) => {
    request('http://localhost:3000')
    .put('/users/59ff297327e8d20e50eae671')
    .send({
      email: 'test1@test.com',
      lastName: 'McTest',
      password: 'password',
    })
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
});
