const config = require('api/config');
const ejs = require('ejs');

async function send(options) {
  const mailjet = require('node-mailjet').connect(config.mailjet.apiKey, config.mailjet.apiSecret)
  const sendMail = mailjet.post('send');
  
  const htmlTemplate = await ejs.renderFile(`${__dirname}/templates/${options.template}.ejs`, options.data, {async: true})

  const mailData = {
    'FromEmail': options.fromEmail,
    'FromName': options.fromName,
    'Subject': options.subject,
    "Html-part": htmlTemplate,
    'Recipients': options.recipients.map(recipient => {return {Email: recipient}}),
    'Attachments': options.attachments ? options.attachments.map(attachment => {
      return {
        "Content-Type": attachment.type,
        "Filename": attachment.name,
        "Content": attachment.content
      }
    }): null
  }

  return sendMail.request(mailData)
}

function passwordResetEmail(data) {
  const emailOptions = {
    fromEmail: config.mail.defaultFrom,
    fromName: config.mail.defaultName,
    subject: 'Password reset - My Table Football',
    template: 'password-reset',
    recipients: data.recipients,
    attachments: [],
    data,
  }

 return module.exports.__send(emailOptions);
}

module.exports = {
  passwordResetEmail,
  __send: send,
};