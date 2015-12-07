var Promise = require('bluebird');
var colors = require('colors');
var del = require('del');
var gulp = require('gulp');
var replace = require('gulp-replace');
require('shelljs/global');
var mainConfig = require('./main-build-config');

var args = require('yargs').argv;
var conf = args.configuration;
var isWin = /^win/.test(process.platform);

var frontendPath = 'src';

gulp.task('build:frontend', function () {
  buildAurelia(frontendPath);
});

function buildAurelia(appPath) {
  var output = args['destination-folder'];
  del([output], {
    force: true
  }, function (err, deletedFiles) {
    output = '../' + output;
    console.log('Files deleted!');
    process.chdir(appPath);
    var spawn = require('child_process').spawn;
    var sp = new SpawnProc(spawn);
    //sp.npm('-v')
    sp.npm('install')
      .then(function () {
        return gulp.src('src/main.js')
          .pipe(gulp.dest('./backup'));
      })
      .then(function () {
        return mainConfig.transform('src', conf);
      })
      .then(function () {
        return sp.jspm('install');
      })
      .then(function () {
        return sp.gulp('compile-jade-index');
      })
      .then(function () {
        return sp.gulp('compile-less');
      })
      .then(function () {
        return sp.gulp('compile-jade');
      })
      .then(function () {
        return sp.gulp('build', '--configuration', conf);
      })
      .then(function () {
        return sp.gulp('bundle');
      })
      .then(function () {
        return gulp.src('assets/**/*').pipe(gulp.dest(output + '/assets'));
      })
      .then(function () {
        return gulp.src(['dist/aurelia.js', 'dist/app-build.js']).pipe(gulp.dest(output + '/dist'));
      })
      .then(function () {
        return gulp.src('jspm_packages/system.js').pipe(gulp.dest(output + '/jspm_packages'));
      })
      .then(function () {
        var pathToFonts = 'jspm_packages/npm/font-awesome@4.4.0/fonts';
        return gulp.src(pathToFonts + '/*').pipe(gulp.dest(output + '/' + pathToFonts));
      })
      .then(function () {
        var pathToFonts = 'jspm_packages/github/twbs/bootstrap@3.3.5/fonts';
        return gulp.src(pathToFonts + '/*').pipe(gulp.dest(output + '/' + pathToFonts));
      })
      .then(function () {
        return gulp.src('styles/**/*').pipe(gulp.dest(output + '/styles'));
      })
      .then(function () {
        return gulp.src('index.html').pipe(gulp.dest(output));
      })
      .then(function () {
        return gulp.src('config.js').pipe(gulp.dest(output));
      })
      .then(function () {
        return sp.gulp('unbundle');
      })
      .then(function () {
        return gulp.src('./backup/main.js')
          .pipe(gulp.dest('src'))
      })
      .then(function () {
        return del(['backup']);
      })
      .catch(function (error) {
        console.log('############ ERROR ##########');
        console.log(error);
        console.log('############ END ERROR ##########');
      });
  });
}

function SpawnProc(spawn) {
  this.spawn = spawn;
}

SpawnProc.prototype.gulp = function () {
  return this.exec('gulp', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.aurelia = function () {
  return this.exec('aurelia', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.bower = function () {
  return this.exec('bower', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.npm = function () {
  return this.exec('npm', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.jspm = function () {
  return this.exec('jspm', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.git = function () {
  return this.exec('git', Array.prototype.slice.call(arguments));
};

SpawnProc.prototype.exec = function (command, args) {
  console.log('##################################');
  console.log(command, args.join(' '));

  var proc;
  if (isWin) {
    var cmd = ['/c', command];
    var params = cmd.concat(args);
    proc = this.spawn('cmd', params);
  } else {
    proc = this.spawn(command, args);
  }

  return new Promise(function (resolve, reject) {
    proc.stdout.on('data', function (data) {
      if (data) {
        console.log(data.toString());
      }
    });

    proc.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    proc.on('close', function (code) {
      if (code !== 0) {
        console.log('grep process exited with code ' + code);
        reject();
      } else {
        resolve();
      }
    });
  });
};
