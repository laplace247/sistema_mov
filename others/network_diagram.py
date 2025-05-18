from diagrams import Diagram, Cluster
from diagrams.onprem.network import Internet
from diagrams.generic.database import SQL
from diagrams.generic.device import Mobile
from diagrams.custom import Custom
from diagrams.aws.storage import SimpleStorageServiceS3 as SD

with Diagram("Arduino UNO + ESP32-CAM Security Network", show=True, direction="TB"):

    with Cluster("Control Unit (Arduino UNO)"):
        pir = Custom("PIR Sensor", "./icons/pir.png")
        rtc = Custom("RTC DS3231", "./icons/rtc.png")
        arduino = Custom("Arduino UNO", "./icons/arduino.png")
        pir >> arduino
        rtc >> arduino

    with Cluster("Capture Module"):
        esp32cam = Custom("ESP32-CAM", "./icons/esp32cam.png")
        cam = Custom("OV2640 Camera", "./icons/cam.png")
        sd = SD("MicroSD")
        arduino >> esp32cam
        esp32cam >> cam
        esp32cam >> sd

    with Cluster("Network Communication"):
        wifi = Custom("WiFi", "./icons/wifi.png")
        internet = Internet("HTTP/MQTT")
        esp32cam >> wifi >> internet

    with Cluster("Remote Monitoring"):
        android = Mobile("Android Phone")
        db = SQL("Remote DB")
        internet >> android
        internet >> db
