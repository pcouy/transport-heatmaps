function deepCopy(oldObj) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (var i in oldObj) {
            newObj[i] = deepCopy(oldObj[i]);
        }
    }
    return newObj;
}

function plotCalendar(data_raw, idSvg) {
      'use strict';
      
      var nestedData;
      var parseDate = d3.timeParse('%m/%d/%Y');
      var data=[];
      data_raw.forEach(function(d){
		for (var i = d.time_begin; i <= d.time_end; i+=3600*24) {
			var currentDate = new Date(i*1000);
			var newData = deepCopy(d)
			newData.datetime = currentDate;
			data.push(newData);
		}  
	  })
	  
	  console.log(data);

	  var svg = d3.select("#"+idSvg);
      // create chart
      var heatChart = d3.eesur.heatmap()
          .height(svg.attr('height'))
          .width(svg.attr('width'))
          .startYear('2014')
          .endYear('2015');
          
          // remplacer sum par moyenne valeurs absolues
          nestedData = d3.nest()
              .key(function (d) { 
				  //~ console.log(d);
                return d.datetime; 
              })
              .rollup(function (n) { 
                  return d3.sum(n.map(d=>d.value));
              })
              .map(data);
			console.log(nestedData);
          // render chart
          d3.select('#'+idSvg)
              .datum(nestedData)
              .call(heatChart);
		
		d3.selectAll('.day').on('click',function(d){
			var targetTime = d.datetime.getTime()/1000;
			var filtering = entry=>( entry.time_begin<=targetTime && entry.time_end>=targetTime );
			plotMap(geoJson, data_raw.filter(filtering), "svgMap");
			console.log(data_raw.filter(filtering));
		});
  }
