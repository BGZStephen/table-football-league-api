const mailer = require('../../services/mailer');
const winston = require('winston');

/**
 * @api {post} /website/contact-form Create a User
 * @apiName ContactForm
 * @apiGroup Website
 *
 * @apiParam {req} Express request object.
 * @apiParam {req.body}
 * @apiParam {req.body.name} contact form user name
 * @apiParam {req.body.email} contact form user email
 * @apiParam {req.body.message} contact form message
 *
 * @apiSuccess {Object} success: true
 */
async function contactFormSubmission(req, res) {
  try {
    await mailer.contactFormEmail(req.body);
    return res.status(200).json({success: true});
  } catch (error) {
    winston.error(error);
    res.sendStatus(500);
  }
}

module.exports = {
  contactFormSubmission,
}
