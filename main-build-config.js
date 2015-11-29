var gulp = require('gulp');
var replace = require('gulp-replace');

module.exports = {
  transform: function (filePath, conf) {
    var securityUrl, serviceApitUrl, eStudentApiUrl;

    if (conf === 'muvarna-release-preparation') {
      securityUrl = 'https://172.30.1.77:56324';
      serviceApitUrl = 'xxx';
      eStudentApiUrl = 'https://172.30.1.77:56481/api';
    } else if (conf === 'muvarna-release-test') {
      securityUrl = 'https://172.30.1.249:56324';
      serviceApitUrl = 'https://172.30.1.249:49594';
      eStudentApiUrl = 'https://172.30.1.249:56481/api';
    } else if (conf === 'release') {
      securityUrl = 'https://tokenendpoint-service.mu-varna.bg';
      serviceApitUrl = 'https://stipendiq-service.mu-varna.bg';
      eStudentApiUrl = 'https://estudent-service.mu-varna.bg/api';
    } else if (conf === 'debug') {
      securityUrl = 'http://10.10.10.20:56324';
      serviceApitUrl = 'xxx';
      eStudentApiUrl = 'http://10.10.10.20:56481/api';
    } else if (conf === 'debug-qa') {
      securityUrl = 'http://muvarna-qa-dev-tokenendpoint-httpservice.amvr-ci.int';
    }

    var serviceHostUrlToReplace = 'serviceHost: \'' + serviceApitUrl + '\',';
    var authHostUrlToReplace = 'authHost: \'' + securityUrl + '\',';
    var eStudentHostUrlToReplace = 'hosts[HostConsts.cssSystem] = \'' + eStudentApiUrl + '\';';

    return gulp.src(filePath + '/main.js')
      .pipe(replace(/serviceHost:.*/, serviceHostUrlToReplace))
      .pipe(replace(/authHost:.*/, authHostUrlToReplace))
      .pipe(replace(/hosts\[HostConsts.cssSystem\].*/, eStudentHostUrlToReplace))
      .pipe(replace(/\.developmentLogging\(\)/, ' '))
      .pipe(gulp.dest(filePath));
  }
};
