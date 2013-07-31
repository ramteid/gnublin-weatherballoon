#! /bin/bash
# place this script and all the other scripts and files in /root/
# run this script with root privileges

# convert line endings from windows to unix format
dos2unix local.autostart
dos2unix listener.py
dos2unix listener_start.py
dos2unix temperature.py
dos2unix gpsParser.py
dos2unix script_watcher.sh
dos2unix impulse.sh
dos2unix wdt_starter.c

cp local.autostart /etc/init.d/local.autostart

chmod 7777 /etc/init.d/local.autostart

chmod 7777 listener.py
chmod 7777 listener_start.py
chmod 7777 temperature.py
chmod 7777 gpsParser.py

chmod 7777 script_watcher.sh
chmod 7777 impulse.sh

rm listener.pyc
rm listener_start.pyc
rm temperature.pyc
rm gpsParser.pyc
mkdir /root/pictures

# compile the c files
gcc wdt_starter.c -o wdt_starter -I /usr/include/python2.6 -l python2.6
gcc temperature.c -o temperature -lm
gcc impulse.cpp -o impulse

chmod 7777 wdt_starter
chmod 7777 temperature
chmod 7777 impulse

# assign runlevel
update-rc.d local.autostart defaults
