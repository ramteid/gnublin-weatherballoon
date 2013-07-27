#!/bin/sh
# Sends all 10 seconds an impulse to the micro controller

GPIO=11

cleanup() { # Release the GPIO port
	echo $GPIO > /sys/class/gpio/unexport
	exit
}

# Open the GPIO port ('high' direction is output)
echo $GPIO > /sys/class/gpio/export
echo "high" > /sys/class/gpio/gpio$GPIO/direction

trap cleanup SIGINT # call cleanup on Ctrl-C

while [ "1" = "1" ];
do
	echo 1 > /sys/class/gpio/gpio$GPIO/value
	sleep 1
	echo 0 > /sys/class/gpio/gpio$GPIO/value
	sleep 10
done

cleanup # call the cleanup routine