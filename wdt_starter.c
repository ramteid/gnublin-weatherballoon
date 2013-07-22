#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/watchdog.h>
#include <Python.h>

// Startet den WDT über eine Geraetedatei
// und meldet alle 10 Sekunden ein Lebenszeichen
int main()
{
    // Startet den WDT
    int wdt_file = open("/dev/watchdog", O_WRONLY);

    // Fehlermeldung per SMS und Exit, falls der WDT nicht gestartet werden kann
    if (wdt_file == -1) {
		char *msg = "Watchdog could not be started!";
		PyObject *module, *className, *instance;
		Py_Initialize();
		
		module = PyImport_ImportModule("listener");
		
		if (module)
		{
			className = PyObject_GetAttrString(module, "Listener");
			
			if (className && PyCallable_Check(className))
			{
				instance = PyObject_CallFunction(className, "");
				
				if (instance)
					PyObject_CallMethod(instance, "sendSMS", msg);
				else
					onErrorExitWDT(msg);
			}
			else
				onErrorExitWDT(msg);
		}
		else
			onErrorExitWDT(msg);
		
		Py_Finalize();
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

void onErrorExitWDT(char *msg)
{
	perror(msg);
	Py_Finalize();
	exit(EXIT_FAILURE);
}
