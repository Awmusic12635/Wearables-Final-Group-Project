int count = 0;
char input[12];
bool flag = 0;
const int VIBRATE_PIN = D0; //vibration motor pin
//constants for the buzzer
const int BUZZER_PIN = A4;
const int GOOD_TONE = 500;
const int GOOD_TONE_DURATION_MS = 1000;
const int BAD_TONE = 800;
const int BAD_TONE_DURATION_MS = 500;
const int BAD_REPEAT = 3;

void photonFeedbackHandler(const char *topic, const char *data);

void setup() {
    Serial1.begin(9600); //RFID
    Serial.begin(9600);
    pinMode(VIBRATE_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    Particle.subscribe("hook-response/nodeServerRFID", photonFeedbackHandler, MY_DEVICES);
}

void loop() {
    scanRFID();
}

void unauthorized(){
    warningTone(BAD_TONE,BAD_TONE_DURATION_MS, BAD_REPEAT);
}

void authorized(){
    warningTone(GOOD_TONE,GOOD_TONE_DURATION_MS, 1);
}

void scanRFID(){
    if (Serial1.available()) {
        count = 0;
        
        while(Serial1.available() && count < 12) {
            input[count] = Serial1.read();
            // Serial.print(input[count],DEC);
            // Serial.print(" ");
            count++;
            delay(5);
        }
        
        Serial.println(" ");
        Serial.println(input);
        
        if ((input[0] ^ input[2] ^ input[4] ^ input[6] ^ input[8] == input[10]) && (input[1] ^ input[3] ^ input[5] ^ input[7] ^ input[9] == input[11])) {
            Serial.println("Tag validated!");
            Serial.println(input);
            Particle.publish("nodeServerRFID", input);
        } else {
            Serial.println("Unable to validate tag.");
        }
    } else {
        Serial.println("Serial1 not available!");
        delay(1000);
    }
}

void photonFeedbackHandler(const char *topic, const char *data){
    if(data == "Valid"){
        authorized();
    }else{
        unauthorized();
    }
}

void warningTone(uint16_t nFreq, uint16_t nDuration, uint8_t nCount){
    //set up loop counter
    int n = 0;
    //while loop counter is < parameter nCount
    while (n++ < nCount){
        //play the specified tone
        playTone(BUZZER_PIN, nFreq, nDuration);
        //vibrate the motor
        vibrate(nDuration);
        //if we will repeat, pause briefly so tones/vibrations don't run together
        if(n < nCount){
            delay(250);
        }
    }
    //you can also send alerts of conencted to wifi device;
}

void playTone(uint8_t nPin, uint16_t nFreq, uint16_t nDuration){
    //if frequency or duration is 0, stop any tones
    if((nFreq == 0) || (nDuration == 0)){
        noTone(nPin);
    }else{
        //output specified tone for the duration specified
        tone(nPin,nFreq, nDuration);
        //since we want the tone to play synchronously, wait for it to finish
        delay(nDuration);
    }
}

void vibrate(uint16_t nDuration){
    digitalWrite(VIBRATE_PIN,HIGH);
    delay(nDuration);
    digitalWrite(VIBRATE_PIN,LOW);
    delay(nDuration);
    digitalWrite(VIBRATE_PIN,HIGH);
    delay(nDuration);
    digitalWrite(VIBRATE_PIN,LOW);
}
//TAG ID: 0000787D5B5E