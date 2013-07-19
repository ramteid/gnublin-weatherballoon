#!/usr/bin/python
# this script needs root privileges

from listener import Listener

listener = Listener()
listener.initCapturing(10)
listener.sendSMS("Device is up and listening")
listener.listenForCommands()