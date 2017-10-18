/* 
 * GulpJS config file. Helps us automate tasks that usually require a lot of work.
 * Tasks we're going to automate include: SCSS compilation, css prefixing, css compression, JS concatenation, JS compression, file cleaning and so on.
 */

/* Setup some variables for use here */
var scss_paths = {
  input: "./source/scss/styles.scss",
  maps: "./source/scss/maps",
  output: "./build/css",
  watch: "source/scss/**/*.scss"
};

var js_paths = {
  input: "./source/js/**/*.js",
  main: "./source/js/main.js",
  output: "./build/js"
};

var scss_options = {
  errLogToConsole: true,
  outputStyle: 'compressed'
};

// Auto prefixer options are based on bootstrap standards. Until we drop it, lets stay inline with 3.3.7 support.
var autoprefixer_options = {
  browsers: [
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 20",
    "Firefox >= 24",
    "Explorer >= 8",
    "iOS >= 6",
    "Opera >= 12",
    "Safari >= 6"
  ]
};

/* Load GulpJS plugins */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    plumber = require('gulp-plumber');

/* Helpers */
function watch_error(error) {
  console.log("Error: " + error.toString());
  this.emit('end');
}

/* Piping - lets us funnel plugin functionality into a certain order contained within a task */
// CSS Task
gulp.task('css', function(){
  return gulp.src(scss_paths.input)
    .pipe(plumber())
    .pipe(sass(scss_options).on('error', watch_error))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixer_options))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(scss_paths.output))
    .pipe(notify({ message: 'CSS task complete!' }));
});

// JSHint task
gulp.task('jshint', function(){
  return gulp.src(js_paths.main)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
});

// JS Task
gulp.task('js', ['jshint'], function () {
  var b = browserify({
    entries: js_paths.main,
    debug: true,
    transform: [babelify.configure({
      presets: ['es2015']
    })]
  });

  return b.bundle()
    .pipe(source(js_paths.main))
    .pipe(buffer())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js'))
    .pipe(notify({ message: 'JS task complete!' }));
});

// Clean Task
gulp.task('clean', function(){
  return gulp.src(['build/css', 'build/js'], {read: false})
  .pipe(clean())
  .pipe(notify({ message: 'Clean up complete!' }));
});

// Build Task - cleans directories, then runs all independant tasks in order.
gulp.task('build', ['css', 'js']);

// Watch Task - execute during development to update changes on the fly.
gulp.task('watch', function(){
  
  gulp.watch('source/scss/**/*.scss', ['css']); // Watch SCSS files
  
  gulp.watch('source/js/**/*.js', ['js']); // Watch JS files

});