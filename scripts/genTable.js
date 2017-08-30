var tableBackgrounds = [/*'#fff1d1',*/ '#dfebef', '#fae3cc', '#e1e8cc', '#f2d0d8', '#ccdfe3', '#d2dde8'];
function genTables(data, appCols, totCols, metric, totals) {
	console.log(JSON.stringify(data));
	function genTotalsTable(cols, metric, totals) {		
		var title = metric === 'visits' ? ' Unique Visitors' : ' Page Views';
		var totTable = d3.select('#dataTable')
			.append('table')
			.attr('class', 'table table-hover table-bordered')
			.attr('id', 'totTable')
		;	
		var totHead = totTable.append('thead')
			.attr('class', 'thead-default')
			.attr('id', 'totHead')
		;
		var totBody = totTable.append('tbody').attr('id', 'totBody'); 

		totHead.append('tr')
			.append('th')
			.text('Total ' + title)
		;

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
				.text(totals[metric])
		;
	}

	function genAppTable(data, cols, metric, totals) {
		var appData = d3.entries(data);
		var appTable = d3.select('#dataTable')
			.append('table')
			.attr('class', 'table table-hover table-bordered')
			.attr('id', 'appTable')
		;			
		var appHead = appTable.append('thead')
			.attr('class', 'thead-default');
		var appBody = appTable.append('tbody').attr('id', 'appBody');
		var currCol;

		appHead.append('tr')
			.selectAll('th')
				.data(cols)
				.enter()
				.append('th')
				.text(function(d) { return d; })
		;

		var rows = appBody.selectAll('tr')
				.data(appData)
				.enter()
				.append('tr')
				.on('click', function(d, i) { 
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

		var cells = rows.selectAll('td')
			.data(function(row) {			
				return cols.map(function(col) {
					var val = getValFromCol(data, col, row, metric, totals);
					console.log(val);
					currCol = col;
					return { column : col, value : val };
				})
			})
			.enter()
			.append('td')
			.text(function(d) { console.log(d); return d.value; })		
	}	
	genTotalsTable(totCols, metric, totals);
	genAppTable(data, appCols, metric, totals);
}

function getValFromCol(data, col, row, metric, totals) {	
	console.log(JSON.stringify(row));
	if(col === 'App') {
		console.log(row);
		return row.key;
	} else if(col === 'Perc') {
		return formatAsPercentage1Dec(row.value[metric] / totals[metric]);
	} else {
		return row.value[metric];
	}
}