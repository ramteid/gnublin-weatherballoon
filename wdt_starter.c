#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/watchdog.h>

// Begins the WDT and sends all 10 seconds a sign of life
int main()
{
    // Opens the WDT file
    int wdt_file = open("/dev/watchdog", O_WRONLY);

    // Sends an SMS on error and close the WDT
    if (wdt_file == -1) {
		perror("WDT konnte nicht gestartet werden.");
		exit(EXIT_FAILURE);
    }

    // Sends all 10 seconds a sign of life
    while(1) {
        ioctl(wdt_file, WDIOC_KEEPALIVE, 0);
        sleep(10);
    }

    // Close the WDT
    close(wdt_file);
    return 0;
}
