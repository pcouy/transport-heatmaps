function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) && Array.isArray(toFlatten[0][0]) ? flatten(toFlatten) : toFlatten);
	}, []);
}

function plotMap(geoJson, data, svgId){
	svg = d3.select("#"+svgId);
	var width = svg.attr("width");
	var height = svg.attr("height");
	
	// On rajoute un groupe englobant toute la visualisation pour plus tard
    var g = svg.append( "g" );

	//On choisit le type de projection
    var projection = d3.geoMercator();
    //On calcule les paramètres pour la projection
    var allCoords = flatten(geoJson.map(d=>d.geometry.coordinates));
	var longAmplitude = d3.extent(allCoords, d=>d[0]);
	var latAmplitude = d3.extent(allCoords, d=>d[1]);
	var longCenter = ( longAmplitude[0] + longAmplitude[1] ) / 2;
	var latCenter = ( latAmplitude[0] + latAmplitude[1] ) / 2;
	var longScale = 45*width/(longAmplitude[1] - longAmplitude[0]);
	var latScale = 45*height/(latAmplitude[1] - latAmplitude[0]);
	projection.center([longCenter, latCenter]).translate([width/2,height/2]).scale(d3.min([longScale, latScale]));
	
	geoJson = geoJson.map(function(d){
		d.properties.value = 0;
		return d;
	});
    
    // On definie une echelle de couleur
	var color = d3.scaleSequential(!$('#toggleDivergingScale').is(':checked')?d3.interpolateGreens:d3.interpolateRdBu);
    
    var tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		//.style("z-index", "10")
		.style("visibility", "hidden")
		.style("background", "lightsteelblue")
		.style("border-radius", "3px")
		.text("");
		
	function mouseovertooltip(d){
		d3.select(this)
		.style("fill-opacity", 0.4)
		return tooltip.style("visibility", "visible");
	}

	function mousemovetooltip(d){
		tooltip.text(d.properties.polygon_id +  " : " + d.properties.value)
		return tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
	}

	function mouseouttooltip(d){
		d3.select(this)
			.style("fill", function(d) {
				//on prend la valeur recupere plus haut
				var value = $('#toggleDivergingScale').is(':checked')?-d.properties.value:d.properties.value;
				if (value) {
					return color(value);
				} else { 
					// si pas de valeur alors en gris
					return "#ccc";
				}
			})
			.style("fill-opacity", 1.0);
		return tooltip.style("visibility", "hidden");
	}
		
	var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
                 
    //On fusionne les donnees avec le GeoJSON des regions
	for (var i = 0; i < data.length; i++) {
	  
		var dataValue = 0;
	  
		//Nom de la region
		var dataRegion = data[i].polygon_id;
		var dataValue = parseFloat(data[i].value);
	  
		//Recherche de l'etat dans le GeoJSON
		for (var j = 0; j < geoJson.length; j++) {
			var jsonRegion = geoJson[j].properties.polygon_id;
			if (String(dataRegion) == String(jsonRegion)) {
					geoJson[j].properties.value += dataValue;
					//Pas besoin de chercher plus loin
					break;
			}
		}
	}
	
	if($('#toggleDivergingScale').is(':checked')){
		var absMax = d3.max( geoJson.map( d=>Math.abs(parseFloat(d.properties.value)) ) );
		color.domain([-absMax,absMax]);
	}else{
		color.domain(d3.extent( geoJson.map( d=>parseFloat(d.properties.value) ) ));
	}
	
	
	g.selectAll("path").data(geoJson).exit().remove();
	
	g.selectAll("path")
		.data(geoJson)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("class","district")
		.on("mouseover", function(d){
			  mouseovertooltip.call(this, d);
		  })
		.on("mousemove", function(d){
			  mousemovetooltip.call(this, d);
		  })
		.on("mouseout", function(d){
			  mouseouttooltip.call(this, d);
		})
		.on("click",function(d){
			if(!window.cntrlIsPressed){
				$('.selected').toggleClass('selected');
			}
			$(this).toggleClass('selected');
			
			var filtering = function(entry){
				var result = false;
				d3.selectAll('.selected').data().forEach(function(d){
					if( entry.polygon_id==d.properties.polygon_id ){
						result = true;
					}
				});
				return result;
			};
			console.log(data.filter(filtering));
			plotCalendar(data.filter(filtering),"heatmap")
		})
		.merge(g.selectAll("path").data(geoJson))
		.transition(500)
		.style("fill", function(d) {
			//on prend la valeur recupere plus haut
			var value = $('#toggleDivergingScale').is(':checked')?-d.properties.value:d.properties.value;
			if (value) {
				return color(value);
			} else { 
				// si pas de valeur alors en gris
				return "#ccc";
			}
		});
}
