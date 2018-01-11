function compterOccurrences(tableau, valeur) {
	return tableau.filter(e => e === valeur).length;
}

function surprise(data1, data2) {
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
	
	var total1 = d3.sum(values1);
	var min1 = Math.min(...values1);
	var max1 = Math.max(...values1);
	
	var total2 = d3.sum(values2);
	var min2 = Math.min(...values2);
	var max2 = Math.max(...values2);
	
	for (var key1 in data1) {
		for (var key2 in data2) {
			dat1 = data1[key1];
			dat2 = data2[key2];
			if (dat1['polygon_id'] == dat2['polygon_id']) {
				var nouv = {};
				nouv.polygon_id = dat1['polygon_id'];
				total1 = d3.sum(data1.filter(d=>d.polygon_id==nouv.polygon_id), d=>d.value);
				total2 = d3.sum(data2.filter(d=>d.polygon_id==nouv.polygon_id), d=>d.value);
				nouv.value = (dat1['value'] / total1) - (dat2['value'] / total2);
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
