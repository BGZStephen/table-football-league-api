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
    const users = await User.find({email: {$in: testTeam.userEmails}}).select('_id teams')
    const teamUpdates = await team.addUsers(users.map((user) => user._id));
    await teamUpdates.save();
  }
}

async function generateTestLeagues() {
  const testLeagues = require('./test-league-data');
  const teams = await Team.find({});

  for (const testLeague of testLeagues) {
    const league = new League(testLeague);
    await league.save();

    for (const team of teams) {
      console.log(teams)
      await league.addTeam(team._id);
      const teamUpdates = await team.addLeague(league._id);
      await teamUpdates.save();
    }

    await league.save();
  }
}
