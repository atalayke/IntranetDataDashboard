import json
from datetime import date

def parse_date(date):
	dt = date.split(',')
	year = dt[1]
	month = dt[0][:-2]
	day = dt[0][-2:]
	return str(year) + '/' + str(month) + '/' + str(day)

def parse_hourly_data():
	final_data = {}
	with open('hourlyDataAllApps.json', 'r') as read_data:
		data = json.load(read_data)
		print(data['report']['data'][0]['name'])
		#curr_date = parse_date(data['report']['data'][0])
		curr_date = parse_date(data['report']['data'][0]['name'])
		final_data[curr_date] = {}
		print(curr_date)
		for day in data['report']['data']:
			date = parse_date(day)
			print(date)
			if(date == curr_date):
				print('match')			
				#print(day['breakdown'])				
				final_data[curr_date][day['hour']] = day['breakdown']
			else:
				curr_date = date;
				final_data[curr_date] = {};
				final_data[curr_date][day['hour']] = day['breakdown']			
	with open('hourlyDataPyAllApps.json', 'w') as write_data:
		write_data.write('var hourlyDataAllApps = ')
		json.dump(final_data, write_data)
		write_data.write(';')

parse_hourly_data()