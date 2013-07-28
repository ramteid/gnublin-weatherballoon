#!/usr/bin/python
# this script needs root privileges

from subprocess import Popen, PIPE
from datetime import datetime
import time
import operator

class GpsParser(object):

	def __init__(self):
		# initialize dicts for NMEA recods
		self.GPVTG = {}
		self.GPRMC = {} # provides time, date
		self.GPGSA = {}
		self.GPGGA = {} # provides time
		self.GPGSV = {}
		
		# at first set the system date/time
		gpsData = self.readGpsData(timeout=5)
		self.parseAndSetDateTime(gpsData)

		
	# returns a list of NMEA data lines beginning with $GPVTG,, ...
	def readGpsData(self, timeout = 6):
		try:
			# Read some seconds from the NMEA-GPS-device and store the result into stdout. Should be 6 seconds to get all kinds of records
			(stdout, stderr) = Popen(["timeout", str(timeout), "cat", "/dev/ttyACM0"], stdout=PIPE).communicate()
			# split by lines and put latest line at the top of the list
			lines = stdout.split("\r\n").reverse()
			return lines
		except Exception as e:
			print e
			return []

			
	# returns GPS coordinates as formatted string
	def getGpsCoordinates(self):
		try:
			gpsData = self.readGpsData(timeout=2)
			for line in gpsData:
				if line[0:6] == "$GPRMC":
					fields = line.split(",")
				
					if fields[2] == "V":	# A=ok, V=warning
						return "-"
						
					latitude = float(fields[3][0:2]) + ( float(fields[3][2:]) / 60.0 )
					longitude = float(fields[5][0:2]) + ( float(fields[5][2:]) / 60.0 )
					return str(latitude) + "," + str(longitude)
					
		except Exception as e:
			print "$GPRMC"
			print e
			return "-"
					
			
	# needs result from readGpsData()
	def parseAndSetDateTime(self, gpsData):
		try:
			for line in gpsData:
				if checksum(line):				# set date only if the checksum is correct			
					message = line[0:6]			# message, e.g. $GPRMC
					if message == "$GPRMC":
						fields = line.split(",")
						
						if fields[2] == "V":	# A=ok, V=warning
							return False
							
						# concatenate date
						hour = fields[1][0:2]
						min = fields[1][2:4]
						sec = fields[1][4:6]
						year = fields[9][0:2]
						month = fields[9][2:4]
						day = fields[9][4:6]
						s = 'date -s "{0}-{1}-{2} {3}:{4}:{5}"'.format(year, month, day, hour, min, sec)
						os.system(s)
						return True
						
		except Exception as e:
			print "parseAndSetDateTime"
			print e
		
	
	# needs result of readGpsData()
	def parseGpsData(self, gpsData):
		# fill the NMEA dicts
		# some fields may be gps-receiver specific
		for line in gpsData:
			try:
				message = line[0:6]
			except Exception as e:
				continue
			
			if lmessage == "$GPVTG" and not self.GPVTG:
				try:
					fields = line.split(",")
					self.GPVTG['course'] = fields[1] # measured course in degrees
					self.GPVTG['speed'] = fields[7] # horizontal speed in km/h
					self.GPVTG['mode'] = fields[9] # A=Autonomous, D=Differential, E=Estimated mode
				except Exception as e:
					self.GPVTG = {}
					print "$GPVTG"
					print e
				
			elif message == "$GPRMC" and not self.GPRMC:
				try:
					fields = line.split(",")
					self.GPRMC['status'] = fields[2]		# A=ok, V=warning
					self.GPRMC['latitude'] = float(fields[3][0:2]) + ( float(fields[3][2:]) / 60.0 )
					self.GPRMC['direction_lat'] = fields[4] # N/S
					self.GPRMC['longitude'] = float(fields[5][0:2]) + ( float(fields[5][2:]) / 60.0 )
					self.GPRMC['direction_lon'] = fields[6] # E/W
					self.GPRMC['speed_over_ground'] = float(fields[7])*1.852 # knots->km/h
					self.GPRMC['course_over_ground'] = fields[8] # in terms of geographic north
					self.GPRMC['signal_integrity'] = fields[12] # N=bad, empty=good
				except Exception as e:
					self.GPRMC = {}
					print "$GPRMC"
					print e
				
			elif lmessage == "$GPGSA" and not self.GPGSA:
				try:
					fields = line.split(",")
					self.GPGSA['fix_type'] = fields[2] # 1=no fix, 2=2D-fix (<4 satellites in view), 3=3D-fix (>=4 satellites in view)
				except Exception as e:
					self.GPGSA = {}
					print "$GPGSA"
					print e				
				
			elif message == "$GPGGA" and not self.GPGGA:
				try:
					fields = line.split(",")
					self.GPGGA['gps_quality'] = fields[6] # 0: no fix, 1: gps fix, 2: differential gps fix
					self.GPGGA['satellites_used'] = fields[7]
					self.GPGGA['height_over_msl'] = fields[9] # height over geoid or mean sea level (schwabencenter 261m) (Meter)
					self.GPGGA['geoidal_separation'] = fields[11] # distance between the geoid and ellipsoid (Meter)
				except Exception as e:
					self.GPGGA = {}
					print "$GPGGA"
					print e
				
			elif message == "$GPGSV" and not self.GPGSV:
				try:
					fields = line.split(",")
					self.GPGSV['satellites_in_view'] = fields[3]
				except Exception as e:
					self.GPGSV = {}
					print "$GPGSV"
					print e				
				
			# when all records are processed, leave the loop
			if self.GPVTG and self.GPRMC and self.GPGSA and self.GPGGA and self.GPGSV:
				break
				
		return self.GPVTG, self.GPRMC, self.GPGSA, self.GPGGA, self.GPGSV
	
	
	# expects a NMEA sentence, e.g. $GPRMC,,,....
	def checksum(self, sentence):
		try:
			sentence = sentence.strip('$').strip('\r\n')
			nmeadata,cksum = sentence.split('*', 1)
			calc_cksum = reduce(operator.xor, (ord(s) for s in nmeadata), 0)
			return int(cksum,16) == calc_cksum
		except Exception as e:
			print e
			return False
		
		
		
		
		
		
		
		
		
		
		
