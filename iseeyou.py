
import picamera
import logging
import os
import sys
import time

FRONT_PIR       = 25
RIGHT_PIR       = 23
LEFT_PIR        = 21
PAN_SERVO       = 9
TILT_SERVO      = 10

logDir           = "logs"
videoMode        = True #set to true if you want video
destPath         = "/usr/local/src/nosey/"
cwd              = "/usr/local/src/nosey"

def initCamera(camera):
    logging.info("Initializing camera.")
    #camera settings
    #camera.resolution            = (SCREEN_WIDTH, SCREEN_HEIGHT)
    camera.framerate             = 24
    camera.sharpness             = 0
    camera.contrast              = 0
    camera.brightness            = 50
    camera.saturation            = 0
    camera.ISO                   = 0
    camera.video_stabilization   = False
    camera.exposure_compensation = 0
    camera.exposure_mode         = 'auto'
    camera.meter_mode            = 'average'
    camera.awb_mode              = 'auto'
    camera.image_effect          = 'none'
    camera.color_effects         = None
    camera.rotation              = 270
    camera.hflip                 = False
    camera.vflip                 = True
    camera.crop                  = (0.0, 0.0, 1.0, 1.0)

def initLogger(output_dir):
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    # create console handler and set level to info
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    # create error file handler and set level to error
    handler = logging.FileHandler(output_dir+"/"+time.strftime("%Y%m%d")+"_error.log","w", encoding=None, delay="true")
    handler.setLevel(logging.ERROR)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    # create debug file handler and set level to debug
    handler = logging.FileHandler(output_dir+"/"+time.strftime("%Y%m%d")+"_debug.log","w", encoding=None, delay="true")
    handler.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

with picamera.PiCamera() as camera:
    try:
        capturing = False
        os.chdir(cwd)
        initLogger(logDir)
        initCamera(camera)

        while True:

    except BaseException:
        logging.error("Unhandled exception : " , exc_info=True)
    finally:
        logging.info("quitting...")
        camera.close()
