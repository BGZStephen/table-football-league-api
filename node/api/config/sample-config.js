const configs = {
  development: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
  },
  staging: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
  },
  production: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
  },
}

module.exports = configs[global.ENV]
