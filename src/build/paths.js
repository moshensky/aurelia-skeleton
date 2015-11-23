var appRoot = 'src/';
var outputRoot = 'dist/';
var exporSrvtRoot = 'export/'

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  jade: appRoot + '**/*.jade',
  css: appRoot + '**/*.css',
  style: 'styles/**/*.css',
  less: 'less/**/*.less',
  output: outputRoot,
  exportSrv: exporSrvtRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
};
