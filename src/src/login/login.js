import {inject} from 'aurelia-framework';
import {Http} from 'service';
import {Logger} from 'service';
import {Session} from 'service';
import {Router} from 'aurelia-router';
import {Validation, ensure} from 'aurelia-validation';
import {I18N} from 'aurelia-i18n';

@inject(Validation, Logger, Session, Router, Http, I18N)
export class Login {
  @ensure((it) => {
    it.isNotEmpty().hasLengthBetween(3, 20);
  })
  email = '';
  @ensure((it) => {
    it.isNotEmpty().hasLengthBetween(3, 20);
  })
  password = '';

  constructor(validation, logger, session, router, http, i18n) {
    this.validation = validation.on(this);
    this.logger = logger;
    this.session = session;
    this.router = router;
    this.http = http;
    this.i18n = i18n;
  }

  login() {
    this.validation.validate().then(() => {
      this.http.loginResourceOwner(this.email, this.password, 'planner')
        .then(_ => {
          this.logger.success({
            message: this.i18n.tr('app:login.loggedInSuccessful')
          });
          this.router.navigateToRoute('home');
        })
        .catch(_ => {
          this.logger.error({
            message: this.i18n.tr('app:login.loggedInUnsuccessful')
          });
        });
    });
  }

  canActivate(params, routeConfig, navigationInstruction) {
    const isLoggedIn = this.session.isLoggedIn;
    const hasPrevInstruction = navigationInstruction.previousInstruction !== undefined;

    if (isLoggedIn) {
      if (hasPrevInstruction) {
        // todo: i18n
        this.logger.error('Already logged in!');
        this.router.navigate(navigationInstruction.previousInstruction.fragment);
      } else {
        // todo: read some def route constant
        this.router.navigateToRoute('');
      }
    }

    return !isLoggedIn;
  }
}
