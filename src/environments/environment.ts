// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api: {
    host: {
      phalcon: '',
      symfony: 'http://crm.rf.test:8080',
    },
  },
  recaptcha: {
    siteKey: '6LeBT7MUAAAAAJaIJROM6J7w3yB76KuMbq2KTUxg',
  },
  fisher: {
    assets: {
      host: 'http://crm.realforce.test',
    },
  },
};
