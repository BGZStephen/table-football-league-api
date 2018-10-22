const config = require('api/config');
const jwt = require('jsonwebtoken');

async function generateUserToken(user) {
  console.log(config)
  if (!config.jwtSecret) {
    throw new Error('Missing secret phrase')
  }

  if (!user || !user._id || !user.email) { 
    throw new Error('Invalid User')
  }

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365),
    data: {
      id: user._id,
      email: user.email,
    }
  }, config.jwtSecret);

  return token;
}

module.exports = {
  generateUserToken,
}