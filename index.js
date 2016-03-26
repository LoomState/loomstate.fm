/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |   http://www.browsersync.io/docs/options/
 */

var browserSyncConfig = {
  ghostMode: false,
  ui: false,
  files: "_site/**/*.css",
  server: {
    baseDir: "_site"
  },
  port: 4001,
  open: false,
  reloadOnRestart: true,
  reloadDelay: 200,
  reloadDebounce: 500,
  notify: false,
  // injectChanges: false,
};


var spawn = require('child_process').spawn;
var bs = require("browser-sync").create();


var log = (color) => {
  return (data) => {
    process.stdout.write("\033[" + color + "m" + data + "\033[0m");
  }
}

function spawnJekyll() {
  var process = spawn('jekyll', ['serve']);
  process.stdout.on('data', log(33));
  process.stderr.on('data', log(31));
  process.on('close', (code) => {
    log(31)(`Jekyll process exited with code ${code}\n`);
    bs.exit();
  });
}

spawnJekyll();
bs.init(browserSyncConfig);
