/*
    Update an existing bar chart
*/
function updateBarChart(grp, colorChosen, type, data, metric) {
    currColor = colorChosen;    
    var tempData = d3.entries(data);
    var currentData = selectBarData(tempData, minDate, maxDate, grp);
    var currTotalViews = currentData.tvw;
    var currTotalVisits = currentData.tvs;
    var total = metric === 'views' ? currentData.tvw : currentData.tvs;
    currentData = currentData.data;
    currentData = d3.entries(currentData);
    var plotBasics = barChartBasics(type.height);
    var plotTitle = metric === 'views' ? ' Page Views By ' : ' Unique Visitors By ';
    var margin = plotBasics.margin,
        width = plotBasics.width,
        height = plotBasics.height,
        colorBar = plotBasics.colorBar,
        barPadding = plotBasics.barPadding
    ;
    /*
        Update the x and y scales given the number of elements and the 
        range of values
    */
    var xScale = d3.scaleLinear()
        .domain([0, currentData.length])
        .range([0, width])
    ;
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(currentData,
            function(d) {
                return Number(d.value.views);
            })])
        .range([height,0])
    ;
    /*
        Select the appropriate svg elements and bind it to the updated
        data
    */
    var svg = d3.select(type.div + " svg");   
    var plot = d3.select("#" + type.svg)
        .datum(currentData)
    ;
    /*
        Update bar size on barchart
    */    
    plot.selectAll("rect")
        .data(currentData)
        .transition()
        .duration(750)
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("width", width / currentData.length - barPadding)
        .attr("y", function(d) {
            return yScale(Number(d.value[metric]));
        })
        .attr("height", function(d) {
            return height-yScale(Number(d.value[metric]));
        })
        .attr("fill", currColor)
    ;
    /*
        Update text dissplaying raw frequencies
    */
    var below = {};
    plot.selectAll("text.yAxisRaw")
        .data(currentData)
        .transition()
        .duration(750)
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return (i * (width / currentData.length)) +
                    ((width / currentData.length - barPadding) / 2);
        })
        .attr("y", function(d) {
            var y = yScale(Number(d.value[metric])) + 14;
            if(y >= (height - 48)) {
                below[d.key] = true;
                return y - 34;
            } else {
                below[d.key] = false;
                return y;
            }
        })
        .text(function(d) {
            return formatAsInteger(Number(d.value[metric]));
        })
        .attr("class", "yAxisRaw")
        .attr("fill", function(d) {
            var fill = below[d.key] ? 'black' : 'white';
            return fill;
        })
    ;
    /*
        Update text displaying percentages
    */
    plot.selectAll("text.yAxisPerc")
        .data(currentData)
        .transition()
        .duration(750)
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return (i * (width / currentData.length)) +
                        ((width / currentData.length - barPadding) / 2);
        })
        .attr("y", function(d) {
            var y = yScale(Number(d.value[metric])) + 28;
            if(below[d.key])
            {
                return y - 34;
            } else {
                return y;
            }
        })
        .text(function(d) {
            return formatAsPercentage1Dec(Number(d.value[metric]/total));
        })
        .attr("class", "yAxisPerc")
        .attr("fill", function(d) {
            var fill = below[d.key] ? 'black' : 'white';
            return fill;
        })
    ;
    /*
        Append bar chart title - switch statement below for case that group is 'all'
        (should display 'Overall' instead of 'all')
    */
    var currGroup = (barGroup === 'all') ? 'Overall' : barGroup;
    svg.selectAll("text.title")
        .attr("x", (width + margin.left + margin.right)/2)
        .attr("y", 15)
        .attr("class","title")
        .attr("text-anchor", "middle")
        .text(currGroup + plotTitle + parseType(type.type))
    ;
}