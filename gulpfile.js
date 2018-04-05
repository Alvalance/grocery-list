var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    path = require('path'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    handlebars = require('gulp-handlebars');

// paths
var SRC = 'app/src',
    PROD = 'app/prod';

// process js
gulp.task('js', function() {
    // process handlebars template partials (assume all partials start with an underscore)
    gulp.src([SRC + '/js/templates/_*.hbs'])
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
        .pipe(handlebars())
        .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
            imports: {
                processPartialName: function(fileName) {
                    // Strip the extension and the underscore
                    // Escape the output with JSON.stringify
                    return JSON.stringify(path.basename(fileName, '.js').substr(1));
                }
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest(SRC + '/js'));

    // process main js file
    return gulp.src(['node_modules/handlebars/dist/handlebars.runtime.min.js', SRC + '/js/templates.js', SRC + '/js/global.js'])
        .pipe(plumber({
            handleError: function(e) {
                console.log(e);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
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
    gulp.watch(SRC + '/js/**/*', ['js', 'css', 'html']);
    gulp.watch(SRC + '/css/**/*.css', ['js', 'css', 'html']);
    gulp.watch(SRC + '/*.html', ['js', 'css', 'html']);
    gulp.watch(PROD + '/data/**/*.json', ['js', 'css', 'html']);
});



gulp.task('default', ['js', 'html', 'css', 'connect', 'watch']);
