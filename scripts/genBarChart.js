function genBarChart(data, type, metric) {
    //Preliminary fields/data    
    initData = data;
    plotData = d3.entries(data);
    minDate = new Date(2017, 6, 22);    
    maxDate = new Date(2017, 8, 22);
    var initialData = selectBarData(plotData, minDate, maxDate, 'all');
    var totalViews = initialData.tvw;    
    var totalVisits = initialData.tvs;
    var totalSelector = metric === 'visits' ? 'totalVisits' : 'totalViews';
    var plotTitle = metric === 'visits' ? 'Overall Unique Visitors' : 'Overall Page Views';
    var total = metric === 'visits' ? initialData.tvs : initialData.tvs;
    initialData = initialData.data;
    initialData = d3.entries(initialData);
    var plotBasics = barChartBasics(type.height); 
    var margin = plotBasics.margin,
        width = plotBasics.width,
        height = plotBasics.height,
        colorBar = plotBasics.colorBar,
        barPadding = plotBasics.barPadding
    ;
   
    if(type.type === 'browser') {
        browserType.views = data['totalViews'];
    } else if(type.type === 'device') {
        deviceType.views = data['totalViews'];
    } else {
        osType.views = data['totalViews'];
    }

    //Create linear x scale
    var xScale = d3.scaleLinear()
        .domain([0, initialData.length])
        .range([0, width])
    ;

    // Create linear y scale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(initialData, function(d) { return Number(d.value.views); })])
        .range([height, 0])
    ;

    //Create SVG element for the chart, append all elements
    var svg = d3.select(type.div)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id",type.svg)
    ;

    var plot = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;

    plot.selectAll("rect")
        .data(initialData)
        .enter()        
        .append("rect")
        .attr("x", function(d, i) {
        	return xScale(i);
        })
        .attr("width", width / initialData.length - barPadding)
        .attr("y", function(d) {
            return yScale(Number(d.value[metric]));
        })
        .attr("height", function(d) {
            return height-yScale(Number(d.value[metric]));
        })
        .attr("fill", initColor)        
    ;

    // Add raw counts to plot
    var plotText = plot.selectAll("text")
        .data(initialData)
        .enter()
    ;

    /*
        Dictionary to keep track of whether a data point ought to have its numerical
        value displayed above or below its corresponding rect
    */
    var below = {};
    
    //Append text displaying raw frequencies
    plotText.append("text")
        .text(function(d) {
            return formatAsInteger(d.value[metric]);
        })
        .attr("text-anchor", "middle")
                .attr("x", function(d, i) {
            return (i * (width / initialData.length)) +
                        ((width / initialData.length - barPadding) / 2);
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
        .attr("class", "yAxisRaw")
        .attr("fill", function(d) {
            var fill = below[d.key] ? 'black' : 'white';
            return fill;
        })
    ;

    // Add percentages to plot
    plotText.append("text")
        .text(function(d) {
            return formatAsPercentage1Dec(Number(d.value[metric]) / total);
        })
        .attr("text-anchor", "middle")
        // Set x position to the left edge of each bar plus half the bar width
        .attr("x", function(d, i) {
            return (i * (width / initialData.length)) +
                        ((width / initialData.length - barPadding) / 2);
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
        .attr("class", "yAxisPerc")
        .attr("fill", function(d) {
            var fill = below[d.key] ? 'black' : 'white';
            return fill;
        })
    ;

    // Add x labels to chart
    var xLabels = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +
                (margin.top + height)  + ")")
    ;

    xLabels.selectAll("text.xAxis")
        .data(initialData)
        .enter()
        .append("text")
        .text(function(d) { return d.key;})
        .attr("text-anchor", "middle")
        // Set x position to the left edge of each bar plus half the bar width
        .attr("x", function(d, i) {
            return (i * (width / initialData.length)) + ((width / initialData.length - barPadding) / 2);
        })
        .attr("y", 15)
        .attr("class", "xAxis")
    ;

    // Title
    svg.append("text")
        .attr("x", (width + margin.left + margin.right)/2)
        .attr("y", 15)
        .attr("class","title")
        .attr("text-anchor", "middle")
        .text(plotTitle + " By " + type.type)
    ;
}