package logger

import (
    "log"
    "os"
)

var (
    InfoLog  = log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
    ErrorLog = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
)

func Init(level string) {
    InfoLog.Println("Logger initialized with level:", level)
}

func Info(msg string) {
    InfoLog.Println(msg)
}

func Infof(format string, v ...interface{}) {
    InfoLog.Printf(format, v...)
}

func Error(msg string) {
    ErrorLog.Println(msg)
}

func Errorf(format string, v ...interface{}) {
    ErrorLog.Printf(format, v...)
}

func Fatal(msg string) {
    ErrorLog.Fatal(msg)
}

func Fatalf(format string, v ...interface{}) {
    ErrorLog.Fatalf(format, v...)
}
