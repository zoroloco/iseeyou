//Kenneth Centurion
#include<SimpleServo.h>
#include<Servo.h>

//servos
SimpleServo panServo;
SimpleServo tiltServo;
//digital pins
const int pan       = 9;
const int tilt      = 10;
const int centerPir = 5;
const int leftPir   = 7;
const int rightPir  = 12;
//globals
int calibrationTime = 5;//use 30
const byte numChars = 32;
const int servoSpeed= 8;//1-10 range
bool  newDataFlag   = false;

bool centerStart = false;
bool centerStop  = true;
bool leftStart   = false;
bool leftStop    = true;
bool rightStart  = false;
bool rightStop   = true;

char receivedChars[numChars];

//do some init
void setup()
{
  //serial setup
  Serial.begin(9600);

  pinMode(leftPir, INPUT);
  pinMode(rightPir, INPUT);
  pinMode(centerPir,INPUT);
  digitalWrite(leftPir, LOW);
  digitalWrite(rightPir, LOW);
  digitalWrite(centerPir, LOW);

  //servo setup
  panServo.attachPin(pan);
  panServo.setSpeed(servoSpeed);

  tiltServo.attachPin(tilt);
  tiltServo.setSpeed(servoSpeed);

  //give the sensor some time to calibrate
  Serial.print("calibrating sensor ");
    for(int i = 0; i < calibrationTime; i++){
      Serial.print(".");
      delay(1000);
    }
    Serial.println(" done");
    Serial.println("SENSOR ACTIVE");
    delay(50);
}

void moveLeft(){
  panServo.setAngle(0);
  tiltServo.setAngle(90);
}

void moveRight(){
  panServo.setAngle(180);
  tiltServo.setAngle(90);
}

void moveCenter(){
  panServo.setAngle(90);
  tiltServo.setAngle(90);
}

void processMotion(){

  //CENTER
  if(digitalRead(centerPir) == HIGH){
    if(!centerStart){
      centerStart=true;
      centerStop = false;
      //moveCenter();
      Serial.println("CENTER_START");
    }
  }
  else{
    if(!centerStop){
      centerStop=true;
      centerStart=false;
      Serial.println("CENTER_STOP");
    }
  }
  
  //LEFT
  if(digitalRead(leftPir) == HIGH){
    if(!leftStart){
      leftStart=true;
      leftStop=false;
      //moveLeft();
      Serial.println("LEFT_START");
    }
  }
  else{
    if(!leftStop){
      leftStop=true;
      leftStart=false;
      Serial.println("LEFT_STOP");
    }
  }
  
  //RIGHT
  if(digitalRead(rightPir) == HIGH){
    if(!rightStart){
      rightStart=true;
      rightStop=false;
      //moveRight();
      Serial.println("RIGHT_START");
    }
  }
  else{
    if(!rightStop){
      rightStop=true;
      rightStart=false;
      Serial.println("RIGHT_STOP");
    }
  }
}

void loop()
{
  processMotion();

  //OVERRIDE SERVO MOVEMENT VIA SERIAL-IN
  rxData();
  if(newDataFlag){
     bool servoFlag     = false;
     bool servo2Flag    = false;

     char * seg = strtok(receivedChars,":");
     int i = 0;
     //Index 0=pin designation. Index 1=command.
     while (seg != NULL)
     {
       if(i==0){
           if(isNumeric(seg)){
             switch(atoi(seg)){
              case pan:
                servoFlag = true;
                break;
              case tilt:
                servo2Flag = true;
                break;
              default:
                break;
             }
           }
        }
        else if(i==1){//do something
          if(servoFlag){
            panServo.setAngle(atoi(seg));
          }
          else if(servo2Flag){
            tiltServo.setAngle(atoi(seg));
          }
        }

        seg = strtok (NULL, ":");
        i++;
     }

     newDataFlag = false;//reset
  }

  panServo.move();
  tiltServo.move();
}//loop

void rxData() {
        static byte ndx = 0;
        char endMarker = '\n';
        char rc;

    while (Serial.available() > 0 && newDataFlag == false) {
        rc = Serial.read();

        if (rc != endMarker) {
            receivedChars[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
          receivedChars[ndx] = '\0'; // terminate the string
          ndx = 0;
          newDataFlag = true;
        }
    }
}

bool isNumeric(char *string)
{
    int sizeOfString = strlen(string);
    int iteration = 0;
    bool isNumeric = true;

    while(iteration < sizeOfString)
    {
        if(!isdigit(string[iteration]))
        {
            isNumeric = false;
            break;
        }
        iteration++;
    }

    return isNumeric;
}

