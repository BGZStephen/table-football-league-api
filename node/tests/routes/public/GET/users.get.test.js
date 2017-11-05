const request = require('supertest');

describe('Test the users GET route', () => {
  test('It should respond with 200 and an array of users', (done) => {
    request('http://localhost:3000')
    .get('/users')
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
});
