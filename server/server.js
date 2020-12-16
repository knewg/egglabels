const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { EOL } = require('os');

const app = express();
const port = process.env.PORT || 5000;

const { execSync } = require("child_process");
const fs = require("fs");
const csvFile = 'dates.csv';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.post('/api/print', (req, res) => {
	console.log(req.body.data.labels);
	var data = req.body.data;
	var animal = data.animal;
	var labels = data.labels;
	var numLabels = data.labels.length;
	const response = 'Printing ' + numLabels + ' labels of ' + animal + ' eggs';

	var csvString = labels.map((label) => {
                        const { layDate, expiryDate, eggsPerBox } = label //destructuring
		return layDate + ';' + expiryDate + ';' + eggsPerBox;
	}).join(EOL);
	console.log(csvString);

	fs.writeFileSync(csvFile, csvString);
	//var command = 'xvfb-run glabels-batch-qt --define eggtype="' + animal + '" label.glabels -o test.pdf';
	var command = 'xvfb-run glabels-batch-qt --define eggtype="' + animal + '" label.glabels';
	console.log("Running command: " + command);
	execSync(command);
	console.log(response);
	res.send(response);
});

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, '../client/build')));

	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
	});
}

app.listen(port, () => console.log(`Listening on port ${port}`));
