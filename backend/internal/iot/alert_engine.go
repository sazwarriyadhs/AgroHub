package iot

func CheckRules(data SensorData) string {

    if data.Oxygen < 4 {
        return "ALERT: Oxygen low"
    }

    if data.PH < 6.5 || data.PH > 8 {
        return "ALERT: pH abnormal"
    }

    return "OK"
}
