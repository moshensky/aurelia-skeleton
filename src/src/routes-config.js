import {I18N} from 'aurelia-i18n';
import {inject} from 'aurelia-framework';

@inject(I18N)
export class RoutesConfig {
  constructor(i18n) {
    this.i18n = i18n;
  }

  getRoutes() {
    return [{
      route: '',
      redirect: 'home'
    }, {
      route: 'login',
      moduleId: './login/login',
      nav: false
    }, {
      route: 'home',
      name: 'home',
      moduleId: './home/home',
      nav: true,
      title: this.i18n.tr('common.students')
    }];
  }
}
