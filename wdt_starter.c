#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/watchdog.h>

// Startet den WDT über eine Geraetedatei
// und meldet alle 10 Sekunden ein Lebenszeichen
int main()
{
    // Startet den WDT
    int wdt_file = open("/dev/watchdog", O_WRONLY);

    // Fehlermeldung und Exit, falls der WDT nicht gestartet werden kann
    if (wdt_file == -1) {
        perror("Watchdog could not be started!");
        exit(EXIT_FAILURE);
    }

    // Pingt alle 10 Sekunden den WDT an
    while(1) {
        ioctl(wdt_file, WDIOC_KEEPALIVE, 0);
        sleep(10);
    }

    // Schliesst den WDT
    close(wdt_file);
    return 0;
}
