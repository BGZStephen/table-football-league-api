const fs = require('fs');
const Promise = require('bluebird');
const validate = require('../validate');
const config = require('../../config');
const ejs = require('ejs');
const path = require('path');
const mailjet = require('node-mailjet').connect(config.mailJet.apiKey, config.mailJet.apiSecret, {
	url: 'api.mailjet.com',
	version: 'v3.1',
});

const ejsRenderFile = Promise.promisify(ejs.renderFile);

async function sendEmail(params) {

	validate(params, {
		from: 'From is a required parameter',
		to: 'To is a required parameter',
		subject: 'Subject is a required parameter',
		template: 'HTML template name is required',
	})

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

async function contactFormEmail(message) {
	if (!message) {
		throw new Error('Message required for contact form submission');
	}

	const params = {
		to: 'sjw948@gmail.com',
		from: `stephen@stephenwright.co.uk`,
		subject: `A new contact form message from ${message.name}`,
		template: 'contact-form.ejs',
		data: message,
	}

	return await sendEmail(params);
}

module.exports = {
	welcomeEmail,
	contactFormEmail,
};
