
var pathUtil = require('path'),
    _        = require('underscore'),
    nodatron = require('nodatron'),
    camera   = require(pathUtil.join(__dirname,'./rpi_camera/cameraConnection.js')),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    cp       = require('child_process');

var arduino = new nodatron({"devPath" : "/dev/ttyACM0",
                            "baud"    : 9600});

/*
if center triggered then left stopped but center still active, then
go back to center.

set flags to detect all motion stopped so you can sleep.

*/

arduino.enableConsole();

arduino.on("connected", function(){

  var motionSensorFront = arduino.createPir(5);
  var motionSensorLeft  = arduino.createPir(7);
  var motionSensorRight = arduino.createPir(12);
  var baseServo         = arduino.createServo(9);
  var camServo          = arduino.createServo(10);

  //var cam               = new camera();
  var front             = false;
  var left              = false;
  var right             = false;

  motionSensorFront.on('start',function(){
    log.info("Front sensor motion detected.");
    front = true;
    panCenter();
    run();
  });

  motionSensorFront.on('stop',function(){
    log.info("Front sensor motion stopped.");
    front = false;
    run();
  });

  motionSensorLeft.on('start',function(){
    log.info("Left sensor motion detected.");
    left = true;
    panLeft();
    run();
  });

  motionSensorLeft.on('stop',function(){
    left = false;
    log.info("Left sensor motion stopped.");
    run();
  });

  motionSensorRight.on('start',function(){
    log.info("Right sensor motion detected.");
    right = true;
    panRight();
    run();
  });

  motionSensorRight.on('stop',function(){
    right = false;
    log.info("Right sensor motion stopped.");
    run();
  });

  function panLeft(){
    baseServo.move(180);
    camServo.move(90);
  }

  function panRight(){
    baseServo.move(0);
    camServo.move(90);
  }

  function panCenter(){
    baseServo.move(90);
    camServo.move(90);
  }

  //move camera to a rest position.
  function sleepCam(){
    baseServo.move(0);
    camServo.move(0);
  }

  function run(){
    if(!front && !left && !right){
      sleepCam();
    }
  }

  //define handlers for this main process.
  process.on('SIGTERM', function() {//called from /etc/init.d/nodatron.sh from kill pid
    log.info("Got kill signal. Exiting.");
    shutdown();
  });

  process.on('SIGINT', function() {
    log.warn("Caught interrupt signal(Ctrl-C)");
    shutdown();
  });

  process.on('exit', function(){
    log.info("iseeyou exiting...");
  });

  process.on('uncaughtException', function (err) {
    var msg="Uncaught Exception ";
    if( err.name === 'AssertionError' ) {
      msg += err.message;
    } else {
      msg += err;
    }
    log.error(msg);
    shutdown();
  });

  function shutdown(){
    arduino.shutdown();
    log.info("Arduino serial connection shut down.");
    process.exit();
  }

});

arduino.on("serialLostConnection", function(msg){
  log.error(msg);
});

process.on('uncaughtException', function (err) {
  var msg="Uncaught Exception ";
  if( err.name === 'AssertionError' ) {
    msg += err.message;
  } else {
    msg += err;
  }
  console.error(msg);
  process.exit(1);
});
