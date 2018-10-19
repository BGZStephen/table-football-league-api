
const configs = {
  development: {
    database: 'mongodb://localhost/wriggleapp',
    jwtSecret: 'testing',
  },
  dashboardUrl: 'http://localhost:9000',
  mail: {
    defaultFrom: 'sjw948@gmail.com',
    defaultName: 'The MyTableFootball Team',
  },
  mailjet: {
    apiKey: '18b36c0843618ae057cb4a444f30297e',
    secret: '552a5cd2473ca1bbe6f7c9f0d716e77f'
  }
}

module.exports = configs[global.ENV]
