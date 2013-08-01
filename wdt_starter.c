#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/watchdog.h>
#include <Python.h>

// Exit the program if an error occur
void onErrorExitWDT(char *msg)
{
	perror(msg);
	Py_Finalize();
	exit(EXIT_FAILURE);
}

// Begins the WDT and sends all 10 seconds a sign of life
int main()
{
    // Opens the WDT file
    int wdt_file = open("/dev/watchdog", O_WRONLY);

    // Sends an SMS on error and close the WDT
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

    // Sends all 10 seconds a sign of life
    while(1) {
        ioctl(wdt_file, WDIOC_KEEPALIVE, 0);
        sleep(10);
    }

    // Close the WDT
    close(wdt_file);
    return 0;
}
