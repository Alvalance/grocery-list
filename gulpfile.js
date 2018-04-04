var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename');

// paths
var SRC = 'app/src',
    PROD = 'app/prod';

// process js
gulp.task('js', function() {
    return gulp.src(SRC + '/js/global.js')
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
        .pipe(uglify())
        .pipe(rename('main.js'))
        .pipe(gulp.dest(PROD + '/js'))
        .pipe(connect.reload());
});

// process css
gulp.task('css', function() {
    gulp.src(SRC + '/css/*.css')
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
        .pipe(fileinclude({
          prefix: '@@'
        }))
        .pipe(cleanCSS({
            format: 'keep-breaks'
        }))
        .pipe(rename('main.css'))
        .pipe(gulp.dest(PROD + '/css'))
        .pipe(connect.reload());
});

// process html
gulp.task('html', function() {
    gulp.src(SRC + '/*.html')
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(PROD))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        root: PROD,
        livereload: true,
        port: 8000
    });
});

// watch for changes
gulp.task('watch', function() {
    gulp.watch(SRC + '/js/**/*', ['js']);
    gulp.watch(SRC + '/css/**/*.css', ['css']);
    gulp.watch(SRC + '/*.html', ['html']);
});

gulp.task('default', ['js', 'html', 'css', 'connect', 'watch']);
