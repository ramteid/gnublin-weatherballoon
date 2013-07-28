from subprocess import Popen, PIPE
from datetime import datetime

# Read 5 seconds from the NMEA-GPS-device and store the result into stdout
(stdout, stderr) = Popen(["timeout", "5", "cat", "/dev/ttyACM0"], stdout=PIPE).communicate()

# split by lines and put latest line at the top
lines = stdout.split("\n").reverse()

# initialize dicts for NMEA recods
GPVTG = {}
GPRMC = {}
GPGSA = {}
GPGGA = {}
GPGSV = {}

# fill these dicts
# some fields may be gps-receiver specific
for line in line:
	if line[0:6] == "$GPVTG":
		fields = line.split(",")
		
	elif line[0:6] == "$GPRMC":
		fields = line.split(",")
		# concatenate date
		hour = fields[1][0:2]
		min = fields[1][2:4]
		sec = fields[1][4:6]
		year = fields[9][0:2]
		month = fields[9][2:4]
		day = fields[9][4:6]
		GPRMC['time'] = datetime.datetime(year, month, day, hour, min, sec)
		GPRMC['status'] = fields[2]		# A=ok, V=warning
		GPRMC['latitude'] = int(fields[3][0:2]) + ( int(fields[3][2:4] + "." + fields[3][5:9]) / 60 )
		GPRMC['direction_lat'] = fields[4] # N/S
		GPRMC['longitude'] = int(fields[5][0:2]) + ( int(fields[5][2:4] + "." + fields[5][5:9]) / 60 )
		GPRMC['direction_lon'] = fields[6] # E/W
		GPRMC['speed_over_ground'] = float(fields[7]) # knot->km/h
		GPRMC['course_over_ground'] = float(fields[8]) # in terms of geographic north
		GPRMC['magnetic_discrepancy'] = float(fields[10])
		GPRMC['sign_of_discrepancy'] = float(fields[11])
		GPRMC['signal_integrity'] = fields[12] # N=bad, empty=good
		GPRMC['checksum'] = fields[13]
		
	elif line[0:6] == "$GPGSA":
		fields = line.split(",")
		
	elif line[0:6] == "$GPGGA":
		fields = line.split(",")
		GPGGA['gps_quality'] = fields[6] # 0: no fix, 1: gps fix, 2: differential gps fix
		GPGGA['active_satellites'] = fields[7]
		GPGGA['height_over_msl'] = fields[9] # height over geoid or mean sea level (schwabencenter 261m)
		GPGGA['unit_height_msl'] = fields[10] # unit of the height over geoid or mean sea level (Meter)
		
	elif line[0:6] == "$GPGSV":
		fields = line.split(",")
		GPGGA['satellites_in_view'] = fields[4]
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
