const mailer = require('../../services/mailer');
const AsyncWrap = require('../../utils/async-wrapper');

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
const contactFormSubmission = AsyncWrap(async function (req, res) {
  await mailer.contactFormEmail(req.body);
  res.status(200).json({success: true});
})

module.exports = {
  contactFormSubmission,
}
