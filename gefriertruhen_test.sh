#! /bin/sh

rm -f benchmark.txt

while true
do
	echo date >> benchmark.txt
	gnublin-lm75 >> benchmark.txt
	echo "\n\n" >> benchmark.txt
	sleep 150
done
exit 0
