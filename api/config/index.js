
const configs = {
  development: {
    database: 'mongodb://localhost/wriggleapp',
    jwtSecret: 'testing',
  },
}

module.exports = configs[global.ENV]
