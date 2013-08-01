#include <stdio.h>
#include <stdlib.h>
#include <math.h>

const int MAX_BUFFER = 255;

/*
Calculates the resistence dependent on temperature
I = V/R
R = V/I
*/
float calculateResistence()
{
    FILE *fp;
    fp = popen("gnublin-adcint -b 1", "r");
    if (!fp)
    {
        return -1;
    }
	float V;
	char buffer[MAX_BUFFER];
	fgets(buffer, MAX_BUFFER, fp);
	pclose(fp);
	V = atoi(buffer) / 1000.0;
	return (3.3 - V) / (V / 1000.0);
}

/*
Calculate the temperature with the help of
platinum temperature coefficients
DIN EN 60751 / IEC 60751
A = 3.9083E-3
B = -5.775E-7
R0 = 1000 resistence at 0 celsius
temperature = ((-A*R0)+(sqrt(((A*R0)*(A*R0))-(4*B*R0*(R0-R)))))/(2*B*R0)
*/
float calculateTemperature()
{
	float R = calculateResistence();
	return (sqrt(15.274808890000001 + (0.00231 * (1000 - R))) - 3.9083) / -0.001155 - 1.5;
}
