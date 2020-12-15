import React, { Component } from 'react';
import Checkbox from 'mdi-react/CheckboxBlankOutlineIcon';
import CheckboxMarked from 'mdi-react/CheckboxMarkedIcon';

import './Table.css';

class Table extends Component {

	renderTableData() {
		var num = 0;
		return this.props.dates && this.props.dates.map((dateEntry, index) => {
			const { layDate, print } = dateEntry //destructuring
			var printNum;
			var printIcon;
			if(print)
			{
			 	num++;
				printNum = num;
				printIcon = <Checkbox />;
			}
			else
			{
				printIcon = <CheckboxMarked />;
			}

			return (
				<tr key={index} onClick={() => this.props.toggleDate(index)} className={!print ? 'disabled' : '' }>
				<td>{printNum}</td>
				<td>{layDate}</td>
				<td>{printIcon}</td>
				</tr>
			)
		})
	}
	render() {
		return (
			<div>
			<h1 id='title'>Dates to print</h1>
			<table id='dates'>
			<tbody>
			<tr><th></th><th>Lay date</th><th>Ignore printing</th></tr>
			{this.renderTableData()}
			</tbody>
			</table>
			</div>
		);
	}
}

export default Table;
