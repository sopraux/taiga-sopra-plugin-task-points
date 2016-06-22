var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge-stream'),
    path  = require('path');

var paths = {
    styles: 'styles/all.scss',
    jade: 'partials/*.jade',
    coffee: [
            '*.coffee',
            path.join('coffee', '**', '*.coffee')
        ],
    dist: 'dist/'
};

gulp.task('copy-config', function() {
    return gulp.src('taskpoints.json')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('compile', function() {
    var jade = gulp.src(paths.jade)
        .pipe($.plumber())
        .pipe($.cached('jade'))
        .pipe($.jade({pretty: true}))
        .pipe($.angularTemplatecache({
            transformUrl: function(url) {
                return '/plugins/taskpoints/' + url;
            }
        }))
        .pipe($.remember('jade'));

    var coffee = gulp.src(paths.coffee)
        .pipe($.plumber())
        .pipe($.cached('coffee'))
        .pipe($.coffee())
        .pipe($.remember('coffee'));

    return merge(jade, coffee)
        .pipe($.concat('taskpoints.js'))
        //.pipe($.uglify({mangle:false, preserveComments: false}))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('compile-styles', function() {
    return gulp.src(paths.styles)
        .pipe($.sass({outputStyle: 'compressed'}).on('error', $.sass.logError))
        .pipe($.concat('taskpoints.css'))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function() {
    gulp.watch([paths.jade, paths.coffee, paths.styles], ['compile', 'compile-styles']);
});

gulp.task('default', ['copy-config', 'compile', 'compile-styles', 'watch']);

gulp.task('build', ['copy-config', 'compile', 'compile-styles']);
