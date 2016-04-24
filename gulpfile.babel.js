import del from 'del';
import gulp from 'gulp';
import sass from 'gulp-sass';

const SRC = 'assets/styles/**/*.scss';
const DEST = 'static/styles';


gulp.task('clean', function clean(callback) {
  return del([DEST], callback);
});


gulp.task('styles', styles);
gulp.task('styles-clean', ['clean'], styles);

function styles() {
  return gulp.src(SRC)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DEST));
}


gulp.task('watch', ['styles-clean'], function watch() {
  gulp.watch(SRC, ['styles']);
});


gulp.task('build', function() {
  return gulp.src(SRC)
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: true,
    }).on('error', sass.logError))
    .pipe(gulp.dest(DEST));
});


gulp.task('default', ['watch']);
