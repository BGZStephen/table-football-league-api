const configs = {
  development: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
    cloudinary: {
      cloud_name: '$CLOUD_NAME',
      api_key: '$API_KEY',
      api_secret: '$API_SECRET'
    },
  },
  staging: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
    cloudinary: {
      cloud_name: '$CLOUD_NAME',
      api_key: '$API_KEY',
      api_secret: '$API_SECRET'
    },
  },
  production: {
    database: '$DATABASE_URL',
    authorization: '$AUTHORIZATION',
    jwtSecret: '$JWT_SECRET',
    cloudinary: {
      cloud_name: '$CLOUD_NAME',
      api_key: '$API_KEY',
      api_secret: '$API_SECRET'
    },
  },
}

module.exports = configs[global.ENV]
