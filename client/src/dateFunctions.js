export function parseDate(date)
{
	var year = date.getFullYear();
	var month = (date.getMonth() + 1).toString(10).padStart(2, '0');
	var day = date.getDate().toString(10).padStart(2, '0');
	return year + '-' + month + '-' + day;

}
export function adjustDate(date, days)
{
	console.log(date)
	date.setDate(date.getDate() + days);
	console.log(date)
	return date;
}

export function dateFromString(dateString)
{
	var date = new Date(dateString);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(1);
	date.setMilliseconds(0);
	return date;
}
