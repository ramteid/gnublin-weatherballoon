#! /usr/bin/python
import os
from math import sqrt
from subprocess import Popen, PIPE

class Temperature(object):
	
	# Calculates the resistence dependent on temperature
	# I = V/R
	# R = V/I
	def calculateResistence(self):
		# Execute command and write the result to stdout
		(stdout, stderr) = Popen(["gnublin-adcint","-b","1"], stdout=PIPE).communicate()
		V = float(stdout) / 1000
		return (3.3 - V) / (V / 1000)
	
	# Calculates the temperature with the help of
	# the platinum temperature coefficients.
	# Platinum temperature coefficients
	# DIN EN 60751 / IEC 60751
	def calculateTemperature(self):
		A = 3.9083E-3
		B = -5.775E-7
		C = -4.183E-12
		R0 = 1000          # resistence at 0 Celsius
		R = self.calculateResistence()
		return ((-A*R0)+(sqrt(((A*R0)*(A*R0))-(4*B*R0*(R0-R)))))/(2*B*R0)
	
	# Returns the average temperature of a given amount of temperatures
	def getAverageOfTemperature(self, amountOfValues):
		try:
			count = 0
			temp = 0
			while count != amountOfValues:
				temp += self.calculateTemperature()
				count += 1
			return (temp / amountOfValues)
		except Exception as e:
			raise Exception("Can't calculate the temperature")
