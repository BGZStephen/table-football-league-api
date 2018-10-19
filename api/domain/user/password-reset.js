const crypto = require('crypto');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('api/config');

const PasswordReset = mongoose.model('PasswordReset');

async function createPasswordReset(userId) {
  let token = null;

  try {
    token = await crypto.randomBytes(20)
  } catch (e) {
    throw new Error('Error generating token');
  }

  const passwordReset = new PasswordReset ({
    userId: user._id,
    email: user.email,
    token,
    expiry: moment().endOf('day').getTime(),
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