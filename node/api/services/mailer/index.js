const Promise = require('bluebird');
const validate = require('../validate');
const config = require('../../config');
const ejs = require('ejs');
const mailjet = require('node-mailjet').connect(config.mailJet.apiKey, config.mailJet.apiSecret, {
	url: 'api.mailjet.com',
	version: 'v3.1',
});

const ejsRenderFile = Promise.promisify(ejs.renderFile);

async function sendEmail(params) {

	if (!params.from) {
		throw new Error('From is a required parameter');
	}

	if (!params.to) {
		throw new Error('To is a required parameter');
	}

	if (!params.subject) {
		throw new Error('Subject is a required parameter');
	}

	if (!params.template) {
		throw new Error('HTML template name is required');
	}

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
      'HTMLPart': await ejsRenderFile(params.template),
    }]
  };

	await mailjet.post('send').request(emailParams);
	return {success: true};
}

async function welcomeEmail(params) {
	validate(params, {
		from: {presence: true},
		to: {presence: true},
		subject: {presence: true},
		template: {presence: true},
		user: {presence: true}
	});

	return await sendEmail(params);
}

module.exports = {
	welcomeEmail,
};
