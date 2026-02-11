/**
 * Project Sentinel - ESP32 Sensor Data Collection
 * Continuously reads MPU-6050 IMU and flex sensor data
 * Transmits via WebSocket every 100ms for VR training platform
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

// Network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* websocket_server = "192.168.1.100";
const int websocket_port = 3001;

// Hardware pins
const int FLEX_PINS[5] = {34, 35, 32, 33, 25}; // Analog pins for flex sensors
const int LED_PIN = 2; // Built-in LED for status indication

// Sensor objects
Adafruit_MPU6050 mpu;
WebSocketsClient webSocket;

// Timing variables
unsigned long lastSensorRead = 0;
const unsigned long SENSOR_INTERVAL = 100; // 100ms interval

// Calibration values for flex sensors
const float FLEX_MIN[5] = {100, 100, 100, 100, 100}; // Minimum ADC values
const float FLEX_MAX[5] = {4000, 4000, 4000, 4000, 4000}; // Maximum ADC values

/**
 * WebSocket event handler
 * Manages connection status and incoming messages
 */
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.println("[WS] Disconnected");
            digitalWrite(LED_PIN, LOW);
            break;
            
        case WStype_CONNECTED:
            Serial.printf("[WS] Connected to: %s\n", payload);
            digitalWrite(LED_PIN, HIGH);
            break;
            
        case WStype_TEXT:
            Serial.printf("[WS] Received: %s\n", payload);
            break;
            
        case WStype_ERROR:
            Serial.printf("[WS] Error: %s\n", payload);
            break;
            
        default:
            break;
    }
}

/**
 * Initialize WiFi connection with retry mechanism
 */
void initWiFi() {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println();
        Serial.print("Connected! IP: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nWiFi connection failed!");
    }
}

/**
 * Initialize MPU-6050 sensor with error handling
 */
bool initMPU() {
    if (!mpu.begin()) {
        Serial.println("Failed to find MPU6050 chip");
        return false;
    }
    
    // Configure sensor ranges
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
    
    Serial.println("MPU6050 initialized successfully");
    return true;
}

/**
 * Read and normalize flex sensor values
 * Returns normalized values between 0.0 and 1.0
 */
void readFlexSensors(float flexValues[5]) {
    for (int i = 0; i < 5; i++) {
        int rawValue = analogRead(FLEX_PINS[i]);
        // Normalize to 0-1 range
        flexValues[i] = (float)(rawValue - FLEX_MIN[i]) / (FLEX_MAX[i] - FLEX_MIN[i]);
        flexValues[i] = constrain(flexValues[i], 0.0, 1.0);
    }
}

/**
 * Create and send sensor data as JSON via WebSocket
 */
void sendSensorData() {
    // Read MPU-6050 data
    sensors_event_t accel, gyro, temp;
    mpu.getEvent(&accel, &gyro, &temp);
    
    // Read flex sensor data
    float flexValues[5];
    readFlexSensors(flexValues);
    
    // Create JSON document
    StaticJsonDocument<512> doc;
    doc["timestamp"] = millis();
    doc["deviceId"] = "ESP32_001";
    
    // IMU data
    JsonObject imu = doc.createNestedObject("imu");
    JsonObject accelData = imu.createNestedObject("acceleration");
    accelData["x"] = accel.acceleration.x;
    accelData["y"] = accel.acceleration.y;
    accelData["z"] = accel.acceleration.z;
    
    JsonObject gyroData = imu.createNestedObject("gyroscope");
    gyroData["x"] = gyro.gyro.x;
    gyroData["y"] = gyro.gyro.y;
    gyroData["z"] = gyro.gyro.z;
    
    // Flex sensor data
    JsonArray flexArray = doc.createNestedArray("flexSensors");
    for (int i = 0; i < 5; i++) {
        JsonObject finger = flexArray.createNestedObject();
        finger["finger"] = i;
        finger["value"] = flexValues[i];
    }
    
    // Serialize and send
    String jsonString;
    serializeJson(doc, jsonString);
    webSocket.sendTXT(jsonString);
    
    // Debug output (reduce frequency for performance)
    static int debugCounter = 0;
    if (debugCounter++ % 10 == 0) {
        Serial.println("Sent: " + jsonString);
    }
}

/**
 * Arduino setup function
 */
void setup() {
    Serial.begin(115200);
    pinMode(LED_PIN, OUTPUT);
    
    Serial.println("Project Sentinel - ESP32 Sensor Node");
    Serial.println("Initializing...");
    
    // Initialize I2C for MPU-6050
    Wire.begin();
    
    // Initialize sensors
    if (!initMPU()) {
        Serial.println("Sensor initialization failed!");
        while(1) {
            digitalWrite(LED_PIN, HIGH);
            delay(200);
            digitalWrite(LED_PIN, LOW);
            delay(200);
        }
    }
    
    // Initialize WiFi
    initWiFi();
    
    // Initialize WebSocket connection
    webSocket.begin(websocket_server, websocket_port, "/");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
    
    Serial.println("Setup complete. Starting sensor loop...");
}

/**
 * Arduino main loop
 */
void loop() {
    webSocket.loop();
    
    // Send sensor data every 100ms
    unsigned long currentTime = millis();
    if (currentTime - lastSensorRead >= SENSOR_INTERVAL) {
        if (WiFi.status() == WL_CONNECTED && webSocket.isConnected()) {
            sendSensorData();
        }
        lastSensorRead = currentTime;
    }
    
    // Small delay to prevent watchdog issues
    delay(1);
}