import 'bootstrap';
import moment from 'moment';
import 'moment/locale/bg';
import {I18N} from 'aurelia-i18n';
import {RolesAuthorizeStep} from 'service';
import {inject} from 'aurelia-framework';

import {RoutesConfig} from './routes-config';

@inject(I18N, RoutesConfig)
export class App {
  constructor(i18n, routesConfig) {
    this.i18n = i18n;
    this.routesConfig = routesConfig;
    moment.locale('bg');
  }

  configureRouter(config, router) {
    //config.options.pushState = true;
    config.title = this.i18n.tr('config.pageTitle');
    config.addPipelineStep('authorize', RolesAuthorizeStep);
    config.map(this.routesConfig.getRoutes());
    config.mapUnknownRoutes('./not-found', 'not-found');

    this.router = router;
  }
}
