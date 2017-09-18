/*
	Update existing totals/apps tables
*/
function updateTables(barGroup, data, appCols, totCols, metric, totals) {
	var tableData = generateTableData(data, minDate, maxDate); 
	tableData = d3.entries(tableData);	
	var title = metric === 'views' ? ' Page Views' : ' Unq. Vis.';
	/*
		Update values in the Applications Table
	*/
	var appTable = d3.select('#appBody')
		.selectAll('tr')
		.data(tableData)
		.selectAll('td')
		.data(function(row) {			
				return appHeaders.map(function(col) {
					console.log(col);
					var val = getValFromCol(data, col, row, metric, totals);
					currCol = col;
					return { column : col, value : val };
				})
			})
			.text(function(d) { console.log(d); return d.value; })
	;		
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