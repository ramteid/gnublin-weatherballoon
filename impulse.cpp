#DEFINE BOARD GNUBLIN

#include "gnublin.h"

int const GPIO = 11;

int main()
{
    gnublin_gpio gpio;

    gpio.pinMode(GPIO, OUTPUT);

    while (1)
    {
        gpio.digitalWrite(GPIO, HIGH);
        sleep(1);
        gpio.digitalWrite(GPIO, LOW);
        sleep(10);
    }
}
