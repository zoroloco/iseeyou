//Kenneth Centurion
#include<SimpleServo.h>
#include<Servo.h>

//digital pins
//servos
const int pin    = 9;
const int pin2   = 10;
const int frontPir = 1;

SimpleServo myServo;
SimpleServo myServo2;

const byte numChars      = 32;
bool  newDataFlag        = false;
char receivedChars[numChars];

void setup()
{
  //serial setup
  Serial.begin(9600);

  //servo setup
  myServo.attachPin(pin);
  myServo.setSpeed(8);

  myServo2.attachPin(pin2);
  myServo2.setSpeed(8);
}

void loop()
{
  rxData();
  if(newDataFlag){
     bool servoFlag     = false;
     bool servo2Flag    = false;

     char * seg = strtok(receivedChars,":");
     int i = 0;

     while (seg != NULL)
     {
       if(i==0){//what pin?
           if(isNumeric(seg)){
             switch(atoi(seg)){
              case pin:
                servoFlag = true;
                break;
              case pin2:
                servo2Flag = true;
                break;
              default:
                break;
             }
           }
        }
        else if(i==1){//do something
          if(servoFlag){
            myServo.setAngle(atoi(seg));
          }
          else if(servo2Flag){
            myServo2.setAngle(atoi(seg));
          }
        }

        seg = strtok (NULL, ":");
        i++;
     }

     newDataFlag = false;//reset
  }

  myServo.move();
  myServo2.move();
}

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
