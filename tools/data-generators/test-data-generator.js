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
      players: []
    })

    for (const playerEmail of testTeam.playerEmails) {
      const player = await User.findOne({email: playerEmail})
      team.players.push(player._id);
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
  const teams = await Team.find({});

  for (let testLeague of testLeagues) {
    const league = new League(testLeague)
    league.teams = [];

    for (const team of teams) {
      league.teams.push(team._id);
    }

    try {
      await league.save();
    } catch (error) {
      console.log(error);
    }
  }
}
