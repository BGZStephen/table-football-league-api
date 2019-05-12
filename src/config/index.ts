interface IConfigBase {
  env: string;
  database: string;
  jwtSecret: string;
  dashboardUrl: string;
  mail: {
    defaults: {
      from: string;
      name: string;
    }
  }
  mailjet: {
    apiKey: string;
    apiSecret: string;
  }
}

interface IDevelopmentConfig extends IConfigBase {};
interface IStagingConfig extends IConfigBase {};
interface IProductionConfig extends IConfigBase {};

interface IConfigs {
  development: IDevelopmentConfig;
  staging: IStagingConfig;
  production: IProductionConfig;
}

const configs: IConfigs = {
  development: {
    env: 'development',
    database: 'mongodb://localhost/mytablefootball',
    jwtSecret: 'testing',
    dashboardUrl: 'http://localhost:9000',
    mail: {
      defaults: {
        from: 'sjw948@gmail.com',
        name: 'The MyTableFootball Team',
      }
    },
    mailjet: {
      apiKey: '18b36c0843618ae057cb4a444f30297e',
      apiSecret: '552a5cd2473ca1bbe6f7c9f0d716e77f'
    }
  },
  staging: {
    env: 'staging',
    database: 'mongodb://localhost/mytablefootball',
    jwtSecret: 'testing',
    dashboardUrl: 'http://localhost:9000',
    mail: {
      defaults: {
        from: 'sjw948@gmail.com',
        name: 'The MyTableFootball Team',
      }
    },
    mailjet: {
      apiKey: '18b36c0843618ae057cb4a444f30297e',
      apiSecret: '552a5cd2473ca1bbe6f7c9f0d716e77f'
    }
  },
  production: {
    env: 'production',
    database: 'mongodb://localhost/mytablefootball',
    jwtSecret: 'testing',
    dashboardUrl: 'http://localhost:9000',
    mail: {
      defaults: {
        from: 'sjw948@gmail.com',
        name: 'The MyTableFootball Team',
      }
    },
    mailjet: {
      apiKey: '18b36c0843618ae057cb4a444f30297e',
      apiSecret: '552a5cd2473ca1bbe6f7c9f0d716e77f'
    }
  },
}

export const config = configs[process.env.NODE_ENV || 'development']
