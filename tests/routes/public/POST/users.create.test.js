const request = require('supertest');

describe('Test the users POST route', () => {
  // test('It should respond with 500 due to missing firstName', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     email: 'test1@test.com',
  //     lastName: 'McTest',
  //     password: 'password',
  //     confirmPassword: 'password'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
  // test('It should respond with 500 due to missing Email', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     firstName: 'mrTest',
  //     lastName: 'McTest',
  //     password: 'password',
  //     confirmPassword: 'password'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
  // test('It should respond with 500 due to missing Password', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     email: 'test1@test.com',
  //     firstName: 'mrTest',
  //     lastName: 'McTest',
  //     confirmPassword: 'password'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
  // test('It should respond with 500 due to missing confirmPassword', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     email: 'test1@test.com',
  //     firstName: 'mrTest',
  //     lastName: 'McTest',
  //     password: 'password'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
  // test('It should respond with 500 due to password not matching confirmPassword', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     email: 'test1@test.com',
  //     firstName: 'mrTest',
  //     lastName: 'McTest',
  //     password: 'password',
  //     confirmPassword: 'notCorrectPassword'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
  test('It should respond with 200 + new user', (done) => {
    request('http://localhost:3000')
    .post('/users')
    .send({
      email: 'test1@test.com',
      firstName: 'mrTest',
      lastName: 'McTest',
      password: 'password',
      confirmPassword: 'password'
    })
    .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
    });
  });
  // test('It should respond with 500 due to duplicate email', (done) => {
  //   request('http://localhost:3000')
  //   .post('/users')
  //   .send({
  //     email: 'test1@test.com',
  //     firstName: 'mrTest',
  //     lastName: 'McTest',
  //     password: 'password',
  //     confirmPassword: 'password'
  //   })
  //   .then((response) => {
  //       expect(response.statusCode).toBe(500);
  //       done();
  //   });
  // });
});
