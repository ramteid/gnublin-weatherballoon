gnublin-weatherballoon
======================

A meteorological balloon / weather balloon based on the Gnublin platform / Ein Wetterballon basierend auf der Gnublin-Plattform

required packages:
gammu python-dev usb-modeswitch ppp gpsd gpsd-clients

probably useful packets:
dos2unix gcc g++

kernel menuconfig options for making the UMTS-stick work:
Device Drivers->USB Support->USB Serial Converter Support->USB driver for GSM and CDMA modems (Module option)
Device Drivers->Networking Device Support->PPP Support (Module ppp_generic and others)
