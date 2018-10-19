
const configs = {
  development: {
    database: 'mongodb://localhost/wriggleapp',
    jwtSecret: 'testing',
  },
  dashboardUrl: 'http://localhost:9000'
}

module.exports = configs[global.ENV]
