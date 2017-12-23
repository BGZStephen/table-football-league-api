const request = require('supertest');

describe('Test the users PUT route', () => {
  test('It should respond with 200 and an updated user', (done) => {
    request('http://localhost:3000')
    .put('/users/5a0011cc7d1e69281b31ed46')
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
