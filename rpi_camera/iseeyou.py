
import picamera
import logging
import os
import sys
import time

cwd = "/usr/local/src/iseeyou"

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

def sendMessage(msg):
    sys.stdout.write(msg)
    sys.stdout.flush()

def captureImage(camera,imageName):
    camera.capture(imageName)

with picamera.PiCamera() as camera:
    try:
        capturing = False
        os.chdir(cwd)
        initCamera(camera)

        while True:
            cmd = sys.stdin.readline()
            #captureImage(camera,"1.png")
            sendMessage(cmd);#echo back

    except BaseException:
        sendMessage("ERROR: unhandled exception")
    finally:
        sendMessage("QUITTING")
        camera.close()
