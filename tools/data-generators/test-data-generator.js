// bootstrap
require('../../api/app.js');
const mongoose = require('mongoose');
const TestUsers = require('./test-user-data');

const User = mongoose.model('User');

async function generateTestUsers() {
  console.log('starting')
  for (let testUser of TestUsers) {
    const user = new User(testUser)
    try {
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
  console.log('finished');
  process.exit()
}

generateTestUsers();
