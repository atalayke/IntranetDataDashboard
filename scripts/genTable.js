/*
	Initially generates Total and Apps tables
*/
function genTables(data, appCols, totCols, metric, totals) {
	/*
		Generate totals table
	*/	
	function genTotalsTable(cols, metric, totals) {		
		/*
			Select appropriate metric
		*/
		var title = metric === 'visits' ? ' Unq. Vis.' : ' Page Views';
		/*
			Append table element to appropriate div
		*/
		var totTable = d3.select('#dataTableTotal')		
			.append('table')
			.attr('class', 'table table-hover table-bordered')
			.attr('id', 'totTable')
		;	
		/*
			Append head element to totals table
		*/
		var totHead = totTable.append('thead')
			.attr('class', 'thead-default')
			.attr('id', 'totHead')
		;
		/*
			Append body element to totals table
		*/
		var totBody = totTable.append('tbody').attr('id', 'totBody'); 
		/*
			Append header with title
		*/
		totHead.append('tr')
			.append('th')
			.text('Total ' + title)
		;
		/*
			Append single row with title, on click, handle bar charts
			to reflect metrics for all applications
		*/
		totBody.append('tr')
			.on('click', function() {
					if(!(barGroup === 'all')) {
                		updateHourlyBarChart('all', initColor, metric);
		                updateBarChart('all', initColor, browserType, browserData, currMetric);
	    	            updateBarChart('all', initColor, osType, osData, currMetric);                      
	        	        updateBarChart('all', initColor, deviceType, deviceData, currMetric);
        	    	}
				})
			.on('mouseover', function() {
				d3.select(this).style('background-color', '#d2dde8');
			})
			.on('mouseout', function() {
				d3.select(this).style('background-color', 'white');
			})
			.append('td')
				.text(formatAsInteger(totals[metric]))
		;
	}
	/*
		Initially generate applications counts table
	*/	
	function genAppTable(data, cols, metric, totals) {
		var appData = d3.entries(data);
		/*
			Append table element to appropriate div
		*/
		var appTable = d3.select('#dataTable')
			.append('table')
			.attr('class', 'table table-hover table-bordered')
			.attr('id', 'appTable')
		;			
		/*
			Append head element to apps table
		*/
		var appHead = appTable.append('thead')
			.attr('class', 'thead-default')
			.attr('id', 'appHead')
		;			

		/*
			Append body to apps table
		*/
		var appBody = appTable.append('tbody').attr('id', 'appBody');
		var currCol;
		/*
			Append elements from cols array to header of apps table
		*/
		appHead.append('tr')
			.selectAll('th')
				.data(cols)
				.enter()
				.append('th')
				.text(function(d) { return d; })
		;
		/*
			Append rows to body of apps table, on click, update bar charts to
			reflect metrics of selected application
		*/
		var rows = appBody.selectAll('tr')
				.data(appData)
				.enter()
				.append('tr')
				.on('click', function(d, i) { 
					if(!(d.key === barGroup)) {
						updateBarChart(d.key, pieColor(i), browserType, browserData, currMetric);
				        updateBarChart(d.key, pieColor(i), osType, osData, currMetric);       
				        updateBarChart(d.key, pieColor(i), deviceType, deviceData, currMetric);
				        updateHourlyBarChart(d.key, pieColor(i), currMetric);        
					}
				 })
				.on('mouseover', function(d, i) {
					d3.select(this).style('background-color', tableColor(i));
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
				return cols.map(function(col) {
					var val = getValFromCol(data, col, row, metric, totals);
					currCol = col;
					return { column : col, value : val };
				})
			})
			.enter()
			.append('td')
			.text(function(d) { return d.value; })		
	}	
	genTotalsTable(totCols, metric, totals);
	genAppTable(data, appCols, metric, totals);
}
/*
	Return cell value given row/col/metric
*/
function getValFromCol(data, col, row, metric, totals) {	
	if(col === 'App') {
		return row.key;
	} else if(col === '%') {
		return formatAsPercentage1Dec(row.value[metric] / totals[metric]);
	} else {
		return formatAsInteger(row.value[metric]);
	}
}