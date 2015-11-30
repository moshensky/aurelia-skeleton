import {bindable} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {Session} from 'service';
import {Router} from 'aurelia-router';
import {I18N} from 'aurelia-i18n';
import {Http} from 'service/http';

@inject(Session, Router, I18N, Http)
export class NavBar {
  @bindable router = null;

  constructor(session, router, i18n, http) {
    this.session = session;
    this.router = router;
    this.http = http;

    this.hasFocus = true;
    this.barcode = undefined;

    this.label = {
      logout: i18n.tr('navBar.logout')
    };
  }

  get isUserLoggedIn() {
    return this.session.isLoggedIn === true;
  }

  get userName() {
    return this.session.getUserName();
  }

  search() {
    throw new Error('not implemented: ' + this.barcode);
  }

  get userSettingsUrl() {
    let userId = Number(this.session.getUserClaim('userId'));
    return `#/administration/employee/${userId}/info`;
  }

  hoverSettings(isHovered) {
    this.hovered = isHovered;
  }

  checkAccess(navModel) {
    if (navModel.config.accessRight) {
      return this.session.userHasAccessRight(navModel.config.accessRight);
    }

    return true;
  }

  logout() {
    this.session.clearUser();
    this.router.navigate('login');
  }
}

