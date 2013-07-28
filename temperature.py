#! /usr/bin/python
import os
from math import sqrt

class Temperature(object):

	# Platinum temperature coefficients
	# DIN EN 60751 / IEC 60751
	A = 3.9083E-3
	B = -5.775E-7
	C = -4.183E-12
	R0 = 1000
	
	# Initialize the device and select the AD channel
	def __init__(self):
		self.device = "/dev/lpc313x_adc"
		self.select_gpa()
	
	# Selects the AD channel
	def select_gpa(self):
		adc_file = os.open(self.device, os.RDWR)
		os.write(adc_file, "0x0001")
		os.close(adc_file)

	# Selects the value of the AD converter
	def get_adc(self):
		adc_file = os.open(self.device, os.O_RDONLY)
		result = os.read(adc_file, 256)
		os.close(adc_file)
		return result[:-1]
	
	# Calculates the resistence dependent on temperature
	# I = U/R
	# R = U/I
	def calcR(self):
		mV = int(self.get_adc(), 16)
		return (3.3 - mV)/(mV/1000.0)
	
	# Calculates the temperature with the help of
	# the platinum temperature coefficients
	def calculateTemperature(self):
		a = self.B * self.R0
		b = self.A * self.R0
		c = self.R0 - self.calcR()
		return (-b+(sqrt(b**2)-(4.0*a*c)))/(2.0*a)

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
