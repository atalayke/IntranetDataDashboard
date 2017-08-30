import hourlyData;

function parseHourlyData(data) {
	var hourlyData = {};
	var currDay = parseDate(data[0]);
	data.forEach(function(hour) {
		var hourDate = parseDate(hour);
		if(hourDate === currDay) {
			hourlyData[currDay][hour.hour] = hour.breakdown;
		} else {
			currDay = hourDate;
			hourlyData[currDay] = {};
			hourlyData[currDay][hour.hour] = hour.breakdown;
		}
	})
	console.log(hourlyData);
	hourlyDataTotal = hourlyData;
}

function parseDate(date) {
    var year = date.year,
        month = date.month - 1,
        day = date.day;
    return new Date(year, month, day);
}

parseHourlyData(hourlyDataTotal);