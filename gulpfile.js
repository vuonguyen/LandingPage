var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var pkg = require('./package.json');


var autoprefixerOptions = {
    overrideBrowserslist: [
      "last 2 version",
      "> 1%",
      "maintained node versions",
      "not dead"
    ],
    cascade: false
};

var path = {
    css_dir : 'assets/css',
    sass_files : 'assets/sass/**/*.scss',
    js_dir: 'assets/js'
}

gulp.task('build-sass', function () {
    return gulp.src(path.sass_files)
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.css_dir));
});

// gulp.task('deploy-sass', function () {
//     return gulp.src(path.sass_files)
//       .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//       .pipe(autoprefixer(autoprefixerOptions))
//       .pipe(gulp.dest(path.css_dir));
// });

// Minify JS
gulp.task('minify-js', function (cb) {
    pump([
        gulp.src(path.js_dir),
        concat(path.js_dir + '/main.js'),
        rename('main.min.js'),
        uglify(),
        gulp.dest(path.js_dir)
    ],
    cb
    );
});

gulp.task('build', gulp.series('build-sass', 'minify-js'));

gulp.task('watch', gulp.parallel(function() {
    gulp.watch(path.js_dir, gulp.series(['minify-js']));
    gulp.watch(path.sass_files, gulp.series(['build-sass']));
}));

gulp.task('dev', gulp.series('build', 'watch'));
