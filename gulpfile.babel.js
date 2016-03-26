import browsersync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import changed from 'gulp-changed';
var spawn = require('child_process').spawn;


var SRC = '_site';
var DEST = '_site-dev';

var task = {};


var log = (color) => {
  return (data) => {
    process.stdout.write("\x1B[" + color + "m" + data + "\x1B[0m");
  }
}

gulp.task('clean', function(callback) {
  return del([SRC, DEST], callback);
});


gulp.task('compile', task.compile = function(callback) {
  var process = spawn('jekyll', ['build', '--unpublished', '--config', '_config.yml,_config.local.yml']);
  process.stdout.on('data', log(33));
  process.stderr.on('data', log(31));
  process.on('close', (code) => {
    log(31)(`Jekyll process exited with code ${code}\n`);
    callback();
  });
});
gulp.task('compile-clean', ['clean'], task.compile);


gulp.task('copy', ['compile'], task.copy = function() {
  return gulp.src(`${SRC}/**/*`)
    .pipe(changed(DEST, {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest(DEST));
});
gulp.task('copy-clean', ['compile-clean'], task.copy);


gulp.task('browser-sync', ['build-clean'], function() {
  return browsersync(null, {
    ghostMode: false,
    ui: false,
    // files: `${DEST}/**/*`,
    server: {
      baseDir: DEST
    },
    port: 4001,
    open: false,
    reloadOnRestart: true,
    // reloadDelay: 200,
    // reloadDebounce: 500,
    notify: false,
    // injectChanges: false,
  });
});


gulp.task('build-clean', [
    'compile-clean',
    'copy-clean',
]);

gulp.task('build', [
    'compile',
    'copy',
]);


gulp.task('watch', ['build-clean', 'browser-sync'], function(callback) {

  gulp.watch([
    '*.{yml,ico,xml,rss}',
    `_{feeds,includes,layouts,pages,people,plugins,posts,sass,shows}/**/*`,
    `assets/**/*`,
  ], ['copy']);

  var reloadTimeout = null;
  gulp.watch([`${DEST}/**/*`])
    .on('change', function(file) {
      var filename = file.path.split(DEST + '/')[1];
      console.log("\x1B[0m[\x1B[34mBS\x1B[0m] \x1B[36mFile changed: \x1B[35m" + filename + "\x1B[0m");
      if (reloadTimeout) {
        clearTimeout(reloadTimeout);
      }
      reloadTimeout = setTimeout(function() {
        reloadTimeout = null;
        browsersync.reload();
      }, 250);
    });

  return callback();
});

gulp.task('default', ['watch']);
