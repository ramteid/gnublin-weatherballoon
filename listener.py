#!/usr/bin/python
# this script needs root privileges

import datetime
import thread
import gammu
import sys
import time
import os
import random

class Listener(object):

	def __init__(self):
		self.smsListeningInterval = 10
		self.pictureInterval = 10
		self.reportingInterval = 120
		self.threadLockNumberReports = 0
		self.threadLockNumberPictures = 0
		self.pictureDir = "/root/pictures"
		
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
			self.logMessage(e, "main")
			print "restarting in 300 sec..."
			time.sleep(300)
			os.system("reboot")


	def sendSMS(self, text):
		try:
			number = '+4917621929963'
			message = {
				'Text': text, 
				'SMSC': {'Location': 1},
				'Number': number,
			}
			self.sm.SendSMS(message)

		except Exception as e:
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
				print e
				self.logMessage(e, "deleteReadSMS")


	# parameter must be a string
	def logCoords(self, coords):
		try:
			with open("/root/log_coords.txt", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + coords + "\n"
				myfile.write(s)

		except Exception as e:
			print e
			self.logMessage(e, "logCoords")


	# first parameter must be something convertable to s, second parameter must be a string
	def logMessage(self, message, origin):
		try:
			with open("/root/log_messages.txt", "a") as myfile:
				s = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
				s += "	" + str(origin) + "		" + str(message) + "\n"
				myfile.write(s)

		except Exception as e:
			print "Error while logging, can't be logged ..."
			print e
			

	def startReportingGPS(self, myThreadLockNumber, seconds):
		interval = self.reportingInterval
		try:
			interval = int(seconds)
		except Exception as e:
			print e
			self.logMessage(e, "startReportingGPS-interval")
			interval = self.reportingInterval
			
		# to avoid multiple threads, there'a lock number
		while (myThreadLockNumber == self.threadLockNumberReports):
			try:
				coords = "1234.5678" #dummy data
				self.logCoords(coords)

				#signalQuality = self.sm.GetSignalQuality()
				#percent = signalQuality['SignalPercent']
				#if percent > 5:
				self.sendSMS(coords)
				
				time.sleep(interval)
				
			except Exception as e:
				print e
				self.logMessage(e, "startReportingGPS-report")


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
			print e
			self.logMessage(e, "setSystemTime")
			

	def getSystemTime(self):
		try:
			time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			self.sendSMS(time)

		except Exception as e:
			print e
			self.logMessage(e, "getSystemTime")
			

	def getNetworkInfo(self):
		# Reads network information from phone
		try:
			self.netinfo = self.sm.GetNetworkInfo()
			signalQuality = self.sm.GetSignalQuality()
			s = "Signal: " + signalQuality['SignalPercent'] + "% \n"
			
			for key in netinfo:
				s += key + ": " + netinfo[key] + "\n"
			
			print s
			self.sendSMS(s)
		except Exception as e:
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
			print e
			self.logMessage(e, "takePictures-interval")
			interval = self.pictureInterval
			
		try:
			if len(os.listdir(self.pictureDir)) > 0
				# get largest file number
				# assuming file names like 1.jpg, 2.jpg, ...
				numbers = []
				#iterate over all files and retrieve file names
				for i,file_name in enumerate(sorted(os.listdir(self.pictureDir))):
					try:
						s = file_name.split(".")
						n = s[0]
						o = int(n)
						numbers.append(o)
					except Exception as e:
						print e
						self.logMessage(e, "takePictures-filenames")
				
				# sort the list descending
				numbers.sort(reverse=True)		
				# the highest file number plus one is the new image index
				index = numbers[0] + 1
			else:
				index = 0
			
			# initialize video device
			os.system("modprobe uvcvideo")
			# capture pictures
			while (myThreadLockNumber == self.threadLockNumberPictures):
				s = "uvccapture -o/root/pictures/{0}.jpg -m -x640 -y480".format(index)
				print "capture picture " + str(index)
				os.system(s)
				index += 1
				time.sleep(interval)
		
		except Exception as e:
				print e
				self.logMessage(e, "takePictures")			
			

	def processCommands(self, smslist):
		for sms in smslist:
			try:
				cmd = sms['Text'].lower()
				print "cmd: " + cmd

				if cmd == 'repstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberReports = 0
					print "thread gestoppt"
				
				elif cmd == 'capstop':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.threadLockNumberPictures = 0
					print "thread gestoppt"
				
				elif cmd == 'gettime':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.getSystemTime()
				
				elif cmd == 'getnetwork':
					self.logMessage("cmd: " + cmd, "processCommands")
					self.getNetworkInfo()
					
				elif cmd == 'restart' or cmd == 'reboot':
					self.logMessage("cmd: " + cmd, "processCommands")
					os.system("reboot")
					
				elif cmd[0:7] == 'settime':
					self.logMessage("cmd: " + cmd, "processCommands")
					datetime = cmd[7:]
					self.setSystemTime(datetime)
				
				elif cmd[0:7] == 'system_':
					self.logMessage("cmd: " + cmd, "processCommands")
					os.system(cmd[7:])
				
				elif cmd[0:8] == 'capstart':	#e.g. capstart30
					self.logMessage("cmd: " + cmd, "processCommands")
					self.initCapturing(cmd[8:])
					
				elif cmd[0:8] == 'repstart':	#e.g. repstart30
					self.logMessage("cmd: " + cmd, "processCommands")
					newThreadLockNumber = random.randint(1,99999)
					self.threadLockNumberReports = newThreadLockNumber
					thread.start_new_thread( self.startReportingGPS, (newThreadLockNumber, cmd[8:]) )
					print "thread gestartet: " + str(newThreadLockNumber)
				
			except Exception as e:
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
				print e
				self.logMessage(e, "listenForCommands")
				print "restarting in 300 sec..."
				time.sleep(300)
				os.system("reboot")
				
			except Exception as e:
				print e
				self.logMessage(e, "listenForCommands")



