import {Logger, Http} from 'service';
import {inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {I18N} from 'aurelia-i18n';
import {Router} from 'aurelia-router';
import moment from 'moment';

@inject(Http, Logger, Validation, I18N, Router)
export class CreateEditStudentVM {
  constructor(http, logger, validation, i18n, router) {
    this.http = http;
    this.logger = logger;
    this.validation = validation;
    this.i18n = i18n;
    this.router = router;
  }

  activate() {
  }
}

