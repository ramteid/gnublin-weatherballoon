#include <stdio.h>
#include <stdlib.h>

// Set the GPIO 11 all 10 seconds to HIGH
int main()
{
	if (system(NULL)) {
		while (1) {
			system("gnublin-gpio -p 11 -o 1");
			sleep(1);
			system("gnublin-gpio -p 11 -o 0");
			sleep(10);
		}
	} else {
		exit(EXIT_FAILURE);
	}
	return 0;
}