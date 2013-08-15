#!/usr/bin/python
# this script needs root privileges

from subprocess import Popen, PIPE
from datetime import datetime
import time
import os
import operator

class GpsParser(object):

	def __init__(self):
		# initialize dict for NMEA recods
		self.gps_info = {}

		
	# returns a list of NMEA data lines beginning with $GPVTG,, ...
	def readGpsData(self, timeout = 6):
		try:
			# Read for some seconds from the NMEA-GPS-device and store the result into stdout. Should be 6 seconds to get all kinds of records
			(stdout, stderr) = Popen(["timeout", str(timeout), "cat", "/dev/ttyACM0"], stdout=PIPE).communicate()
			# split by lines and put latest line at the top of the list
			lines = stdout.split("\n\n")
			lines.reverse()
			return lines
		except Exception as e:
			print "readGpsData-gpsParser"
			print e
			raise

			
	# returns GPS coordinates as formatted string
	def getGpsCoordinatesParser(self, lines):
		try:
			for line in lines:
				if line[0:6] == "$GPGGA":
					fields = line.split(",")
				
					if fields[2] == "V":	# A=ok, V=warning
						raise Exception("coordinates invalid")
						
					latitude = float(fields[2][0:2]) + ( float(fields[2][2:]) / 60.0 )
					longitude = float(fields[4][1:3]) + ( float(fields[4][3:]) / 60.0 ) # field for longitude has one more heading zero
					height_over_msl = fields[9] # height over geoid or mean sea level (Meter)
					geoidal_separation = fields[11] # distance between the geoid and ellipsoid (Meter)
					height = height_over_msl
					
					coords = str(latitude) + "," + str(longitude)
					return coords, height
					
		except Exception as e:
			#print "getGpsCoordinatesParser"
			#print e
			raise # must be catched in the calling function !!!

		
	# needs result from readGpsData()
	def parseAndSetDateTime(self, lines):
		try:
			for line in lines:
				if self.checksum(line):			# set date only if the checksum is correct			
					message = line[0:6]			# message, e.g. $GPRMC
					if message == "$GPRMC":
						fields = line.split(",")
						
						if fields[2] == "V":	# A=ok, V=warning
							return False
							
						# concatenate date
						hour = fields[1][0:2]
						min = fields[1][2:4]
						sec = fields[1][4:6]
						day = fields[9][0:2]
						month = fields[9][2:4]
						year = fields[9][4:6]
						s = 'date -s "{0}-{1}-{2} {3}:{4}:{5}"'.format(year, month, day, hour, min, sec)
						print "setting date: " + s
						os.system(s)
						return True
				else:
					raise Exception("checksum did not match")
				
		except Exception as e:
			#print "parseAndSetDateTime"
			#print e
			raise # must be catched in the calling function !!!
		
	
	# needs result of readGpsData()
	def parseGpsData(self, lines):
		# fill the NMEA dicts
		GPVTG = {}
		GPRMC = {}
		GPGSA = {}
		GPGGA = {}
		GPGSV = {}
		
		if not lines:
			print "parseGpsData - lines are empty"
			return {}
		
		# some fields may be gps-receiver specific
		for line in lines:
			try:
				message = line[0:6]
			except Exception as e:
				continue
			
			if message == "$GPVTG" and not GPVTG:
				try:
					fields = line.split(",")
					GPVTG['course'] = fields[1] # measured course in degrees
					GPVTG['speed'] = fields[7] # horizontal speed in km/h
					GPVTG['mode'] = fields[9][0] # A=Autonomous, D=Differential, E=Estimated mode
				except Exception as e:
					GPVTG = {}
					#print "$GPVTG"
					#print e
				
			elif message == "$GPRMC" and not GPRMC:	# GPRMC provides time and date
				try:
					fields = line.split(",")
					GPRMC['status'] = fields[2]		# A=data valid, V=warning
					if GPRMC['status'] == 'V':
						continue;
					GPRMC['latitude'] = float(fields[3][0:2]) + ( float(fields[3][2:]) / 60.0 )
					GPRMC['direction_lat'] = fields[4] # N/S
					GPRMC['longitude'] = float(fields[5][1:3]) + ( float(fields[5][3:]) / 60.0 ) # field for longitude has one more heading zero
					GPRMC['direction_lon'] = fields[6] # E/W
					GPRMC['speed_over_ground'] = float(fields[7])*1.852 # knots->km/h
					GPRMC['course_over_ground'] = fields[8] # in terms of geographic north
				except Exception as e:
					GPRMC = {}
					#print "$GPRMC"
					#print e
				
			elif message == "$GPGSA" and not GPGSA:
				try:
					fields = line.split(",")
					GPGSA['fix_type'] = fields[2] # 1=no fix, 2=2D-fix (<4 satellites in view), 3=3D-fix (>=4 satellites in view)
				except Exception as e:
					GPGSA = {}
					#print "$GPGSA"
					#print e				
				
			elif message == "$GPGGA" and not GPGGA:
				try:
					fields = line.split(",")
					GPGGA['latitude'] = float(fields[2][0:2]) + ( float(fields[2][2:]) / 60.0 )
					GPGGA['direction_lat'] = fields[3] # N/S
					GPGGA['longitude'] = float(fields[4][1:3]) + ( float(fields[4][3:]) / 60.0 ) # field for longitude has one more heading zero
					GPGGA['direction_lon'] = fields[5] # E/W
					GPGGA['gps_quality'] = fields[6] # 0: no fix, 1: gps fix, 2: differential gps fix
					GPGGA['satellites_used'] = fields[7]
					GPGGA['height_over_msl'] = fields[9] # height over geoid or mean sea level (Meter)
					GPGGA['geoidal_separation'] = fields[11] # distance between the geoid and ellipsoid (Meter)
				except Exception as e:
					GPGGA = {}
					#print "$GPGGA"
					#print e
				
			elif message == "$GPGSV" and not GPGSV:
				try:
					fields = line.split(",")
					GPGSV['satellites_in_view'] = fields[3]
				except Exception as e:
					GPGSV = {}
					#print "$GPGSV"
					#print e				
				
			# when all records are processed, leave the loop
			if GPVTG and GPRMC and GPGSA and GPGGA and GPGSV:
				break
				
		# merge all dictionaries together
		gps_info = {}
		gps_info = dict(gps_info, **GPVTG)
		gps_info = dict(gps_info, **GPRMC)
		gps_info = dict(gps_info, **GPGSA)
		gps_info = dict(gps_info, **GPGGA)
		gps_info = dict(gps_info, **GPGSV)
		self.gps_info = gps_info
		
		return gps_info
	
	
	# expects a NMEA sentence, e.g. $GPRMC,,,....
	def checksum(self, sentence):
		try:
			sentence = sentence.strip('$').strip('\n\n')
			nmeadata,cksum = sentence.split('*', 1)
			calc_cksum = reduce(operator.xor, (ord(s) for s in nmeadata), 0)
			return int(cksum,16) == calc_cksum
		except Exception as e:
			#print "Exception in checksum"
			#print e
			return False
		
		
		
		
		
		
		
		
		
		
