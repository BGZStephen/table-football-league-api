// bootstrap
require('../../api/app.js');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Team = mongoose.model('Team');

generateTestData();

async function generateTestData() {
  await generateTestUsers();
  await generateTestTeams();
  process.exit();
}

async function generateTestUsers() {
  const TestUsers = require('./test-user-data');

  for (let testUser of TestUsers) {
    const user = new User(testUser)
    try {
      await user.save();
    } catch (error) {
      // console.log(error);
    }
  }
}

async function generateTestTeams() {
  const TestTeams = require('./test-team-data');

  for (let testTeam of TestTeams) {
    const team = new Team({
      name: testTeam.name,
      players: []
    })

    for (const playerEmail of testTeam.playerEmails) {
      const player = await User.findOne({email: playerEmail})
      console.log(player);
      team.players.push(player._id);
    }

    try {
      await team.save();
    } catch (error) {
      // console.log(error);
    }
  }
}
