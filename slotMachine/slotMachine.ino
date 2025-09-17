
#include "Keyboard.h" 

const int buttonPin1 = 3;    
const int buttonPin2 = 4;  
const int buttonPin3 = 5;  
const int encoder = 7; 
const int offButton = 6;
float t=0;   
int powerPin=2;
bool previousButtonState1 = HIGH;
bool previousButtonState2 = HIGH;
bool previousButtonState3 = HIGH;
bool previousEncoderState=HIGH;
bool power = LOW;
bool buttonState1;
bool  buttonState2;
bool buttonState3;
bool  encoderState;

bool rotation=false;
float rot_angle=0;
float ax_z=-16;
float ax_x=5;
unsigned long timer;
#define wavenum 5

float waves[wavenum][4];//x,y,x,distance

#include <Adafruit_NeoPixel.h>

#define PIN 15          // пин данных
#define NUMPIXELS 120    // количество светиков в ленте
float x[NUMPIXELS];
float y[NUMPIXELS];
float z[NUMPIXELS];

Adafruit_NeoPixel strip(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800); 


void setup() {
  pinMode(powerPin,OUTPUT);
  Keyboard.begin();
  Serial.begin(115200);  
  strip.begin();
  strip.show();
  for(int i=0; i<strip.numPixels(); i++) {
    if(i<9){
      x[i]=0;
      y[i]=(i)*10/6+4;
      z[i]=-4;}
    else if(i<19){
      x[i]=3;
      y[i]=10;
      z[i]=6;
    }
    else if(i<25){
      x[i]=10-(i-19)*10/6;
      y[i]=20;
      z[i]=0;
    }
    else if(i<34){
      x[i]=0;
      y[i]=20;
      z[i]=-(i-25)*10/6;
    }
    else if(i<39){
      x[i]=-(i-34)*10/6*0.75;
      y[i]=20;
      z[i]=-float(i-34)*10/6*0.75-16;
    }
    else if(i<43){
      x[i]=-6;
      y[i]=20;
      z[i]=-float(i-39)*10/6-24;
    }
    else if(i<51){
      x[i]=-6;
      y[i]=18-float(i-43)*10/5;
      z[i]=-24;
    }
    else if(i<55){
      x[i]=-6;
      y[i]=0;
      z[i]=float(i-52)*10/6-28;
    }
    else if(i<58){
      x[i]=float(i-55)*10/6*0.75-6;
      y[i]=0;
      z[i]=float(i-55)*10/6*0.75-20;
    }
    else if(i<67){
      x[i]=0;
      y[i]=0;
      z[i]=float(i-58)*10/6-17;
    }
    else if(i<74){
      y[i]=0;
      x[i]=float(i-67)*10/6;
      z[i]=0;
    }
    else if(i<90){
      y[i]=0;
      x[i]=12;
      z[i]=29-float(i-74)*10/6;
    }
    else if(i<97)
    {
      y[i]=float(i-90)*10/5+9;
      x[i]=12;
      z[i]=0;
    }else if(i<105){
      y[i]=18-float(i-97)*10/5;
      x[i]=0;
      z[i]=0;
    }else{
      y[i]=20;
      x[i]=12;
      z[i]=29-float(i-105)*10/6;
    }
  }
  strip.show();
}

void loop() {
  buttonState1 = digitalRead(buttonPin1);
  buttonState2 = digitalRead(buttonPin2);
  buttonState3 = digitalRead(buttonPin3);
  encoderState = digitalRead(encoder);
  if ((buttonState1 != previousButtonState1)
      && (buttonState1 == HIGH)) {
    Keyboard.print("1");
    float maxnb=0;
    int maxin=0;
    for(int i = 0; i<wavenum;i++){
      if(maxnb<waves[i][3]){
        maxnb=waves[i][3];
        maxin=i;
        }
    }
    waves[maxin][0]=-3;
    waves[maxin][1]=4;
    waves[maxin][2]=-20;
    waves[maxin][3]=0;
    delay(1);
  }
  if ((buttonState2 != previousButtonState2)
      && (buttonState2 == HIGH)) {
    Keyboard.print("2");
        float maxnb=0;
    int maxin=0;
    for(int i = 0; i<wavenum;i++){
      if(maxnb<waves[i][3]){
        maxnb=waves[i][3];
        maxin=i;
        }
    }
    waves[maxin][0]=-3;
    waves[maxin][1]=10;
    waves[maxin][2]=-20;
    waves[maxin][3]=0;
    delay(1);
  }
  if ((buttonState3 != previousButtonState3)
      && (buttonState3 == HIGH)) {
    Keyboard.print("3");
        float maxnb=0;
    int maxin=0;
    for(int i = 0; i<wavenum;i++){
      if(maxnb<waves[i][3]){
        maxnb=waves[i][3];
        maxin=i;
        }
    }
    waves[maxin][0]=-3;
    waves[maxin][1]=16;
    waves[maxin][2]=-20;
    waves[maxin][3]=0;
    delay(1);
  }
  if (encoderState!=previousEncoderState){
    if(encoderState==HIGH){
     Keyboard.print("s");
     rotation=true;
     timer=millis();
    delay(100);}                                                                                                                        
  }
  if(digitalRead(offButton) == HIGH){
    if(power==LOW){
      digitalWrite(powerPin,HIGH);
      power=HIGH;
      delay(1000);
      Keyboard.begin();
      while(digitalRead(offButton) == HIGH){}
    }else{
    Keyboard.press(KEY_LEFT_CTRL);
    Keyboard.press(KEY_LEFT_ALT);
    Keyboard.press(KEY_F1);
    delay(100);
    Keyboard.releaseAll();
    for(int i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(0,0,0));
    }
    strip.show();
    delay(1000);
    Keyboard.print("poweroff\n");
    delay(30000);
    digitalWrite(powerPin,LOW);
    power=LOW;
      while(digitalRead(offButton) == HIGH){}
    }
  }
  if(power){
    for(int i=0; i<strip.numPixels(); i++) {
    int intensity=100;
    if(rotation){
    if(millis()-timer>10000 || millis()<timer){
      rotation=false;
    }
    rot_angle-=0.001;
    if (rot_angle < 0) rot_angle += 2 * 3.14159265;
    float angle = atan2(z[i] - ax_z, x[i] - ax_x)+rot_angle;
    if (angle < 0) angle += 2 * 3.14159265;
    if (angle > 2 * 3.14159265) angle -= 2 * 3.14159265;

    // переводим угол в градусы и делаем 15° сектора
    int sector = int(angle * 180.0 / 3.1415)/15; // 0..23 сектора22222ss

    // делаем сектора чередующимися по яркости
    if (sector % 2 == 0) {
        intensity = intensity;      // сектор яркий
    } else {
        intensity = 0;  // сектор затемненный
    }
    }
    
    for(int j=0;j<wavenum;j++){
      if(waves[j][3]<50){
      waves[j][3]+=0.05;
        float dx = x[i] - waves[j][0];
        float dy = y[i] - waves[j][1];
        float dz = z[i] - waves[j][2];
        float dist = dx*dx + dy*dy + dz*dz;
        float diff = (dist - waves[j][3]*waves[j][3])/30; // расстояние до "центра" волны
        float ring = 1.6/(abs(diff)+1)+diff*diff/(abs(diff)+1)/(abs(diff)+1)-1;
        intensity += int( 1000 * ring); // умножаем на базовую яркос
    }}

    
    intensity = constrain(intensity, 0, 255);
    strip.setPixelColor(i, strip.Color(intensity,(intensity/4),0));
    
  }
  strip.show();}
  previousButtonState1 = buttonState1;    
  previousButtonState2 = buttonState2;
  previousButtonState3 = buttonState3;
  previousEncoderState=encoderState;
    delay(50);                                                             
}                                                                                                                                                
