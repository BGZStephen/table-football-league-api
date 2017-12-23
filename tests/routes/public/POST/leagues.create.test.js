const request = require('supertest');

describe('Test the leagues POST route', () => {
  test('It should respond with 500 due to missing league name', (done) => {
    request('http://localhost:3000')
    .post('/leagues')
    .send({})
    .then((response) => {
        expect(response.statusCode).toBe(500);
        done();
    });
  });
  test('It should respond with 200 + new league', (done) => {
    request('http://localhost:3000')
    .post('/leagues')
    .send({
      name: 'myTestLeague'
    })
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  test('It should respond with 500 due to duplicate league name', (done) => {
    request('http://localhost:3000')
    .post('/leagues')
    .send({
      name: 'myTestLeague'
    })
    .then((response) => {
        expect(response.statusCode).toBe(500);
        done();
    });
  });
});
