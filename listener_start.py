#!/usr/bin/python
# this script needs root privileges

from listener import Listener
import time
import thread
import datetime
import os

os.system("export LD_LIBRARY_PATH=/usr/local/lib")


# crash-catching loop
while True:
    try:
        listener = Listener()
        listener.initCapturing(60)
        listener.initGetTimeFromGPS(600)
        
        # listen for commands via SMS
        thread.start_new_thread( listener.listenForCommands, () )
        listener.sendSMS("Device is up and listening")
        
        # main loop
        while True:
            time.sleep(4)
            
            temperatureExternal= listener.getTemperatureExternal()
            
            temperatureInternal = listener.getTemperatureInternal()
            
            gpsInfo, coords, height = listener.getGpsInfo()
            
            networkInfo = listener.getNetworkInfo(sendSMS=False)
            
            listener.logAllRecords(temperatureExternal, temperatureInternal, gpsInfo, coords, height, networkInfo)
            time.sleep(240)
    
    except Exception as e:
        print e
        try:
            with open("/root/logs/messages.log", "a") as myfile:
                s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                s += "    " + "main-loop" + "        " + str(e) + "\n"
                myfile.write(s)

        except Exception as e:
            print "Error while logging, can't be logged ..."
            print e
        print "waiting 20 seconds to re-loop"
        time.sleep(20)
    
