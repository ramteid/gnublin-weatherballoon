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
	# DIN EN 60751 / IEC 60751
	def calculateTemperature(self):
		R = self.calculateResistence()
		return (sqrt(15.274808890000001 + (0.00231*(1000-R))) - 3.9083) / -0.001155
	
	# Returns the average temperature of a given amount of temperatures
	def getAverageOfTemperatures(self, amountOfTemperatures):
		count, temp = 0, 0
		while count != amountOfTemperatures:
			temp += self.calculateTemperature()
			count += 1
		return temp / amountOfValues
