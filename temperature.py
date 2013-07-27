#! /usr/bin/python
import os
import math

class Temperature(object):
	
	A = 3.9083E-3
	B = -5.775E-7
	C = -4.183E-12
	R0 = 1000
	
	def __init__(self):
		self.device = "/dev/lpc313x_adc"
		self.select_gpa()
		self.temperature = 0
	
	def select_gpa(self):
		"""
		Waehlt einen AD-Kanal aus.
		"""
		adc_file = os.open(self.device, os.RDWR)
		os.write(adc_file, "0x0001")
		os.close(adc_file)

	def get_adc(self):
		"""
		Liest den Wert des AD-Wandlers aus
		"""
		adc_file = os.open(self.device, os.O_RDONLY)
		result = os.read(adc_file, 256)
		os.close(adc_file)
		return result[:-1]
	
	def calcR():
		"""
		Berechnet den temperaturabhängigen Widerstand
		"""
		mV = int(self.get_adc(), 16)
		i = int(self.get_adc(), 16)/1000
		resistence = (3.3 - mV)/i
		return resistence
	
	def calculateTemperature():
		self.temperature = ((-A*R0)+(math.sqrt(((A*R0)*(A*R0))-(4*B*R0*(R0-self.calcR())))))/(2*B*R0)
		return self.temperature

	def getAverageOfTemperature(self, amountOfValues):
		"""
		Berechnet die Temperatur aus einem Hexadezimalen String
		"""
		try:
			count = 0
			temp = 0
			while count != amountOfValues:
				temp += self.calculateTemperature()
				count++
			
			return (temp / amountOfValues)
		except Exception as e:
			raise TemperatureException("Can't calculate the temperature")
