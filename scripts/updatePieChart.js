/*
  Update existing pie chart vien new data / a different metric
*/
function updatePieChart(data, metric) {
    var currPieData = selectPieData(data, minDate, maxDate);
    pieData['totalVisits'] = currPieData['totalVisits'];
    pieData['totalViews'] = currPieData['totalViews'];    
    var totals = metric === 'visits' ? currPieData['totalVisits'] : currPieData['totalViews'];
    var plotTitle = metric === 'visits' ? 'Unique Visitors ' : 'Page Views ';
    currPieData = d3.entries(currPieData);
   	/*
      Generate new pie element given updated data
    */
   	var pie = d3.pie()   	
   		.sort(null)
   		.value( function(d) { 
          if( !(d.key === 'totalVisits') && !(d.key === 'totalViews')) {            
            return d.value[metric];
          } else {
            console.log(d);
          }})(currPieData);        
   	;
    /*
      Select existing piechart element, update values displayed on slices
    */
   	d3.select('#pieChart')
   		.selectAll('path')
   		.data(pie)
   		.attr('d', arc)
   		.select('title')   		
   		.text(function(d) { 
     			return d.data.key + ": " + d.data.value[metric] + ' (' + 
   				formatAsPercentage1Dec(d.data.value[metric] / totals) + ') '; 
   			});
   	;
    /*
      Update slices given udpated data (set transition/delay, etc.)
    */
   	d3.selectAll('g.slice')
   		.selectAll('path')
   		.transition()   	
      .duration(750)
      .delay(10 )   	
   		.attr('d', arcFinal)
    ;
    /*
      Update arc labels
    */
   	d3.selectAll("text.label")
   		.data(pie)
      .transition()
      .duration(750)
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
      Update arc raw frequencies
    */
    d3.selectAll('text.label_total')
      .data(pie)
      .attr("transform", function(d) { 
        return "translate(" + arcFinal.centroid(d) + ")";
        })
      .text(function(d) { 
        console.log(d.endAngle - d.startAngle);
        if((d.endAngle - d.startAngle) > .45) {
          return formatAsInteger(d.data.value[metric]);  
        } else {
          return "";
        }
      })        
    ;
    /*
      Update arc percentages
    */
    d3.selectAll('text.label_perc')
      .data(pie)
      .attr("transform", function(d) { 
        return "translate(" + arcFinal.centroid(d) + ")";
        })
      .text(function(d) { 
        if((d.endAngle - d.startAngle) > .45) {
          return formatAsPercentage1Dec(d.data.value[metric] / totals);                
        } else {
          return '';
        }
      })
    ;
    /*
      Update polylines
    */
    /*
    console.log(currPieData);
    d3.select('.lines')
      .selectAll('polyline')
      .data(pie)  
      .transition()
      .duration(750)
      .attr('points', function(d) {
        console.log(d);
        if(d.data.value[metric] > 0 && (d.endAngle - d.startAngle) > 0.2) { 
          return [arc.centroid(d), arcFinal.centroid(d)];               
        } else {
          return [arc.centroid(d), arc.centroid(d)];
        }       
    })
    */
    console.log(currPieData);
    var lines = d3.select('.lines')
      .selectAll('polyline')
      .data(pie)  
      ;

    lines.transition()
      .duration(750)
      .attr('points', function(d) {
        if(d.data.value[metric] > 0 && (d.endAngle - d.startAngle) > 0.2) { 
          return [arc.centroid(d), arcFinal.centroid(d)];               
        } else {
          return [arc.centroid(d), arc.centroid(d)];
        }       
    });

      //.transition()
      //.duration(750)
    lines.enter()     
      .append('polyline')
      .attr('points', function(d) {
        if(d.data.key === 'totalViews' || d.data.key === 'totalVisits') {
          console.log(d.data.key);
          return [0,0];
        }
        if(d.data.value[metric] > 0 && (d.endAngle - d.startAngle) > 0.2) { 
          return [arc.centroid(d), arcFinal.centroid(d)];               
        } else {
          return [arc.centroid(d), arc.centroid(d)];
        }       
      })
      .attr('transform', 'scale(1.32)');

    
    /*
      Update pie char title
    */
    d3.selectAll('text.title')
      .text("Total " + plotTitle + " by App");
    /*
      Update pie chart total
    */
    d3.selectAll('text.title_total')
      .text('Total: ' + formatAsInteger(totals));      
    ;
}