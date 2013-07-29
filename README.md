gnublin-weatherballoon
======================

A meteorological balloon / weather balloon based on the Gnublin platform / Ein Wetterballon basierend auf der Gnublin-Plattform

======================

installing gnublin:

git clone https://github.com/embeddedprojects/gnublin-distribution.git 

cd gnublin-distribution/lpc3131

./build_GNUBLIN_support_package.sh --start-mkmenuconfig yes

copy everything to SD-Card with Gnublin Installer: http://wiki.gnublin.org/index.php/Gnublin_Installer

======================

kernel menuconfig options for making the UMTS-stick work:

Device Drivers->USB Support->USB Serial Converter Support->USB driver for GSM and CDMA modems (Module option)

Device Drivers->Networking Device Support->PPP Support (Module ppp_generic and others)

======================

required packages:

gammu python-dev usb-modeswitch ppp gpsd gpsd-clients

probably useful packets:

dos2unix gcc g++ python-gps
