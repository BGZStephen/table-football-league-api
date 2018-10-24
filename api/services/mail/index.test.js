const {doMock} = require('../../../tests/jest-utils');

doMock('node-mailjet', () => {
  return {
    connect: jest.fn(),
  }
})

doMock('ejs');
doMock('api/config', () => {
  return {
    mail: {
      fromEmail: 'info@my-table-football.com',
      fromName: 'stephen',
    },
    mailjet: {
      apiKey: 'APIKEY',
      apiSecret: 'APISECRET'
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks();
});

const mailer = require('./');

describe('mailer', () => {
  describe('passwordResetEmail()', () => {
    test('triggers a send with the correct data params', () => {
      const send = mailer.__send;
      const sendFunction = function() {}
      mailer.__send = jest.fn().mockReturnValue(sendFunction)
      const data = {
        recipients: ['stephen@test.com']
      }

      const res = mailer.passwordResetEmail(data);
      expect(res).toEqual(sendFunction)

      mailer.__send = send;
    })
  })

  describe('send()', () => {
    test('sends with the correct data params', async () => {
      const mailerFunction = function() {}
      require('ejs').renderFile.mockResolvedValue('<html></html>')
      require('node-mailjet').connect.mockReturnValue({
        post: jest.fn().mockReturnThis(),
        request: jest.fn().mockReturnValue(mailerFunction),
      })


      const data = {
        FromEmail: 'info@my-table-football.com',
        FromName: 'stephen',
        subject: 'Password reset - My Table Football',
        template: 'password-reset',
        recipients: ['stephen@test.com'],
        attachments: [{type: 'jpg', name: 'testImage', content: 'AABBCCDD'}]
      }

      const res = await mailer.__send(data)
      expect(res).toEqual(mailerFunction)
    })

    test('sends with the correct data params', async () => {
      const mailerFunction = function() {}
      require('ejs').renderFile.mockResolvedValue('<html></html>')
      require('node-mailjet').connect.mockReturnValue({
        post: jest.fn().mockReturnThis(),
        request: jest.fn().mockReturnValue(mailerFunction),
      })

      const data = {
        FromEmail: 'info@my-table-football.com',
        FromName: 'stephen',
        subject: 'Password reset - My Table Football',
        template: 'password-reset',
        recipients: ['stephen@test.com'],
      }

      const res = await mailer.__send(data)
      expect(res).toEqual(mailerFunction)
    })
  })
});