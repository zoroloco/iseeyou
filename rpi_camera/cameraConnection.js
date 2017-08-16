var cp          = require('child_process'),
    pathUtil    = require('path'),
    _           = require('underscore'),
    events      = require('events'),
    util        = require('util'),
    log         = require(pathUtil.join(__dirname,'../logger.js'));

function Camera(){
	var self                 = this;
  this._iseeyou            = null;
  events.EventEmitter.call(this);

  this._iseeyou = cp.spawn('python',['iseeyou.py']);

  this._iseeyou.stdin.setEncoding('utf-8');

  //data came in from camera process
  this._iseeyou.stdout.on('data', (data) => {
    if(Buffer.isBuffer(data)){
      var dataStr    = data.toString('ascii');
      log.error("Received data from camera: "+data);
      //onReceiveData(dataStr);
      //self.emit("imageTaken")
    }
  });

  this._iseeyou.stderr.on('data', (data) => {
    log.error("Received error from camera: "+data);
    //onDisconnected("stderr on camera connection:"+data);
    self.emit("error");
  });

  this._iseeyou.on('error', (err) => {
    log.error(err);
    //onDisconnected("error on camera connection:"+err);
    self.emit("error");
  });

  this._iseeyou.on('close', (code) => {
    log.error("Received close event from camera: "+code);
    self.emit("close");
      //onDisconnected("Camera connection closed.");
  });

  this._iseeyou.on('exit', (code) => {
    log.error("Received exit event from camera: "+code);
    self.emit("exit");
    //onDisconnected("Camera connection exited.");
  });

	Camera.prototype.shutdown = function(){
		log.warn("Shutting down camera process.");
		if(!_.isEmpty(self._iseeyou)){
		    process.kill(self._iseeyou.pid);//clean-up python serial connection
		}
	}

  //send a command down to the camera.
	Camera.prototype.sendCommand = function(cmd){
    log.info("Camera client received message:"+cmd);
		if(!_.isEmpty(self._iseeyou)){
      log.info("Camera client now sending message:"+cmd);
			this._iseeyou.stdin.write(cmd);//just send down raw
		}
    else{
      log.error("Camera client cannot send message:"+cmd);
    }
	}

}//camera

module.exports = Camera;

util.inherits(Camera, events.EventEmitter);
