#!/bin/bash
# this script watches the other scripts whether they crashed. It should have root privileges.

fnCheckIfRunning()
{
	# check if running
	if ( ps ax | grep "$1" )
	then
		#echo "$1 is running..."
		true
	else
		echo "$1 NOT running! Restarting..."
		$2 &
		echo "$1 restarted"
	fi
}

# Check if this script is already running
# the first letter of the grep search pattern is surrounded with brackets
# to avoid appearing the grep process in the ps list
if [[ $(ps x | grep "[s]cript_watcher.sh" | wc -l) -gt 2 ]]
then
	echo watch-script is alreay running. exiting...
	exit 0
fi

# Checks all 5 minutes if the Scripts are still running.
# the first letter of the grep search pattern is surrounded with brackets
# to avoid appearing the grep process in the ps list
while [ true ]
do
	sleep 300
	
	# p1 = search pattern, p2 = command to run script
	fnCheckIfRunning "[l]istener_start.py" "python /root/listener.py"
	
done

exit 0 
