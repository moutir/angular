const extension = window.location.host.split('.').pop();

export const environment = {
  production: true,
  api: {
    host: {
      phalcon: '',
      symfony: 'https://app.realforce.' + extension,
    },
  },
  recaptcha: {
    siteKey: '6LfUT7MUAAAAAAcYeD0Bt2G5DTrZoIbQtewoSeER',
  },
  fisher: {
    assets: {
      host: 'https://crm.realforce.ch',
    },
  },
};
