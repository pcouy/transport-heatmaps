function displayDatasetPicker(){
	$('#dataset_picker').remove();
	$('#ui').append('<div id="dataset_picker"></div><hr>');
	for(dataset of window.datasets){
		$('#dataset_picker').append('<a href="#!" data-dataset="'+dataset[0]+'" id="select_'+dataset[0]+'">'+dataset[0]+'</a><br>');
		$('#select_'+dataset[0]).click(function(){
			plotCalendar(window.datasets.get($(this).data('dataset')),'heatmap');
			plotMap(geoJson, window.datasets.get($(this).data('dataset')), 'svgMap');
		});
	}
}

function displayDatasetComparer(){
	$('#dataset_comparer').remove();
	$('#ui').append('<div id="dataset_comparer"><select id="select_compare_1"></select><select id="select_compare_2"></select></div>');
	for(dataset of window.datasets){
		$('#select_compare_1').append('<option value="'+dataset[0]+'">'+dataset[0]+'</option>')
		$('#select_compare_2').append('<option value="'+dataset[0]+'">'+dataset[0]+'</option>')
	}
	$('#dataset_comparer').append('<a href="#!" id="compare_link">Compare datasets</a>');
	$('#compare_link').click(function(){
		var dataset1 = window.datasets.get( $('#select_compare_1').val() );
		var dataset2 = window.datasets.get( $('#select_compare_2').val() );
		var newDataset = surprise(dataset1,dataset2);
		window.datasets.set( prompt("Dataset name ?") , newDataset );
		
		displayDatasetPicker();
		displayDatasetMerger();
		displayDatasetComparer();
	});
}

function displayDatasetMerger(){
	$('#dataset_merger').remove();
	$('#ui').append('<div id="dataset_merger"><select id="select_merge_1"></select><select id="select_merge_2"></select></div><hr>');
	for(dataset of window.datasets){
		$('#select_merge_1').append('<option value="'+dataset[0]+'">'+dataset[0]+'</option>')
		$('#select_merge_2').append('<option value="'+dataset[0]+'">'+dataset[0]+'</option>')
	}
	$('#dataset_merger').append('<a href="#!" id="merge_link">Add datasets</a>');
	$('#merge_link').click(function(){
		var dataset1 = window.datasets.get( $('#select_merge_1').val() );
		var dataset2 = window.datasets.get( $('#select_merge_2').val() );
		var newDataset = dataset1.concat(dataset2);
		window.datasets.set( prompt("Dataset name ?") , newDataset );
		
		displayDatasetPicker();
		displayDatasetMerger();
		displayDatasetComparer();
	});
}

function setOrigDataset(dataset){
	$('#saveMapFilter').click(function(){
		var filtering = function(entry){
			var result = false;
			d3.selectAll('.selected').data().forEach(function(d){
				if( entry.polygon_id==d.properties.polygon_id ){
					result = true;
				}
			});
			return result;
		};
		window.datasets.set(prompt("Dataset name ?"), dataset.filter(filtering));
		displayDatasetPicker();
		displayDatasetMerger();
		displayDatasetComparer();
	});
	$('#saveTimeFilter').click(function(){
		var filtering = function(entry){
			var result = false;
			d3.selectAll('.selected').data().forEach(function(d){
				var targetTime = d.datetime.getTime()/1000;
				if( entry.time_begin<=targetTime && entry.time_end>=targetTime ){
					result = true;
				}
			});
			return result;
		};
		window.datasets.set(prompt("Dataset name ?"), dataset.filter(filtering));
		displayDatasetPicker();
		displayDatasetMerger();
		displayDatasetComparer();
	});
}
