import json

def parseHourlyData(data) {
	with open('hourlyData.json') as hourly_data:
		data = json.load(hourly_data)
		print(data)
	# 	for hour in data:
	# 		print(hour)
	# 		hourDate = parseDate(hour);
	# 		if(hourDate === currDay) {
	# 			hourlyData[currDay][hour.hour] = hour.breakdown;
	# 		} else {
	# 			currDay = hourDate;
	# 			hourlyData[currDay] = {};
	# 			hourlyData[currDay][hour.hour] = hour.breakdown;
	# 		}		
	# 	console.log(hourlyData);
	# return hourlyData;
}

def parseDate(date) {
    year = date.year
    month = date.month - 1
    day = date.day    
}

