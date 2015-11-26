import 'bootstrap';
import {HostConsts} from './libs/host-consts';

export function configure(aurelia) {
  const hosts = {};
  hosts[HostConsts.cssSystem] = 'http://localhost:58619/api';

  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-animator-css')
    .plugin('aurelia-validation', (config) => {
      config.useLocale('bg-BG');
    })
    .plugin('aurelia-i18n', (instance) => {
      //http://i18next.com/pages/doc_init.html
      instance.setup({
        detectFromHeaders: false,
        lng: 'bg',
        fallbackLng: 'bg',
        ns: 'app',
        resGetPath: 'assets/locales/__lng__/__ns__.json',
        attributes: ['t', 'i18n'],
        useCookie: false
      });
    })
    .plugin('aurelia-dialog')
    .plugin('moshensky/aurelia-bs-grid')
    .plugin('aurelia-custom-common-files', (config) => {
      config.useLocale('bg-BG');
    })
    .plugin('service', (config) => {
      config.useLocale('bg-BG');
      config.setHttpService({
        authHost: 'http://muvarna-dev-tokenendpoint.amvr-ci.int',
        serviceHost: 'http://localhost:51656',
        serviceApiPrefix: '/api/',
        requestTimeout: 30000, // milliseconds
        hosts: hosts
      });
      config.routerAuthStep({
        loginRoute: 'login'
      });
    });

  aurelia.start().then(a => a.setRoot());
}
