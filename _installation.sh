#! /bin/sh

# Vor der Installation alle Dateien in /root/ kopieren

cp local.autostart /etc/init.d/local.autostart

chmod 7777 /etc/init.d/local.autostart

chmod 7777 listener.py
chmod 7777 listener_start.py
chmod 7777 temp.py

chmod 7777 script_watcher.sh

rm listener.pyc
rm listener_start.pyc
rm temp.pyc
mkdir /root/pictures

