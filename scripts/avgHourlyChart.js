function genHourlyChart(data, metric) {
	hourlyData = d3.entries(data);
	minDate = new Date(2017, 6, 22);    
	maxDate = new Date(2017, 8, 22);
	var title = metric === 'visits' ? 'Unique Visitors' : 'Page Views';
	var firstHourlyData = selectBarDataHourly(barGroup, hourlyData, minDate, maxDate);
	firstHourlyData = d3.entries(firstHourlyData);
	var hourlyBasics = barChartBasics(300);
	var margin = hourlyBasics.margin,
	width = hourlyBasics.width,
	height = hourlyBasics.height + 50,
	colorBar = hourlyBasics.colorBar,
	barPadding = hourlyBasics.barPadding;    
	
	var xScale = d3.scaleLinear()
		.domain([0, firstHourlyData.length])
		.range([0, width])
	;

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(firstHourlyData, function(d) { return Number(d.value[metric]); })])
		.range([height - 50, 0])
	;

	var svg = d3.select("#hourlyChart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id","hourlyBarChartPlot")
	;

	var plot = svg
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	;

	plot.selectAll("rect")
		.data(firstHourlyData)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			return xScale(i);
	})
		.attr("width", width / firstHourlyData.length - barPadding)
		.attr("y", function(d) {
			return yScale(d.value[metric]);
	})
		.attr("height", function(d) {
			return height-yScale(Number(d.value[metric])) - 50;
	})
		.attr("fill", initColor)
	;


	var xLabels = svg
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + 
			(margin.top + height - 50)  + ")")
		;

	xLabels.selectAll("text.xAxis")
		.data(firstHourlyData)
		.enter()
		.append("text")
		.text(function(d) {
			var hr = (Number(d.key) % 12).toString();
			return hr === '0' ? '12' : hr;
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return (i * (width / firstHourlyData.length)) + 
			((width / firstHourlyData.length - barPadding) / 2);
		})
		.attr("y", 15)
		.attr("class", "xAxis")
	;

/*
	Append title
*/
	svg.append("text")
		.attr("x", (width + margin.left + margin.right)/2)
		.attr("y", 15)
		.attr("class","title")
		.attr("text-anchor", "middle")
		.text("Overall Average " + title + " Per Hour")
	;

/*
	Add AM/PM labels
*/
	svg.append("text")
		.attr("x", (width / 4) + margin.left)
		.attr('y', 325)
		.attr("class", "xAxis")
		.text('AM')
	;
	svg.append("text")
		.attr("x", (width - (width / 4) + margin.left))
		.attr('y', 325)
		.attr("class", "xAxis")
		.text('PM')
	;
}

/*
	Handles hourly average barchart update
*/
function updateHourlyBarChart(group, colorChosen, metric) {   	
	var currentHourlyTotals = generateAvgHourlyData(hourlyDataTotal, minDate, maxDate);
	var currentHourlyData = selectBarDataHourly(group, d3.entries(currentHourlyTotals), minDate, maxDate);
	currentHourlyData = d3.entries(currentHourlyData);
	var basics = barChartBasics(300);
	var title = metric === 'visits' ? 'Unique Visitors' : 'Page Views';
	var margin = basics.margin,
	width = basics.width,
	height = basics.height,
	colorBar = basics.colorBar,
	barPadding = basics.barPadding;    
	var xScale = d3.scaleLinear()
		.domain([0, currentHourlyData.length])
		.range([0, width])
	;
	
	var yScale = d3.scaleLinear()
		.domain([0, d3.max(currentHourlyData, function(d) { return Number(d.value[metric]); })])
		.range([height,0])
	;

	var svg = d3.select("#hourlyChart svg");

	var plot = d3.select("#hourlyBarChartPlot")
		.datum(currentHourlyData)
	;

	plot.selectAll("rect")
		.data(currentHourlyData)
		.transition()
		.duration(750)
		.attr("x", function(d, i) {
			return xScale(i);
		})
		.attr("width", width / currentHourlyData.length - barPadding)
		.attr("y", function(d) {
			return yScale(d.value[metric]);
		})
		.attr("height", function(d) {
			return height-yScale(d.value[metric]);
		})
		.attr("fill", colorChosen)
	;
	
	group = (group === 'all') ? 'Overall' : group;
	svg.selectAll("text.title")
		.attr("x", (width + margin.left + margin.right)/2)
		.attr("y", 15)
		.attr("class","title")
		.attr("text-anchor", "middle")
		.text(group + " Average " + title + " Per Hour")
	;
}
