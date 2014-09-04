// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

// This is a demo of programtically checking multiple tessels hooked 
// up to the same computer.

// When we `require('tessel')` here, this is the library out of `node_modules`
// for USB communication. It's not the same as the `tessel` module built into
// the Tessel firmware that code on the Tessel uses for hardware access --
// that's only available to JS that executes on the Tessel itself.
var tessel = require('tessel');
var async = require('async');

var script =  require.resolve('./device/index.js');

// list all Tessels attached to this computer
tessel.listDevices(function(err, devices){
  if (err) throw new Error(err);

  // the devices object consists of the usb descriptor, 
  // the serial number, and the version info of the Tessel

  var funcQueue = [];
  var count = 0;
  devices.forEach(function(device){
    console.log("Found device", device.serialNumber);
    funcQueue.push(function(callback){
      loadCode(device.serialNumber, function(){
        callback(null);
      });
    })
  })

  async.waterfall(funcQueue, function(err, res){
    console.log('Done loading code');
  });
})


function loadCode(serialNumber, next){
  var opts = {
    // Stop existing script, if any
    stop: true,
    // Serial number
    serial: serialNumber,
  };

  var args = [];

  // `tessel.findTessel` finds a Tessel attached to this computer and connects.
  tessel.findTessel(opts, function(err, device) {
    if (err) throw err;

    // Once we've found a Tessel, we tell it to run our script. This works just
    // like `tessel run` and bundles the `device/` directory. It bundles only
    // `device/` and not the host code because `device/` has its own
    // `package.json`.
    device.run(script, args, {}, function () {
      // Connect the stdout and stderr of the process running on Tessel to
      // the console, so that our `console.log` messages show.
      device.stdout.resume();
      device.stdout.pipe(process.stdout);
      device.stderr.resume();
      device.stderr.pipe(process.stderr);

      var count = 0;
      console.log('device initial', device.serialNumber);
      // `device.send(msg)` sends an object to Tessel. It supports JSON
      // compatible objects as messages, with the addition that `Buffer`s,
      // `Date`s and cyclic data structures are also handled properly.
      setInterval(function(){
        console.log("device", device.serialNumber);
        device.send({count:count++, data: {obj: 'demo'}})
      }, 4000);

      // `device.on('message', function (msg) { ... })` receives an event
      // when an object is received from Tessel.
      device.on('message', function (m) {
        console.log('[PC] Message from Tessel:', m);
      });

      // Exit cleanly on Ctrl+C.
      process.on('SIGINT', function() {
        // Try to stop the process on the Tessel
        device.stop();

        setTimeout(function () {
          // But if that fails, just exit
          logs.info('Script aborted');
          process.exit(131);
        }, 200);
      });

      // When the script on Tessel exits, shut down
      // USB communications and exit
      device.once('script-stop', function (code) {
        device.close(function () {
          process.exit(code);
        });
      });

      next();

    });
  });
}
