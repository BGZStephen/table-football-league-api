const request = require('supertest');
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
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
});
