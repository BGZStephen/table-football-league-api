// const mailer = require('../../services/mailer');
const winston = require('winston');

async function contactFormSubmission(req, res) {
  try {
    await mailer.contactFormEmail(req.body);
    return res.status(200).json({success: true});
  } catch (error) {
    winston.error(error);
    res.statusMessage = error;
    res.sendStatus(500);
  }
}

module.exports = {
  contactFormSubmission,
}
