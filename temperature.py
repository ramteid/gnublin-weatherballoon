#! /usr/bin/python
import os
import time
from listener import Listener

class Temperature(object):
	
	def __init__(self):
		self.listener = Listener()
		self.device = "/dev/lpc313x_adc"
		self.interval = 10
		
	def setInterval(self, interval):
		"""
		Setzt das Zeitintervall
		@param interval: Zeitintervall
		"""
		self.interval = interval
	
	def select_gap(self, channel):
		"""
		Waehlt einen AD-Kanal aus.
		@param channel: AD-Kanal Gueltige Werte von 0 - 3
		"""
		try:
			adc_file = os.open(self.device, os.RDWR)
			if channel == 0:
				os.write(adc_file, "0x0000")
			elif channel == 1:
				os.write(adc_file, "0x0001")
			elif channel == 2:
				os.write(adc_file, "0x0002")
			elif channel == 2:
				os.write(adc_file, "0x0003")
			else:
				raise Exception("Invalid adc channel")
			os.close(adc_file)
		except Exception as detail:
			self.listener.sendSMS(detail)
	
	def get_adc(self):
		"""
		Liest den Wert des AD-Wandlers aus
		"""
		try:
			adc_file = os.open(self.device, os.O_RDONLY)
			av = os.read(adc_file, 256)
			os.close(adc_file)
			return av[:-1]
		except Exception as detail:
			self.listener.sendSMS(detail)
	
	def sendTemperatureAsSMS(self):
		"""
		Verschickt die Temperatur per SMS
		"""
		self.select_gpa(1)
		temperature = calculateTemperature(get_adc())
		self.listener.sendSMS(temperature)

	def calculateTemperature(self):
		"""
		Berechnet die Temperatur aus einem Hexadezimalen String
		@return: Formatierter Temperatur-String
		"""
		return int(self.get_adc(), 16)
		
	def processCommands(self, smslist):
		"""
		Verarbeitet SMS-Kommandos
		"""
		for sms in smslist:
			try:
				cmd = sms['Text'].lower()
				
				if cmd[0:7] == "sInterv":
					self.setInterval(cmd[7:])
				elif cmd == "sendTemp":
					self.sendTemperatureAsSMS()
					
		
	def listenForCommands(self):
		"""
		Lauscht auf Kommandos
		"""
		while 1:
			try:
				time.sleep(self.interval)
				smsList = self.listener.getAllSMS()
				if len(smsList) > 0:
					self.processCommands(smsList)
					self.listener.deleteReadSMS(smsList)
			except:
				self.listener.sendSMS("Can't execute the command")

if __name__ == "__main__":
	try:
		log_file = open("temperature.log", "w")
		temp = Temperature()
		listener = Listener()
		temp.listenForCommands()
		while 1:
			time.sleep(temp.interval)
			log_file.write(temp.calculateTemperature())
		log_file.close()
	except:
		listener.sendSMS("Can't log the temperature")
