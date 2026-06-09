package iot

func ReadSensor() SensorData {
    return SensorData{
        PH: 7.0,
        Oxygen: 6.0,
        Temp: 28,
    }
}
