
var pathUtil = require('path'),
    _        = require('underscore'),
    nodatron = require(pathUtil.join(__dirname,'./nodatron/nodatron.js')),
    log      = require(pathUtil.join(__dirname,'./logger.js')),
    cp       = require('child_process');

var arduino = new nodatron({"device"  : "arduino",
                            "devPath" : "/dev/ttyACM0",
                            "baud"    : 9600});

arduino.enableConsole();

arduino.on("connected", function(){

  var motionSensorFront = arduino.createPir(5);
  var motionSensorLeft  = arduino.createPir(12);
  var motionSensorRight = arduino.createPir(7);
  var baseServo         = arduino.createServo(9);
  var camServo          = arduino.createServo(10);

  motionSensorFront.on('start',function(){
    panCenter();
  });

  motionSensorFront.on('stop',function(){

  });

  motionSensorLeft.on('start',function(){
    panLeft();
  });

  motionSensorLeft.on('stop',function(){

  });

  motionSensorRight.on('start',function(){
      panRight();
  });

  motionSensorRight.on('stop',function(){
    motionLed.stopBlink();
  });

  function panLeft(){
    baseServo.move(180);
    camServo.move(85);
  }

  function panRight(){
    baseServo.move(33);
    camServo.move(85);
  }

  function panCenter(){
    baseServo.move(110);
    camServo.move(85);
  }

  //move camera to a rest position.
  function sleepCam(){
    baseServo.move(110);
    camServo.move(0);
  }

  function executeCommand(cmd,cb){
    var child = cp.exec(cmd ,function(error,stdout,stderr){
      if (stderr){
        cb(false,"Error executing command "+cmd+" with stderr:"+stderr);
      }
      if (error) {
        cb(false,"Error executing command "+cmd+" with error:"+error);
      }
      if(stdout){
        cb(true,cmd+" successfully executed with no errors.",stdout);
      }
    });
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
    log.info("raspatron exiting...");
  })

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
