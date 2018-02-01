const request = require('supertest');
const authorization = '6h9c6Z6htS';
const config = require('../../config')
let app;

beforeEach(function (done) {
  app = require('../../app')
  done();
});

describe('Test the users GET route', () => {
  test('It should respond with 200', (done) => {
    request('http://localhost:3000')
    .get('/users/')
    .set('Authorization', `${authorization}`)
    .then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
