const crypto = require('crypto');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('api/config');

const PasswordReset = mongoose.model('PasswordReset');

async function createPasswordReset(user) {
  let token = null;

  try {
    token = crypto.randomBytes(64).toString('hex')
  } catch (e) {
    throw new Error('Error generating token');
  }

  const passwordReset = await PasswordReset.create({
    userId: user._id,
    email: user.email,
    token,
    expiry: moment().endOf('day').valueOf(),
  })

  return passwordReset;
}

function generatePasswordResetUrl(passwordReset) {
  if (!module.exports.__config.dashboardUrl) {
    throw new Error('Missing dashboard URL in config')
  }

  if (!passwordReset || !passwordReset.token) {
    throw new Error('Missing password reset token')
  }

  return `${module.exports.__config.dashboardUrl}/password-reset/${passwordReset.token}`;
}

module.exports = {
  createPasswordReset,
  generatePasswordResetUrl,
  __config: config
}