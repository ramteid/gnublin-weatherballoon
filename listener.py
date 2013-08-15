#!/usr/bin/python
# this script needs root privileges

import datetime
import thread
import gammu
import sys
import time
import os
import random
from temperature import Temperature
from subprocess import Popen, PIPE
from gpsParser import GpsParser
from ctypes import CDLL, c_float

class Listener(object):

	def __init__(self):
		self.number = '+4917621929963'
		self.pictureInterval = 20
		self.temperatureInterval = 60
		self.smsListeningInterval = 10
		self.gpsReportingInterval = 120
		self.threadLockNumberReports = 0
		self.threadLockNumberPictures = 0
		self.threadLockNumberTemperature = 0
		self.threadLockNumberGpsTime = 0
		self.sendGPSSMS = False
		self.pictureDir = "/root/pictures"
		self.sendTemperature = False
		self.getTimeFromGpsLoop = True
		self.gpsParser = GpsParser()
		self.temperatureClass = Temperature()
		
		try:
			# Create state machine object
			self.sm = gammu.StateMachine()
			# Read ~/.gammurc
			self.sm.ReadConfig(Filename = "/root/.gammurc")
			# Connect to phone
			self.sm.Init()
		except Exception as e:
			# Unplugging the UMTS stick requires a restart
			print e
			self.logMessage(e, "__init__")
			if e.Code == 4:
				print "restarting in 300 sec..."
				time.sleep(300)
				os.system("reboot")


	def sendSMS(self, text):
		try:
			message = {
				'Text': text, 
				'SMSC': {'Location': 1},
				'Number': self.number,
			}
			self.sm.SendSMS(message)

		except Exception as e:
			print "sendSMS"
			print e
			self.logMessage(e, "sendSMS")
			

	def getAllSMS(self):
		smslist = []

		for folder in [3]:		# 1=Inbox SIM, 3=Inbox Device (maybe inversed)
			lastloc = 0
			start = True

			while 1:
				try:
					if start:
						sms = self.sm.GetNextSMS(Start = True, Folder=folder)
						if len(sms) > 0:
							lastloc = sms[0]['Location']
							smslist.append(sms[0])
							start = False
						else:
							break
					else:
						sms = self.sm.GetNextSMS(Location = lastloc, Folder=folder)
						if len(sms) > 0:
							lastloc = sms[0]['Location']
							smslist.append(sms[0])
						else:
							break
				except Exception:
					break

		return smslist


	def deleteReadSMS(self, smslist):
		for sms in smslist:
			try:
				folder = sms['Folder']
				location = sms['Location'] - 100000  # in our case theres somehow a large offset
				self.sm.DeleteSMS(Folder = folder, Location = location)
				
			except Exception as e:
				print "deleteReadSMS"
				print e
				self.logMessage(e, "deleteReadSMS")


	# parameter must be a string
	def logAllRecords(self, temperatureExternal, temperatureInternal, gpsInfo, coords, height, networkInfo):
		try:
			with open("/root/logs/allRecords.log", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + temperatureExternal + "\n"
				s += "	" + temperatureInternal + "\n"
				s += "	" + str(gpsInfo) + "\n"
				s += "	" + coords + "\n"
				s += "	" + height + "\n"
				s += "	" + str(networkInfo) + "\n\n"
				
				print ""
				print temperatureExternal
				print temperatureInternal
				print str(gpsInfo)
				print coords
				print height
				print str(networkInfo)
				print ""
				
				myfile.write(s)

		except Exception as e:
			print "logAllRecords"
			print e
			self.logMessage(e, "logAllRecords")
			
			
	# parameter must be a string
	def logCoords(self, coords):
		try:
			with open("/root/logs/coordinates.log", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + coords + "\n"
				myfile.write(s)

		except Exception as e:
			print "logCoords"
			print e
			self.logMessage(e, "logCoords")


	# first parameter must be something convertable to s, second parameter must be a string
	def logMessage(self, message, origin):
		try:
			with open("/root/logs/messages.log", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + str(origin) + "		" + str(message) + "\n"
				myfile.write(s)

		except Exception as e:
			print "Error while logging, can't be logged ..."
			print e
			
	# first parameter must be something convertable to s, second parameter must be a string
	def logTemperature(self, message, origin):
		try:
			with open("/root/logs/temperatures.log", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + str(origin) + "		" + str(message) + "\n"
				myfile.write(s)

		except Exception as e:
			print "logTemperature"
			print e
			self.logMessage(e, "logCoords")
			
	
	# thread that loops and logs/sends gps coordinates
	def logGPScoordinates(self, myThreadLockNumber, seconds):
		interval = self.gpsReportingInterval
		try:
			interval = int(seconds)
		except Exception as e:
			#print "logGPScoordinates-listener"
			#print e
			self.logMessage(e, "logGPScoordinates-interval")
			interval = self.gpsReportingInterval
			
		# to avoid multiple threads, there'a lock number
		while (myThreadLockNumber == self.threadLockNumberReports):
			try:
				lines = self.gpsParser.readGpsData(timeout=6)
				coords, height = self.gpsParser.getGpsCoordinatesParser(lines, sendSMS=self.sendGPSSMS)
					
				self.logCoords(coords + ": " + height + "m")
				
				if self.sendGPSSMS:
					self.sendSMS(coords + ": " + height + "m\n" + "http://maps.google.de/maps?q=" + coords)
				
				time.sleep(interval)
				
			except Exception as e:
				print "logGPScoordinates-listener-loop"
				print e
				self.logMessage(e, "logGPScoordinates-report")


	def initGetTimeFromGPS(self, interval):
		newThreadLockNumber = random.randint(1,99999)
		self.threadLockNumberGpsTime = newThreadLockNumber
		thread.start_new_thread( self.getTimeFromGPS, (newThreadLockNumber, interval) )

	# thread to get the gps timestamp and set the system clock 
	def getTimeFromGPS(self, myThreadLockNumber, interval=300):
		while self.getTimeFromGpsLoop and myThreadLockNumber == self.threadLockNumberGpsTime:
			try:
				# set the system date/time
				gpsData = self.gpsParser.readGpsData(timeout=2)
				success = self.gpsParser.parseAndSetDateTime(gpsData)
				time.sleep(interval)
			except Exception as e:
				#print e
				self.logMessage(e, "getTimeFromGPS")
				time.sleep(interval)
			

	# parse various gps information from NMEA output
	def getGpsInfo(self):
		try:
			gpsLines = self.gpsParser.readGpsData(timeout = 6)
			gps_info = self.gpsParser.parseGpsData(gpsLines)
			coords, height = self.getGPScoordinates(lines=gpsLines, sendSMS=False)
			return gps_info, coords, height
		except Exception as e:
			print "getGpsInfo"
			print e
			self.logMessage(e, "parseGpsData")
			return "-","-","-"
			
			
	# get gps coordinates on demand
	def getGPScoordinates(self, lines = [], sendSMS=False):
		try:
			if not lines:
				lines = self.gpsParser.readGpsData(timeout=6)
				
			coords, height = self.gpsParser.getGpsCoordinatesParser(lines)
			if coords == "-":
				raise Exception("coordinates invalid: -")
				
			if sendSMS:
				self.sendSMS(coords + ": " + height + "m\n" + "http://maps.google.de/maps?q=" + coords)
			return coords, height
				
		except Exception as e:
			#print "getGPScoordinates-listener"
			#print e
			self.logMessage(e, "getGPScoordinates")
			return "-","-"
			
			
	def setSystemTime(self, datetime):
		#expects a string in format 20130717121400
		try:
			year = datetime[0:4]
			month = datetime[4:6]
			day = datetime[6:8]
			hour = datetime[8:10]
			min = datetime[10:12]
			sec = datetime [12:14]
			s = 'date -s "{0}-{1}-{2} {3}:{4}:{5}"'.format(year, month, day, hour, min, sec)
			os.system(s)
			print "date set:"
			os.system("date")
			
		except Exception as e:
			print "setSystemTime"
			print e
			self.logMessage(e, "setSystemTime")
			

	def getSystemTime(self):
		try:
			time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			self.sendSMS(time)

		except Exception as e:
			print "getSystemTime"
			print e
			self.logMessage(e, "getSystemTime")
			

	def getNetworkInfo(self, sendSMS=False):
		# Reads network information from phone
		try:
			netinfo = self.sm.GetNetworkInfo()		# 'State': 'NoNetwork' = no signal
			signalQuality = self.sm.GetSignalQuality()
			
			if sendSMS:
				s = "Signal: " + signalQuality['SignalPercent'] + "% \n"
				for key in netinfo:
					s += key + ": " + netinfo[key] + "\n"
				print s
				self.sendSMS(s)
				
			return dict(netinfo, **signalQuality)
			
		except Exception as e:
			print "getNetworkInfo"
			print e
			self.logMessage(e, "getNetworkInfo")

	
	def initCapturing(self, interval):
		newThreadLockNumber = random.randint(1,99999)
		self.threadLockNumberPictures = newThreadLockNumber
		thread.start_new_thread( self.takePictures, (newThreadLockNumber, interval) )
		print "thread gestartet: " + str(newThreadLockNumber)
	
	
	def takePictures(self, myThreadLockNumber, seconds):
		if not os.path.isdir(self.pictureDir):
			print "pictures directory does not exist"
			return
			
		interval = self.pictureInterval
		try:
			interval = int(seconds)
		except Exception as e:
			print "takePicutes-upper"
			print e
			self.logMessage(e, "takePictures-interval")
			interval = self.pictureInterval
			
		# continue with file numbers
		try:
			if len(os.listdir(self.pictureDir)) > 0:
				# get largest file number
				# assuming file names like 1.jpg, 2.jpg, ...
				numbers = []
				index = 0
				#iterate over all files and retrieve file names
				for i,file_name in enumerate(sorted(os.listdir(self.pictureDir))):
					try:
						s = file_name.split(".")
						n = s[0]
						o = int(n)
						numbers.append(o)
						# sort the list descending
						numbers.sort(reverse=True)		
						# the highest file number plus one is the new image index
						index = numbers[0] + 1
						
					except Exception as e:
						print "takePictures-inner"
						print e
						self.logMessage(e, "takePictures-filenames")
						index = 0
			else:
				index = 0
			
			# capture pictures
			while (myThreadLockNumber == self.threadLockNumberPictures):
				filename = "{0}/{1}.jpg".format(self.pictureDir, index)
				command = "uvccapture -o{0} -m -x640 -y480 2> /dev/null".format(filename)
				print "capture picture " + str(index)
				os.system(command)
				if os.path.exists(filename):
					index += 1
				time.sleep(interval)
		
		except Exception as e:
				print "takePictures"
				print e
				self.logMessage(e, "takePictures")	
				time.sleep(60)		

	
	# start thread for logging PT1000 temperature
	def initLogTemperature(self, seconds):
		newThreadLockNumber = random.randint(1, 99999)
		self.threadLockNumberTemperature = newThreadLockNumber
		thread.start_new_thread(self.logTemperatureStart, (newThreadLockNumber, seconds))
		print "thread gestartet: " + str(newThreadLockNumber)

	
	# thread for logging PT1000 temperature
	def logTemperatureStart(self, myThreadLockNumber, seconds):
		try:
			tempLib = CDLL("/usr/local/lib/temperature.so")
			tempLib.calculateTemperature.restype = c_float
			interval = self.temperatureInterval
			interval = int(seconds)
		except Exception as e:
			print "logTemperatureStart"
			print e
			self.logMessage(e, "logTemperatureStart-init")
			interval = self.temperatureInterval
		try:
			while (myThreadLockNumber == self.threadLockNumberTemperature):
				celsius = tempLib.calculateTemperature()
				fahrenheit = celsius * 33.8
				tempString = "{0} Celsius / {1} Fahrenheit".format(celsius, fahrenheit)
				self.logTemperature(tempString, "logTemperatureStart")
				if self.sendTemperature:
					self.sendSMS(tempString)
				time.sleep(interval)
		
		except Exception as e:
			print "logTemperatureStart-loop"
			print e
			self.logMessage(e, "logTemperatureStart")


	# return PT1000 temperature
	def getTemperatureExternal(self):
		try:
			#tempLib = CDLL("/usr/local/lib/temperature.so")
			#tempLib.calculateTemperature.restype = c_float
			#celsius = tempLib.calculateTemperature()
			#return str(celsius)
			t = self.temperatureClass.calculateTemperature()
			return str(t)
		except Exception as e:
			print "getTemperatureExternal"
			print e
			self.logMessage(e, "getTemperatureExtern")
			return "-"
	

	# return Gnublin temperature module temperature
	def getTemperatureInternal(self):
		try:
			(stdout, stderr) = Popen(["gnublin-lm75", "-b"], stdout=PIPE).communicate()
			return stdout
		except Exception as e:
			print "getTemperatureInternal"
			print e
			self.logMessage(e, "getTemperatureIntern")
			return "-"
	

	def processCommands(self, smslist):
		for sms in smslist:
			try:
				cmd = sms['Text'].lower()
				print "cmd: " + cmd

				# stop gps logging
				if cmd == 'loggpsstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberReports = 0
					print "thread gestoppt"
				
				# start sending gps coordinates via sms
				elif cmd == 'repgpsstart':
					self.sendGPSSMS = True
				
				# stop sending gps coordinates via sms
				elif cmd == 'repgpsstop':
					self.sendGPSSMS = False
				
				# stop setting time via gps
				elif cmd == 'gpstimestop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberGpsTime = 0
					print "thread gestoppt"
				
				# get gps coordinates on demand
				elif cmd == 'getgps':
					self.getGPScoordinates(lines=[], sendSMS=True)
				
				# stop capturing images with camera
				elif cmd == 'capstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberPictures = 0
					print "thread gestoppt"
				
				# stop logging temperature
				elif cmd == 'logtempstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberTemperature = 0
					print "thread gestoppt"
				
				# start sending temperatures via sms
				elif cmd == 'sendtempstart':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.sendTemperature = True
					
				# stop sending temperatures via sms
				elif cmd == 'sendtempstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.sendTemperature = False
					
				# send the time via sms
				elif cmd == 'gettime':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.getSystemTime()
				
				# send network information via sms
				elif cmd == 'getnetwork':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.getNetworkInfo(sendSMS=True)
					
				# reboot system
				elif cmd == 'restart_system' or cmd == 'reboot_system':
					self.logMessage("cmd: " + cmd, "processCommands")
					os.system("reboot")
			
				# set time to a value specified in a sms
				elif cmd[0:7] == 'settime':		#e.g. settime20130802120500
					self.logMessage("cmd: " + cmd, "processCommands")
					datetime = cmd[7:]
					self.setSystemTime(datetime)
				
				# run any system command
				elif cmd[0:7] == 'system_':		#e.g. system_reboot
					print "executing command: " + cmd
					self.logMessage("cmd: " + cmd, "processCommands")
					os.system(cmd[7:])
				
				# start capturing pictures with camera
				elif cmd[0:8] == 'capstart':	#e.g. capstart30
					self.logMessage("cmd: " + cmd, "processCommands")
					self.initCapturing(cmd[8:])
					
				# start logging temperatures
				elif cmd[0:9] == 'logtempstart':	#e.g. tempstart30
					self.logMessage("cmd: " + cmd, "processCommands")
					self.initLogTemperature(cmd[9:])
					
				# start logging gps coordinates
				elif cmd[0:11] == 'loggpsstart':	#e.g. loggpsstart30
					self.logMessage("cmd: " + cmd, "processCommands")
					newThreadLockNumber = random.randint(1,99999)
					self.threadLockNumberReports = newThreadLockNumber
					thread.start_new_thread( self.logGPScoordinates, (newThreadLockNumber, cmd[11:]) )
					print "thread gestartet: " + str(newThreadLockNumber)
					
				# start retrieving timestamp from GPS and set the system clock
				elif cmd[0:12] == 'gpstimestart':	#e.g. gpstimestart300
					self.initGetTimeFromGPS(cmd[0:12])
					self.logMessage("cmd: " + cmd, "processCommands")
					print "thread gestartet: " + str(newThreadLockNumber)
				
				# change sms sending phone number
				elif cmd[0:12] == 'changenumber':	#e.g. changenumber+491703939393
					self.number = cmd[12:]
				
				else:
					print "command not recognized"
					self.logMessage("unknown command: " + cmd, "processCommands")
				
			except Exception as e:
				print "processCommands"
				print e
				self.logMessage(e, "processCommands")
			

	def listenForCommands(self):
		while 1:
			try:
				time.sleep(self.smsListeningInterval)
				smslist = self.getAllSMS()
				if len(smslist) > 0:
					self.processCommands(smslist)
					self.deleteReadSMS(smslist)
				else:
					self.sm.GetNetworkInfo() #just to detect if stick is unplugged

			# Unplugging the UMTS stick requires a restart
			except gammu.ERR_DEVICEWRITEERROR as e:
				print "listenForCommands-DEVICEWRITEERR"
				print e
				self.logMessage(e, "listenForCommands")
				print "restarting in 300 sec..."
				time.sleep(300)
				os.system("reboot")
				
			except Exception as e:
				print "listenForCommands-Exception"
				print e
				self.logMessage(e, "listenForCommands")



