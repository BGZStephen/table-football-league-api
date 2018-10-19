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

  const passwordReset = new PasswordReset ({
    userId: user._id,
    email: user.email,
    token,
    expiry: moment().endOf('day').valueOf(),
  })

  await passwordReset.save();
  return passwordReset;
}

function generatePasswordResetUrl(passwordReset) {
  return `${config.dashboardUrl}/password-reset/${passwordReset.token}`;
}

module.exports = {
  createPasswordReset,
  generatePasswordResetUrl
}