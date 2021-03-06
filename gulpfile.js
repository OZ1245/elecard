const gulp           = require('gulp'),
      less           = require('gulp-less'),
      path           = require('path'),
      rename         = require('gulp-rename'),
      jsValidate     = require('gulp-jsvalidate'),
      minify         = require('gulp-minify'),
      cleanCSS       = require('gulp-clean-css'),
      lessAutoprefix = require('less-plugin-autoprefix'),
      concat         = require('gulp-concat'),
      connect        = require('gulp-connect'),
      clean          = require('gulp-clean');

const paths = {
  src: './src/',
  build: 'build/',
  concatJS: [
    './src/assets/js/plugins/*.js',
    './src/assets/js/script.js',
  ]
};

var autoprefix = new lessAutoprefix({browsers: ['last 2 versions']});

function cleanBuild () {
  return gulp.src(paths.build, {read: false})
      .pipe(clean({force: true}))
      .pipe(gulp.dest(paths.build));
}

function server () {
  return connect.server({
    root: './build',
    livereload: true,
    debug: false,
  });
}

function html () {
  return gulp.src(paths.src + '**/*.html')
        .pipe(gulp.dest(paths.build))
        .pipe(connect.reload());
}

function styles () {
    return gulp.src(paths.src + 'assets/style/less/style.less')
        .pipe(less({
          plugins: [autoprefix],
        }))
        .pipe(gulp.dest(paths.src + 'assets/style/'));
}

function minCSS () {
  return gulp.src(paths.src + 'assets/style/style.css')
    .pipe(cleanCSS({level: 0}))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(paths.build + 'assets/style/'))
    .pipe(connect.reload());
}

function concatJS () {
  return gulp.src(paths.concatJS)
    .pipe(concat({path: 'common.js'}))
    .pipe(gulp.dest(paths.src + 'assets/js/'));
}

function minJS () {
  return gulp.src(paths.src + 'assets/js/common.js')
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest(paths.build + 'assets/js/'))
    .pipe(connect.reload());
}

function validJS () {
  return gulp.src(paths.src + 'assets/js/common.js')
    .pipe(jsValidate());
}

function watch() {
    gulp.watch('src/assets/style/less/**/*.less', styles);
    gulp.watch('src/assets/style/style.css', minCSS);
    gulp.watch(paths.concatJS, concatJS);
    gulp.watch('src/assets/js/common.js', validJS);
    gulp.watch('src/assets/js/common.js', minJS);
    gulp.watch('src/**/*.html', html);
}

var build = gulp.series(cleanBuild, html, styles, minCSS, concatJS, validJS, minJS, watch);

gulp.task('default', gulp.parallel(server, build));
