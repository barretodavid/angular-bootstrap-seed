'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function(options) {
  gulp.task('styles', function () {
    var sassOptions = {
      style: 'expanded'
    };

    function transformFn(filePath) {
      filePath = filePath.replace(options.src + '/app/', '');
      return '@import \'' + filePath + '\';';
    }

    var injectFiles = gulp.src([
      options.src + '/app/**/*.scss',
      '!' + options.src + '/app/global/**/*.scss',
      '!' + options.src + '/app/index.scss',
    ], { read: false });

    var injectOptions = {
      transform: transformFn,
      starttag: '// injector:app',
      endtag: '// endinjector',
      addRootSlash: false
    };

    var injectFilesGlobal = gulp.src([
      options.src + '/app/global/**/*.scss',
    ], { read: false });

    var injectOptionsGlobal = {
      transform: transformFn,
      starttag: '// injector:global',
      endtag: '// endinjector',
      addRootSlash: false
    };

    return gulp.src(options.src + '/app/index.scss')
      .pipe($.inject(injectFilesGlobal, injectOptionsGlobal))
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(wiredep(options.wiredep))
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
  });
};
