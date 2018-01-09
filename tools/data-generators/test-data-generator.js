// bootstrap
require('../../api/app.js');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const League = mongoose.model('League');
const Fixture = mongoose.model('Fixture');

generateTestData();

async function generateTestData() {
  await generateTestUsers();
  await generateTestTeams();
  await generateTestLeagues();
  await generateTestFixtures();
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

    for (const team of teams) {
      await league.addTeam(team._id);
      const teamUpdates = await team.addLeague(league._id);
      await teamUpdates.save();
    }

    await league.save();
  }
}

async function generateTestFixtures() {
  try {
    const testFixtures = require('./test-fixture-data');

    for (const testFixture of testFixtures) {
      const homeTeam = await Team.findOne({name: testFixture.homeTeam});
      const awayTeam = await Team.findOne({name: testFixture.awayTeam});
      let league = null;
      if (testFixture.league) {
        league = await League.findOne({name: testFixture.league}).select('_id fixtures');
      }

      const fixture = new Fixture({
        teams: [homeTeam._id, awayTeam._id],
        fictureDate: testFixture.fixtureDate,
        type: testFixture.type,
        leagueId: league ? league._id : undefined,
      });

      await fixture.save();
    }
  } catch (err) {
    console.log(err);
  }
}
