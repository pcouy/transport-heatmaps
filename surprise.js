function compterOccurrences(tableau, valeur) {
	return tableau.filter(e => e === valeur).length;
}

function stdOverTime(data){
	formatDate = d3.timeFormat('%d/%m/%Y');
	return d3.nest()
		.key(d=>d.polygon_id)
		.key(d=>formatDate(new Date((d.time_end+d.time_begin)*1000/2)))
		.rollup(function(n){
			return d3.sum(n.map(d=>d.value));
		})
		.entries(data)
		.map(function(d){
			return {
				polygon_id: d.key,
				mean: d3.mean(d.values,e=>e.value),
				sigma: Math.sqrt(d3.variance(d.values,e=>e.value))
			}
		}); 
}

function stdOverPolygons(data){
	formatDate = d3.timeFormat('%d/%m/%Y');
	return d3.nest()
		.key(d=>formatDate(new Date((d.time_end+d.time_begin)*1000/2)))
		.key(d=>d.polygon_id)
		.rollup(function(n){
			return d3.sum(n.map(d=>d.value));
		})
		.entries(data)
		.map(function(d){
			return {
				datetime: d.key,
				mean: d3.mean(d.values,e=>e.value),
				sigma: Math.sqrt(d3.variance(d.values,e=>e.value))
			}
		}); 
}

function surprise(data1, data2, stdFunc) {
	var surprise = [];
	var values1 = [];
	var values2 = [];
	
	for (var key in data1) {
		data = data1[key];
		values1.push(data['value']);
	}
	
	for (var key in data2) {
		data = data2[key];
		values2.push(data['value']);
	}
	
	var stdData1 = stdFunc(data1);
	var min1 = Math.min(...values1);
	var max1 = Math.max(...values1);
	
	var stdData2 = stdFunc(data2);
	var min2 = Math.min(...values2);
	var max2 = Math.max(...values2);
	
	for (var key1 in data1) {
		for (var key2 in data2) {
			dat1 = data1[key1];
			dat2 = data2[key2];
			if (dat1['polygon_id'] == dat2['polygon_id']) {
				var nouv = {};
				nouv.polygon_id = dat1['polygon_id'];
				if(stdData1[0].polygon_id && stdData2[0].polygon_id){
					mean1 = stdData1.filter(d=>d.polygon_id)[0].mean;
					mean2 = stdData2.filter(d=>d.polygon_id)[0].mean;
					sigma1 = stdData1.filter(d=>d.polygon_id)[0].sigma;
					sigma2 = stdData2.filter(d=>d.polygon_id)[0].sigma;
				}else if(stdData1[0].datetime && stdData2[0].datetime){
					mean1 = stdData1.filter(d=>d.datetime)[0].mean;
					mean2 = stdData2.filter(d=>d.datetime)[0].mean;
					sigma1 = stdData1.filter(d=>d.datetime)[0].sigma;
					sigma2 = stdData2.filter(d=>d.datetime)[0].sigma;
				}
				if(mean1 && mean2 && sigma1 && sigma2){
					nouv.value = ((dat1['value'] - mean1) / sigma1) - ((dat2['value'] - mean2) / sigma2);
				}else{
					nouv.value = 0;
				}
				if (dat1['time_begin'] <= dat2['time_begin'] && dat1['time_end'] >= dat2['time_end']) {
					nouv.time_begin = dat2['time_begin'];
					nouv.time_end = dat2['time_end'];
					
					if (nouv.time_begin <= nouv.time_end)	surprise.push(nouv);
				} else if (dat1['time_begin'] >= dat2['time_begin'] && dat1['time_end'] <= dat2['time_end']) {
					nouv.time_begin = dat1['time_begin'];
					nouv.time_end = dat1['time_end'];
					
					if (nouv.time_begin <= nouv.time_end)	surprise.push(nouv);
				} else if (dat1['time_begin'] <= dat2['time_begin'] && dat1['time_end'] <= dat2['time_end']) {
					nouv.time_begin = dat2['time_begin'];
					nouv.time_end = dat1['time_end'];
					
					if (nouv.time_begin <= nouv.time_end)	surprise.push(nouv);
				} else if (dat1['time_begin'] >= dat2['time_begin'] && dat1['time_end'] >= dat2['time_end']) {
					nouv.time_begin = dat1['time_begin'];
					nouv.time_end = dat2['time_end'];
					
					if (nouv.time_begin <= nouv.time_end)	surprise.push(nouv);
				}
			}
		}
	}
	
	return surprise;
}
