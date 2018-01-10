function coordsToPolygonId(points, geoJson){
	geoJson = geoJson.map(function(d){
		d.geometry.coordinates = d.geometry.coordinates.map(e=>e.reverse());
		return d;	
	});
	return points.map(function(d){
		for(var i = 0; i < geoJson.length; i++){
			if( d3.geoContains(geoJson[i], [d.longitude, d.latitude]) ){
				d.polygon_id = geoJson[i].properties.polygon_id;
				return d;
			}
		}
		return d;
	});
}
