#include <stdio.h>
#include <stdlib.h>

int main()
{
	if (system(NULL)) {
		while (1) {
			system("gnublin-gpio -p 11 -o 1");
			sleep(2);
			system("gnublin-gpio -p 11 -o 0");
			sleep(10);
		}
	} else {
		exit(EXIT_FAILURE);
	}
	return 0;
}