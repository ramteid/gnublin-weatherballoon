#! /bin/sh
# place this script and all the other scripts and files in /root/

cp local.autostart /etc/init.d/local.autostart

chmod 7777 /etc/init.d/local.autostart

chmod 7777 listener.py
chmod 7777 listener_start.py
chmod 7777 temperature.py

chmod 7777 script_watcher.sh

rm listener.pyc
rm listener_start.pyc
rm temperature.pyc
mkdir /root/pictures

gcc wdt_starter.c -o wdt_starter -I /usr/include/python2.6 -l python2.6
chmod 7777 wdt_starter