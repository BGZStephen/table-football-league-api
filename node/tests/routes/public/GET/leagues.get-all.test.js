const request = require('supertest');

describe('Test the leagues GET All route', () => {
  test('It should respond with 200 and an array of leagues', (done) => {
    request('http://localhost:3000')
    .get('/leagues')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
