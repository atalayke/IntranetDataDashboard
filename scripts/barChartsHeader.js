var barGroup = "all", currColor = '#20558a';//currColor = 'rgb(51, 74, 115)';
var browserTotalViews, browserTotalVisits,
	osTotalViews, osTotalVisits,
    deviceTotalViews, deviceTotalVisits;
var formatAsPercentage = d3.format("%"),
	formatAsPercentage1Dec = d3.format(".1%"),
	formatAsInteger = d3.format(",");
var minDate = new Date(2017, 7, 22), maxDate = new Date(2017, 8, 22);
var initColor = currColor;
var browserType = setTypeParams('browser');
var osType = setTypeParams('os');
var deviceType = setTypeParams('device');
/*
    Filter the data given the desired start/end date
*/
function selectBarData(dataset, startDate, endDate, grp) {
    var ds = {};    
    var date;
    var totalViews = 0;
    var totalVisits = 0;
    barGroup = grp;
    for (entry in dataset) {
    	date = new Date(Date.parse(dataset[entry].key));    
    	if(date >= startDate && date <= endDate) {  
    		var appData = d3.entries(dataset[entry].value[barGroup]); 		
    		for(app in appData) {
    			if(ds[appData[app].key] === undefined) {
    				ds[appData[app].key] = {};
    				ds[appData[app].key]['views'] = appData[app].value.views;
    				ds[appData[app].key]['visits'] = appData[app].value.visits;                    
    			} else {
 		   			ds[appData[app].key]['views'] += appData[app].value.views;
 		   			ds[appData[app].key]['visits'] += appData[app].value.visits;
    			}
                totalViews += appData[app].value.views;
                totalVisits += appData[app].value.visits;
    		}
	    }        
   	}    
    return {data : ds, tvw : totalViews, tvs : totalVisits};
}

/*
    Return basic parameters determining shape of the plot
*/
function barChartBasics(hgt) {
    var margin = {top: 30, right: 5, bottom: 20, left: 50},
    width = 500 - margin.left - margin.right,
    height = hgt - margin.top - margin.bottom,
    colorBar = d3.scaleOrdinal(d3.schemeCategory20);
    barPadding = 1
    ;
    return {
        margin : margin,
        width : width,
        height : height,
        colorBar : colorBar,
        barPadding : barPadding
    };
}
/*
    Update bar charts with updated timeframe
*/
function updateVisualsTimeChange(start, end) {
	minDate = new Date(Date.parse(start));
	maxDate = new Date(Date.parse(end));      
    updatePieChart(pieDataAllApps.report.data, currMetric);
    totals = {};
    totals['visits'] = pieData['totalVisits'];
    totals['views'] = pieData['totalViews'];    
    updateTables(barGroup, pieDataAllApps.report.data, ['App', 'Raw', 'Perc'], ['Total Views', 'Total Visits'], currMetric, totals);
	updateBarChart(barGroup, currColor, browserType, browserData, currMetric);
    updateBarChart(barGroup, currColor, osType, osData, currMetric);
    updateHourlyBarChart(barGroup, currColor, currMetric);
}
/*
    Returns an object with parameters relevant to chart type (browser or OS)
*/
function setTypeParams(plotType) {
	if(plotType === 'browser') {
		return { div : '#browserChart', svg : 'browserBarChartPlot', type : 'browser',
                views : browserTotalViews, visits : browserTotalVisits, height : 300};
	} else if(plotType === 'device') {
        return { div : '#deviceChart', svg : 'deviceBarChartPlot', type : 'device',
                views : deviceTotalViews, visits : deviceTotalVisits, height : 300};
    } else {
		return { div : '#osChart', svg : 'osBarChartplot', type : 'os', 
                views : osTotalViews, visits : osTotalVisits, height : 300};
	}
}
/*
    Select metrics for selected group
*/
function selectBarDataHourly(group, dataset, startDate, endDate) {
    var ds = {};    
    var totalViews = 0;
    var totalVisits = 0;    
    for (x in dataset) {
        if(dataset[x].key===group){                    
            for(hour in dataset[x].value.views) {                
                ds[hour] = {};
                ds[hour]['views'] = dataset[x].value.views[hour];
            }
            for(hour in dataset[x].value.visits) {
                ds[hour]['visits'] = dataset[x].value.visits[hour];
            }
        }
    }
    return ds;
}