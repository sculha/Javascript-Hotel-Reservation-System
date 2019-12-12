var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');
var del = require('del');
var rename = require('gulp-rename');
var sequence = require('run-sequence');
var fileinclude = require('gulp-file-include');

var config = {
    dist: 'dist/',
    src: 'src/',
    jsin: 'src/js/**/*.js',
    html: 'src/html/**/*.html',
    scssin: 'src/scss/**/*.scss',
    cssout: 'dist/assets/css/',
    jsout: 'dist/assets/js/',
    scssout: 'dist/assets/css/',

    jsName: 'app.js',
    jsPath: 'src/js/**/*.js',
    jsLibName: 'lib.js',
    jsLibPath: 'src/lib/**/*.js',
};

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('serve', ['sass', 'html', 'js', 'jsLib', 'fileinclude'], function () {
    browserSync({
        server: config.dist,
        port: 8080
    });

    gulp.watch([config.html, config.jsin], ['reload']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch(config.jsin, ['js']);
    gulp.watch([html], ['fileinclude']);
});

gulp.task('fileinclude', function() {
    gulp.src(["./src/include/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('jsLib', function () {
    return gulp.src([
        './src/lib/jquery.min.js',
        './src/lib/bootstrap-4-4-1/bootstrap.min.js',
        './src/lib/air-datepicker/datepicker.min.js',
        './src/lib/air-datepicker/datepicker-tr.js',
        './src/lib/jquery.easing.min.js',
        './src/lib/jquery.validate.js',
        './src/lib/jquery.steps.js',
        './src/lib/jquery.maskedinput.js',
        './src/lib/sweetalert2/sweetalert2.js'
    ])
    .pipe(concat(config.jsLibName))
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
    }))
    .pipe(gulp.dest(config.jsout));
});

gulp.task('js', function () {
    return gulp.src(config.jsPath)
        .pipe(concat(config.jsName))
        // .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(config.jsout));
});

gulp.task('html', function () {
    return gulp.src(config.html)
        .pipe(gulp.dest(config.dist));
});

gulp.task('clean', function () {
    return del([config.dist]);
});

gulp.task('build', function () {
    sequence('clean', ['html', 'jsLib', 'js']);
});

gulp.task('default', ['serve']);
