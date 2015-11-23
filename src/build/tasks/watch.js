var gulp = require('gulp');
var paths = require('../paths');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var less = require('gulp-less');
var path = require('path');
var moment = require('moment');
var colors = require('colors');
var del = require('del');
var runSequence = require('run-sequence');

// outputs changes to files to the console
function reportChange(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

var logWatchEventInfo = function (title, event) {
  var currentTime = moment(Date.now()).format('DD.MM.YY �. HH:mm');
  console.log('===============================================');
  console.log(currentTime.toString().bold.green + ' ' + title.bold + ': ');
  console.log('    type: '.bold + event.type);
  console.log('    path: '.bold + event.path);
};


function compileJade(event) {
  logWatchEventInfo('Jade compile', event);
  var destPath = path.relative(paths.root, event.path);
  console.log(destPath)
  destPath = path.dirname(destPath);
  console.log(event.path)
  console.log(destPath)
  gulp.src(event.path)
    .pipe(jade({
      pretty: true
    }))
    //.pipe(gulp.dest(destPath));
    .pipe(gulp.dest('./src/' + destPath));
}


function compileLess(event) {
  logWatchEventInfo('Less compile', event);
  return gulp.src('less/styles.less')
    .pipe(less())
    .pipe(gulp.dest('styles'));
}
// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', ['prep'], function () {
  gulp.watch(paths.source, ['build-system', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.html, ['build-html', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.css, ['build-css', browserSync.reload]).on('change', reportChange);
  gulp.watch(paths.style, browserSync.reload).on('change', reportChange);
  gulp.watch([paths.jade, 'index.jade'], compileJade);
  gulp.watch(paths.less, compileLess);
});

gulp.task('prep', function (callback) {
  return runSequence(
    'compile-jade-index',
    'compile-less',
    'compile-jade',
    'serve',
    callback
  );
});

gulp.task('compile-jade-index', function () {
  return gulp.src('index.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('compile-less', function () {
  return gulp.src('less/styles.less')
    .pipe(less())
    .pipe(gulp.dest('styles'));
});

gulp.task('compile-jade', function () {
  return gulp.src(paths.jade)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('src/.'));
});

gulp.task('clean-custom', function (cb) {
  del([paths.html, 'index.html', 'styles/styles.css'], cb);
});

