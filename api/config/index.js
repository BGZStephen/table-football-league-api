
const configs = {
  development: {
    database: 'mongodb://testuser:testpassword1@ds137540.mlab.com:37540/bgzstephen-table-football-league',
    jwtSecret: 'testing',
  },
}

module.exports = configs[global.ENV]
