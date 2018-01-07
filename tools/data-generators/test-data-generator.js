// bootstrap
require('../../api/app.js');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const League = mongoose.model('League');

generateTestData();

async function generateTestData() {
  await generateTestUsers();
  await generateTestTeams();
  await generateTestLeagues();
  process.exit();
}

async function generateTestUsers() {
  const testUsers = require('./test-user-data');

  for (let testUser of testUsers) {
    const user = new User(testUser)
    try {
      await user.save();
    } catch (error) {
      // console.log(error);
    }
  }
}

async function generateTestTeams() {
  const testTeams = require('./test-team-data');

  for (let testTeam of testTeams) {
    const team = new Team({
      name: testTeam.name,
    })

    for (const userEmail of testTeam.userEmails) {
      const user = await User.findOne({email: userEmail})
      team.addUser(user._id);
      user.addTeam(team._id);
      await user.save();
    }

    try {
      await team.save();
    } catch (error) {
      // console.log(error);
    }
  }
}

async function generateTestLeagues() {
  const testLeagues = require('./test-league-data');
  const teams = await Team.find({}).populate('users');

  for (let testLeague of testLeagues) {
    const league = new League(testLeague)
    await league.save();

    for (const team of teams) {
      await team.addTeamToLeague(league._id);
      await team.save();
    }

    try {
      await league.save();
    } catch (error) {
      console.log(error);
    }
  }
}
