import React, { Component } from 'react';

import logo from './logo.svg';


import './App.css';
import Table from './Table.js';

import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

import { parseDate, adjustDate, dateFromString } from './dateFunctions.js';

const animals = {
	'quail': {
		'name': 'Quail',
		'label': 'Vaktelägg',
		'perBox': 12,
		'days': 30
	},
	'duck': {
		'name': 'Duck',
		'label': 'Ankägg',
		'perBox': 6,
		'days': 30
	},
	'chicken': {
		'name': 'Chicken',
		'label': 'Hönsägg',
		'perBox': 6,
		'days': 28
	}
}


class App extends Component {
	state = { 
		printButtonOverride: false,
		animal: '',
		dateFrom: parseDate(new Date()),
		dateTo: parseDate(new Date()),
		dates: [
		]
	};

	componentDidMount() {

	};

	renderAnimalSelect() {
		return Object.keys(animals).map((eggtype) => {
			const { name } = animals[eggtype] //destructuring
			return (
				<button onClick={e => this.setState({ animal: eggtype })} disabled={this.isAnimalType(eggtype)}>{name}</button>
			)
		});
	}
	
	isAnimalType(animal) {
		return this.state.animal == animal;
	}

	toggleDate = (index) => {
		var dates = this.state.dates;
		dates[index].print = !dates[index].print;
		this.setState({ dates : this.state.dates });
	}

	sendToPrinter = async e => {
		this.setState({ printButtonOverride: true });
		var labels = [];
		var animal = this.state.animal;
		const numLabels = this.state.dates.length;
		const animalData = animals[animal];
		for(var i = 0; i < numLabels; i++)
		{
			var date = this.state.dates[i];
			if(!date.print)
				continue;
			var label = {};
			var expiryDate = dateFromString(date.layDate);
			expiryDate.setDate(expiryDate.getDate() + animalData.days);
			var expiryDateString = parseDate(expiryDate);
			label.layDate = date.layDate;
			label.expiryDate = expiryDateString;
			label.eggsPerBox = animalData.perBox;
			labels.push(label);
		}
		var data = { 
			'animal': animalData.label,
			'labels': labels
		}
		const response = await fetch('/api/print', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ data }),
		});
		const body = await response.text();

		this.setState({ printButtonOverride: false });

	}

	confirmPrintLabels () {
		var numLabels = this.state.dates.filter((value) => value.print === true).length;
		var confirmString = 'Print ' + numLabels + ' labels of ' + this.state.animal + ' eggs?';
		confirmAlert({
			title: 'Printing labels',
			message: confirmString,
			buttons: [
				{
					label: 'Yes',
					onClick: () => this.sendToPrinter()
				},
				{
					label: 'No',
				}
			]
		});
	}

	generateDates(numPerDay, callback) {
		var dates = [];
		console.log(this.state.dateFrom);
		console.log(this.state.dateTo);
		var fromDate = dateFromString(this.state.dateFrom)
		var toDate = dateFromString(this.state.dateTo)
		console.log(fromDate)
		console.log(toDate)
		while(fromDate <= toDate)
		{
			var layDateString = parseDate(fromDate);
			for(var i = 0; i < numPerDay; i++)
			{
				var date = { 
					'layDate': layDateString,
					'print': true
				};
				dates.push(date);
			}
			fromDate.setDate(fromDate.getDate() + 1); //Go one day ahead
		}
		if(callback == null)
			this.setState({ dates : dates });
		else
			this.setState({ dates : dates }, callback);
		
	};
	generateAndPrint(numPerDay) {
		this.generateDates(numPerDay, this.confirmPrintLabels);
	}

	allowPrintButton() {
		if(this.state.animal === "")
			return false;
		if(this.state.dates.filter((value) => value.print === true).length === 0)
			return false;
		if(this.state.printButtonOverride === true)
			return false;

		return true;
	}
	allowInstantPrintButton() {
		if(this.state.animal === "")
			return false;
		return true;
	}

	render() {
		return (
			<div className="App">
			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			</header>
			<p>{this.state.response}</p>
			<p>
			<strong>Start date:</strong>
			</p>
			<input
			type="date"
			value={this.state.dateFrom}
			onChange={e => this.setState({ dateFrom: e.target.value })}
			/>
			<p>
			<strong>End date:</strong>
			</p>
			<input
			type="date"
			value={this.state.dateTo}
			onChange={e => this.setState({ dateTo: e.target.value })}
			/>
			<p>
			<strong>Animal:</strong>
			</p>
			<p>
			{this.renderAnimalSelect()}
			</p>

			<p>
			<strong>Quick print:</strong>
			</p>
			<p>
			<button onClick={e => this.generateAndPrint(1)} disabled={!this.allowInstantPrintButton()} >1 Every day</button>
			<button onClick={e => this.generateAndPrint(2)} disabled={!this.allowInstantPrintButton()} >2 Every day</button>
			<button onClick={e => this.generateAndPrint(3)} disabled={!this.allowInstantPrintButton()} >3 Every day</button>
			</p>
			
			<hr />

			<p>
			<strong>Generate:</strong>
			</p>
			<p>
			<button onClick={e => this.generateDates(1)}>1 Every day</button>
			<button onClick={e => this.generateDates(2)}>2 Every day</button>
			<button onClick={e => this.generateDates(3)}>3 Every day</button>
			</p>

			<p>{this.state.responseToPost}</p>
			<Table toggleDate={this.toggleDate} dates={this.state.dates} />	
			<p>
			<button onClick={e => this.confirmPrintLabels()} disabled={!this.allowPrintButton()} >Print labels</button>
			</p>
			</div>
		);
	}
}



export default App;
