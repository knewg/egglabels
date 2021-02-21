#!/bin/bash
sleep 10 && cupsd &
if [ -f firstStart ]; then
	echo "First run"
	rm firstStart
	echo "Waiting for cups startup"
	sleep 15
	echo "Adding printer"
	lpadmin -p Brother_QL-560 -E -v usb://Brother/QL-560?serial=J9G695651 -P printerConfig/Brother_QL-560.ppd
	lpoptions -d Brother_QL-560
	echo "Added printer and set it as default"
	echo "Printing pdf test print to server/test.pdf"
	cd server
	xvfb-run glabels-batch-qt --define eggtype="Vaktelägg" label.glabels -o test.pdf
	cd ..

fi
yarn dev:server

