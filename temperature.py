import os
from math import sqrt
from subprocess import Popen, PIPE

class Temperature(object):

	def calculateTemperature(self):
		(stdout, stderr) = Popen(["gnublin-adcint", "-b", "1"], stdout=PIPE).communicate()
		V = float(stdout) / 1000
		R = (3.3 - V) / (V / 1000)
		return (sqrt(15.274808890000001 + (0.00231 * (1000 - R))) - 3.9083) / -0.001155 - 1.5
