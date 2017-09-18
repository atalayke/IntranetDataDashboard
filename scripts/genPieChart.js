var colorscheme = [/*'#ffb819',*/ '#5f9baf', '#e57200', '#719500', '#c0143c', '#005f71', '#616265'];
var pieData;
var width = 400,
    height = 400,
    outerRadius = Math.min(width, height) / 4,
    innerRadius = outerRadius * .999,
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius* .45,
    color = d3.scaleOrdinal(colorscheme);
var formatAsPercentage = d3.format("%"),
    formatAsPercentage1Dec = d3.format(".1%"),
    formatAsInteger = d3.format(",")
;
var arc = d3.arc()              
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
;
var arcFinal = d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
var arcFinal3 = d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);
/*
    Computes angle between borders of a given slice
*/
function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
}
/*
    Computes percentage value to append to slice
*/
function getPercTitle(d, metric, total) {
    return d.data.key + ": " + d.data.value[metric] + 
        ' (' + formatAsPercentage1Dec(d.data.value[metric] / total) + ')';
}
/*
    Given an entry in dict containing counts, returns count if it is not
    totalVisits or totalViews count
*/
function filterTotals(d, metric) {
    if( !(d.key === 'totalVisits') && !(d.key === 'totalViews')) {
        return d.value[metric];
    }
}
/*
    Removes 'totalVisits', 'totalViews' elements from dict containing counts
*/
function getPieNoTotals(data) {
    var newData = [];
    data.forEach( function(d) {
            if( !(d.key === 'totalVisits') && !(d.key === 'totalViews')) {
                newData.push(d);
            }
        });
    return newData;
}
/*
    Generates initial pie chart
*/
function genPieChart(data, metric) {       
    var totalSelector = metric === 'views' ? 'totalViews' : 'totalVisits';
    var titleText = metric === 'views' ? 'Page Views' : 'Unique Visitors';
    pieData = d3.entries(data);    
    /*
        Create an SVG bound to the pie chart data
    */    
    var vis = d3.select("#pieChart")
        .append("svg:svg")     
        .data([pieData])       
        .attr("width", '100%')           
        .attr("height", '100%')
        .append("svg:g")                
        .attr("transform", "translate(" + outerRadius * 2 + "," + outerRadius * 2 + ")")
    ;
    /*
        Generate d3.js pie object to handle pie data
    */
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return filterTotals(d, metric); })                
    ;
    /*
        Create pie slices, also variable 'arcs' to allow access later on
    */
    var arcs = vis.selectAll("g.slice")
        .data(pie(pieData))            
        .enter()                       
        .append("svg:g")              
        .attr("class", "slice")         
        .on("click", updateGroup)
    ;

    vis.append('g')
        .attr('class', 'lines')
    ;

    /*
        Append percentages to slices
    */
    arcs.append("svg:path")
        .attr("fill", function(d, i) { return color(i); } ) 
        .attr("d", arc)
        .append("svg:title")
        .text(function(d) { return getPercTitle(d, metric, data[totalSelector]); })
    ;
    /*
        Expand pie chart arcs
    */
    d3.selectAll("g.slice")
        .selectAll("path")
        .transition()
        .duration(750)
        .delay(10)
        .attr("d", arcFinal )
    ;
    /*
        Append application name to arc
    */
    arcs//.filter(function(d) { return d.endAngle - d.startAngle > .2; })
        .append("svg:text")
        .attr("dy", "0.35em")
        .attr('dx', '0.25em')
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .attr("transform", function(d) { 
            var c = arcFinal.centroid(d);
            return "translate(" + c[0] * 2 + ", " + c[1] * 2 + ")";
            })
        .text(function(d) { 
            if(d.data.value[metric] > 0) {
                return d.data.key;
            } else {
                return '';
            }
        })
        .attr('visibility', function(d) {
            if(d.endAngle - d.startAngle > .2) {
                return 'visible';
            } else {
                return 'hidden';
            }
        })
    ;
    /*
        Append raw frequency to arc
    */
    arcs.filter(function(d) { 
            return d.endAngle - d.startAngle > .45; 
        })
        .append("svg:text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("class", "label_total")
        .attr("transform", function(d) { 
            return "translate(" + arcFinal.centroid(d) + ")";
            })
        .text(function(d) { return formatAsInteger(d.data.value[metric]); })
    ;
    /*
        Append percentage to arc
    */
    arcs.filter(function(d) { 
            return d.endAngle - d.startAngle > .45; 
        })
        .append("svg:text")
        .attr("dy", "1.35em")
        .attr("text-anchor", "middle")
        .attr("class", "label_perc")
        .attr("transform", function(d) { 
            return "translate(" + arcFinal.centroid(d) + ")";
            })
        .text(function(d) { 
            return formatAsPercentage1Dec(d.data.value[metric] / data[totalSelector]) 
            })
    ;
    /*
        Append title to pie chart
    */   
    vis.append("svg:text")
        .attr("dy", "-12.5em")        
        .attr("text-anchor", "middle")
        .text("Total " + titleText + " by App")        
        .attr("class","title")        
    ;
    /*
        Append total beneath title
    */
    vis.append("svg:text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text('Total: ' + formatAsInteger(data[totalSelector]))        
        .attr("class","title_total")
        .on("click", function() {
            if(!(barGroup === 'all')) {
                updateHourlyBarChart('all', initColor, metric);
                updateBarChart('all', initColor, browserType, browserData, currMetric);
                updateBarChart('all', initColor, osType, osData, currMetric);                      
                updateBarChart('all', initColor, deviceType, deviceData, currMetric);
            }            
        })
    ;

    /*
        Append polylines connecting arcs to labels
    */
    var polyline = vis.select('.lines')
        .selectAll('polyline')
        .data(pie(getPieNoTotals(pieData)))
        .enter()
        .append('polyline')    
        .attr('points', function(d) {
            if((d.data.value[metric] > 0) && ((d.endAngle - d.startAngle) > 0.2)) { 
                return [arc.centroid(d), arcFinal.centroid(d)];               
            } else {
                return [arc.centroid(d), arc.centroid(d)];
            }            
        })
        .attr('transform', 'scale(1.32)')
    ;
}
/*
    Handles slice click events, specifically, updates bar charts to reflect selected application
*/
function updateGroup(d, i) {           
    if(!(d.data.key === barGroup)) {
        updateBarChart(d.data.key, color(i), browserType, browserData, currMetric);
        updateBarChart(d.data.key, color(i), osType, osData, currMetric);       
        updateBarChart(d.data.key, color(i), deviceType, deviceData, currMetric);
        updateHourlyBarChart(d.data.key, color(i), currMetric);        
    } else {
        console.log('did not update');
    }
}
/*
    Selects appropriate data elements given the current timeframe
*/
function selectPieData(dataset, startDate, endDate) { 
    var totalViews = 0;
    var totalVisits = 0;
    var viewsVisits = {}
    apps.forEach(function(entry) {
        viewsVisits[entry] = {};
        viewsVisits[entry]['views'] = {};
        viewsVisits[entry]['visits'] = {};
        viewsVisits[entry]['views'] = 0;
        viewsVisits[entry]['visits'] = 0;
    });    
    dataset.forEach(function(day) {    
        var date = new Date(day.year, day.month - 1, day.day);
        if(date >= startDate && date <= endDate) {
            day.breakdown.forEach(function(app) {            
                name = parseAppName(app.name);
                if(name !== '') {
                    viewsVisits[name]['views'] += Number(app.counts[0]);
                    viewsVisits[name]['visits'] += Number(app.counts[1]);
                    totalViews += Number(app.counts[0]);
                    totalVisits += Number(app.counts[1]);
                }
                /*
                viewsVisits[name]['views'] += Number(app.counts[0]);
                viewsVisits[name]['visits'] += Number(app.counts[1]);
                totalViews += Number(app.counts[0]);
                totalVisits += Number(app.counts[1]);
                */
            });                           
        }
    });    
    viewsVisits['totalViews'] = totalViews;
    viewsVisits['totalVisits'] = totalVisits;
    return viewsVisits;
}