const defaultEnv = {
  db: {
    uri: process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || '127.0.0.1'}/wouvy`,
    options: {
      useMongoClient: true,
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false,
    promise: Promise,
  },
  port: process.env.PORT || 3001,
  host: process.env.HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV,
  appUrl: 'http://localhost:3000',
  mailer: {
    from: 'Wouvy <tech@wouvy.fr>',
    options: {
      host: 'mail.gandi.net',
      port: 587,
      auth: {
        user: 'tech@wouvy.fr',
        pass: 'WouvyTech176@$!',
      },
    },
  },
  aws: {
    accessKey: 'AKIAJTH2RLX42DZTGELA',
    secretAccessKey: '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',
    region: 'eu-west-1',
    bucket: 'wouvy-uploads',
  },
  jwtSecret: '@JwtSecretKey',
  jwtExpiresIn: '48h',
  userRoles: {
    member: {
      level: 0,
      label: 'membre',
    },
    moderator: {
      level: 1,
      label: 'moderateur',
    },
    admin: {
      level: 2,
      label: 'admin',
    },
    0: {
      level: 0,
      label: 'membre',
    },
    1: {
      level: 1,
      label: 'moderateur',
    },
    2: {
      level: 2,
      label: 'admin',
    },
  },
  rights: {
    NONE: {
      level: 0,
      name: 'Aucun',
    },
    READ: {
      level: 1,
      name: 'Lire',
    },
    PARTICIPATE: {
      level: 2,
      name: 'Participer',
    },
    WRITE: {
      level: 3,
      name: 'Ecrire',
    },
    MODERATE: {
      level: 4,
      name: 'Modérer',
    },
  },
  taskStatus: [
    {
      value: 0,
      label: 'To do',
    },
    {
      value: 1,
      label: 'Doing',
    },
    {
      value: 2,
      label: 'Done',
    },
  ],
};

export default defaultEnv;
