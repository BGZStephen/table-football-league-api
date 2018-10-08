const fs = require('fs');
const Promise = require('bluebird');
const config = require('../../config');
const ejs = require('ejs');
const path = require('path');
const mailjet = require('node-mailjet').connect(config.mailJet.apiKey, config.mailJet.apiSecret, {
	url: 'api.mailjet.com',
	version: 'v3.1',
});

const ejsRenderFile = Promise.promisify(ejs.renderFile);

/**
 * Sends an email using the MailJet API
 * @param {Object} params object to validate existance of keys on.
 * @param {String} params.from senders email
 * @param {String} params.to recipients email
 * @param {String} params.subject email subject line
 * @param {String} params.template ejs template name
 */
async function sendEmail(params) {

	// validate(params, {
	// 	from: 'From is a required parameter',
	// 	to: 'To is a required parameter',
	// 	subject: 'Subject is a required parameter',
	// 	template: 'HTML template name is required',
	// })

  const emailParams = {
    'Messages':[{
      'From': {
        'Email': `${params.from}`,
        'Name': `${params.fromName ? params.fromName : ''}`
      },
      'To': [{
        'Email': `${params.to}`,
        'Name': `${params.toName ? params.toName : ''}`
      }],
      'Subject': `${params.subject}`,
      'TextPart': `${params.textPart ? params.textPart : ''}`,
      'HTMLPart': await ejsRenderFile(path.join(__dirname, `./templates/${params.template}`), params.data ? {data: params.data} : {}),
    }]
  };

	await mailjet.post('send').request(emailParams);
	return {success: true};
}

/**
 * prepares a user welcome email to be sent
 * @param {Object} user User object
 * @param {String} user.email users email
 * @param {String} user.name users name
 */
async function welcomeEmail(user) {
	if (!user) {
		throw new Error('User required for welcome email');
	}

	const params = {
		to: user.email,
		from: 'stephen@stephenwright.co.uk',
		subject: `Welcome to Table Football League ${user.name}`,
		template: 'welcome.ejs',
	}

	return await sendEmail(params);
}

/**
 * prepare a contact form submission to email
 * @param {Object} contactFormParams params object
 * @param {String} contactFormParams.email submitters email
 * @param {String} contactFormParams.name submitters name
 * @param {String} contactFormParams.message submitters message
 */
async function contactFormEmail(contactFormParams) {
	if (!message) {
		throw new Error('Message required for contact form submission');
	}

	const emailParams = {
		to: 'sjw948@gmail.com',
		from: `stephen@stephenwright.co.uk`,
		subject: `A new contact form message from ${message.name}`,
		template: 'contact-form.ejs',
		data: message,
	}
	return await sendEmail(emailParams);
}

module.exports = {
	welcomeEmail,
	contactFormEmail,
};
