var path  = require('path');
var fs    = require('fs');
var gulp  = require('gulp');
var merge = require('event-stream').merge;
var $     = require('gulp-load-plugins')();
var crx   = new require('crx')({
  privateKey: fs.readFileSync(path.join(process.env.HOME, '.ssh/chrome.pem'))
});

gulp.task('clean', function() {
  return gulp.src(['./build', './dist/*'])
    .pipe($.clean());
});

gulp.task('build', function(cb) {
  $.runSequence('clean', 'build:chrome', 'build:opera', cb);
});

gulp.task('dist', function(cb) {
  $.runSequence('build', 'chrome:zip', 'chrome:crx', 'opera:nex', cb);
});

// Chrome
// 

gulp.task('build:chrome', ['chrome:core'], function() {
  var icons  = gulp.src('./icons/**/*').pipe(gulp.dest('./build/chrome/icons'));
  var others = gulp.src([
    './src/*', 
    '!./src/core.js',
    '!./src/storage.js',
    './src/chrome/*',
    '!./src/chrome',
    '!./src/chrome/inject.js'
  ]).pipe(gulp.dest('./build/chrome'));
  
  return merge(icons, others);
});

gulp.task('chrome:core', function() {
  var sources = ['./src/storage.js', './src/core.js', './src/chrome/inject.js'];
  
  return gulp.src(sources)
    .pipe($.concat('content-script.js'))
    .pipe(gulp.dest('./build/chrome'));
});

gulp.task('chrome:zip', function() {
  return gulp.src('./build/chrome/**/*')
    .pipe($.zip('chrome.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('chrome:crx', function() {
  return crx.load(path.join(__dirname, './build/chrome'))
    .then(function() {
      return crx.pack().then(function(crxBuffer){
        fs.writeFile(path.join(__dirname, "./dist/chrome.crx"), crxBuffer);
      });
    });
});

// Opera
// 

gulp.task('build:opera', ['build:chrome'], function() {
  return gulp.src('./build/chrome/**/*')
    .pipe(gulp.dest('./build/opera'));
});

gulp.task('opera:nex', function() {
  return gulp.src('./dist/chrome.crx')
    .pipe($.rename('opera.nex'))
    .pipe(gulp.dest('./dist'));
});
