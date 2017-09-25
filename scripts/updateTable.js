/*
	Update existing totals/apps tables
*/
function updateTables(barGroup, data, appCols, totCols, metric, totals) {	
	var tableData = generateTableData(data, minDate, maxDate); 
	console.log(tableData);
	tableData = d3.entries(tableData);	
	var title = metric === 'views' ? ' Page Views' : ' Unq. Vis.';
	/*
		Update values in the Applications Table
	*/	
	d3.select('#appTable').remove();
	
	var appTable = d3.select('#dataTable')
		.append('table')
		.attr('class', 'table table-hover table-bordered')
		.attr('id', 'appTable')
	;

	d3.select('#appHead').remove();	
	d3.select('#appBody').remove();

	var appHead = appTable.append('thead')
		.attr('class', 'thead-default')
		.attr('id', 'appHead')
	;

	appHead.append('tr')
			.selectAll('th')
				.data(appHeaders)
				.enter()	
				.append('th')
				.text(function(d) { return d; })
		;

	var appBody = appTable.append('tbody').attr('id', 'appBody');
	var currCol;
	var rows = appBody.selectAll('tr')
				.data(tableData)
				.enter()
				.append('tr')
				.on('click', function(d, i) { 
					console.log(d);
					if(!(d.key === barGroup)) {
						updateBarChart(d.key, color(i), browserType, browserData, currMetric);
				        updateBarChart(d.key, color(i), osType, osData, currMetric);       
				        updateBarChart(d.key, color(i), deviceType, deviceData, currMetric);
				        updateHourlyBarChart(d.key, color(i), currMetric);        
					}
				 })
				.on('mouseover', function(d, i) {
					d3.select(this).style('background-color', tableBackgrounds[i]);
				})
				.on('mouseout', function(d, i) {
					d3.select(this).style('background-color', 'white');
				})
		;
		/*
			Append appropriate values to body of apps table
		*/
		var cells = rows.selectAll('td')
			.data(function(row) {	
				console.log(row);		
				return appHeaders.map(function(col) {
					var val = getValFromCol(data, col, row, metric, totals);
					currCol = col;
					return { column : col, value : val };
				})
			})
			.enter()
			.append('td')
			.text(function(d) { return d.value; })		

	/*
		Update values in the Total table
	*/		
	var totTable = d3.select('#totBody')
		.selectAll('tr')
		.select('td')
		.text(formatAsInteger(totals[metric]))
	;

	/*
		Update Total table title (say this three times fast)
	*/	
	var totHead = d3.select('#totHead')
		.selectAll('tr')
		.select('th')
		.text('Total' + title)
	;	
}

function redrawTable(data, appCols, totCols, metric, totals) { 
	var tableData = generateTableData(data, minDate, maxDate); 
	console.log(tableData);
	tableData = d3.entries(tableData);	
	d3.select('#totHead').selectAll('*').remove();
	d3.select('#totBody').selectAll('*').remove();
	d3.select('#appHead').selectAll('*').remove();
	d3.select('#appBody').selectAll('*').remove();
	genTables(data, appCols, totCols, metric, totals);
}