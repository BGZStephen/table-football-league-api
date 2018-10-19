const fs = require('fs');
const config = require('api/config');

const mailjet = require ('node-mailjet')
  .connect(config.mailjet.apiKey, config.mailjet.apiSecret)

function send(options) {
  const sendMail = mailjet.post('send');

  const templateFile = fs.readFileSync(`${__dirname}/templates/${options.template}.ejs`, 'utf8');
  const htmlTemplate = ejs.render(templateFile, options.data)

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
    }) : null
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
    data,
  }

 return send(emailOptions);
}

module.exports = {
  passwordResetEmail
};