
//test if browser supports webGL

if(Modernizr.webgl) {
	
	//Load data and config file
	d3.queue()
		.defer(d3.csv, "data/chnglem.csv")
		.defer(d3.json, "data/config.json")
		.defer(d3.json, "data/geog.json")
		.await(ready);
		
	
	function ready (error, data, config, geog){
		
		//Set up global variables
		dvc = {};
		dvc.time = "yr1";
		oldAREACD = "";
		
		//Fire design functions
		selectlist(data);
		
		//Mapbox key (must hide)
		//mapboxgl.accessToken = 'pk.eyJ1Ijoib25zZGF0YXZpcyIsImEiOiJjamMxdDduNnAwNW9kMzJyMjQ0bHJmMnI1In0.3PkmH-GL8jBbiWlFB1IQ7Q';
		
		//set max bounds (stops loading unnessary tiles
		var bounds = [
			[-19.8544921875, 40.82380908513249], // Southwest coordinates
			[10.021484375, 68.478568831926395]  // Northeast coordinates
		];
		
		//set up basemap
		var map = new mapboxgl.Map({
		  container: 'map', // container id
		  style: 'https://free.tilehosting.com/styles/positron/style.json?key=ZBXiR1SHvcgszCLwyOFe', //stylesheet location
		  center: [-2.5, 54], // starting position
		  zoom: 4.5, // starting zoom
		  maxBounds: bounds //set maximum boundaries
		});
		
		// Add zoom and rotation controls to the map.
		map.addControl(new mapboxgl.NavigationControl());
		
		// Add geolocation controls to the map.
		map.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			},
			trackUserLocation: true
		}));
		
		
		//set up d3 color scales
		
		console.log(colorbrewer.YlGn[5]);
		
		color = d3.scaleThreshold()
				.domain([0,10,20,30,40,50])
				.range(colorbrewer.YlGn[5]);
				
		rateById = {};
		areaById = {};

		data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.time); areaById[d.AREACD] = d.AREANM});	
						
		//convert topojson to geojson
		var areas = topojson.feature(geog, geog.objects.LA2014merc);
		
		areas.features.map(function(d,i) {
			
		  d.properties.fill = color(rateById[d.properties.AREACD]) 
		});

		//cb(districts)
		
		map.on('load', function() {
		  
		
			map.addSource('area', { 'type': 'geojson', 'data': areas });
		
			
			  map.addLayer({
				  'id': 'area',
				  'type': 'fill',
				  'source': 'area',
				  'layout': {},
				  'paint': {
					  'fill-color': {
							type: 'identity',
							property: 'fill',
					   },
					  'fill-opacity': 0.7,
					  'fill-outline-color': '#fff'
				  }
			  });
			
			
			map.addLayer({
				"id": "state-fills-hover",
				"type": "line",
				"source": "area",
				"layout": {},
				"paint": {
					"line-color": "#000",
					"line-width": 2
				},
				"filter": ["==", "AREACD", ""]
			});
					
			  map.addLayer({
				  'id': 'area_labels',
				  'type': 'symbol',
				  'source': 'area',
				  'minzoom': 10,
				  'layout': {
					  "text-field": '{AREANM}',
					  "text-font": ["DIN Offc Pro Medium","Arial Unicode MS Regular"],
					  "text-size": 14
				  },
				  'paint': {
					  "text-color": "#666",
					  "text-halo-color": "#fff",
					  "text-halo-width": 1,
					  "text-halo-blur": 1
				  }
			  });
			
		
			//Highlight stroke on mouseover (and show area information)
			map.on("mousemove", "area", function(e) {
				console.log(e.features[0].properties.AREACD);
				newAREACD = e.features[0].properties.AREACD;
				
				if(newAREACD != oldAREACD) {
					oldAREACD = e.features[0].properties.AREACD;
					map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);
					showAreaInfo(e.features[0].properties.AREANM, rateById[e.features[0].properties.AREACD]);
				}
			});
	
			// Reset the state-fills-hover layer's filter when the mouse leaves the layer.
			map.on("mouseleave", "area", function() {
				map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
			});
		
	
		});
		
		
		function showAreaInfo(name, rate) {
			console.log(rate);
			d3.select("#rate").text(name + ": " + rate)
		}
		
		function createKey(config){

			keywidth = $("#keydiv").width();
	
			var svgkey = d3.select("#keydiv")
				.append("svg")
				.attr("id", "key")
				.attr("width",keywidth);
	
			newbreaks = breaks;
	
			var color = d3.scaleThreshold()
			   .domain(newbreaks)
			   .range(dvc.colour);
	
			y = d3.scaleLinear()
				.domain([newbreaks[0], breaks[4]]) /*range for data*/
				.range([300, 0]); /*range for pixels*/
	
	
	
			x = d3.scaleLinear()
				.domain([newbreaks[0], breaks[4]]) /*range for data*/
				.range([0,keywidth-30]); /*range for pixels*/
	
			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickSize(15)
				.tickValues(color.domain())
				.tickFormat(d3.format(".1f"));
	
	
			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickSize(15)
				.tickValues(color.domain())
				.tickFormat(d3.format(".0f"));
	
	
			//horizontal key
	
			var g2 = svgkey.append("g").attr("id","horiz")
				.attr("transform", "translate(15,30)");
	
	
			keyhor = d3.select("#horiz");
	
			g2.selectAll("rect")
				.data(color.range().map(function(d,i) {
	
				  return {
					x0: i ? x(color.domain()[i+1]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
			  .enter().append("rect")
				.attr("class", "blocks")
				.attr("id", function(d,i){ return "pill"+config.ons.varcolour[a][i].replace(/#/g,"");
											})
				.attr("height", 8)
				.attr("x", function(d) {
					 return d.x0; })
				.attr("width", function(d) {return d.x1 - d.x0; })
				.style("opacity",0.8)
				.style("fill", function(d) { return d.z; });
	
	
			keyhor.selectAll("rect")
				.data(color.range().map(function(d, i) {
				  return {
					x0: i ? x(color.domain()[i]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
				.attr("x", function(d) { return d.x0; })
				.attr("width", function(d) { return d.x1 - d.x0; })
				.style("fill", function(d) { return d.z; });
	
			keyhor.call(xAxis).append("text")
				.attr("id", "caption")
				.attr("x", -63)
				.attr("y", -20)
				.text("");
	
			keyhor.append("rect")
				.attr("id","keybar")
				.attr("width",8)
				.attr("height",0)
				.attr("transform","translate(15,0)")
				.style("fill", "#ccc")
				.attr("x",x(0));
	
	
	
			d3.select("#horiz").selectAll("text").attr("transform",function(d,i){// if there are more that 4 breaks, so > 5 ticks, then drop every other.
																				if(i % 2 && dvc.jenksSteps > config.ons.dropXtick){return "translate(0,10)"
																				} });
	
			g2.append("text").attr("id","keyunit").text(dvc.unittext).attr("transform","translate(0,-10)");

	} // Ends create key
		
		function selectlist(datacsv) {

			var areacodes =  datacsv.map(function(d) { return d.AREACD; });
			var areanames =  datacsv.map(function(d) { return d.AREANM; });
			var menuarea = d3.zip(areanames,areacodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });

			// Build option menu for occupations
			var optns = d3.select("#selectNav").append("div").attr("id","sel").append("select")
				.attr("id","areaselect")
				.attr("style","width:98%")
				.attr("class","chosen-select");


			optns.append("option")
				.attr("value","first")
				.text("");

			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]})
				.text(function(d){ return d[0]});

			myId=null;

			$('#areaselect').chosen({width: "98%", allow_single_deselect:true}).on('change',function(evt,params){

					if(typeof params != 'undefined') {


							/* identify the data-nm attribute of the polygon you've hovered over */
//							indexarea = document.getElementById("occselect").selectedIndex;
//							myId=params.selected;
//							currclass=params.selected;
//
//							selected=true;
//							leaveLayer();
//							highlightArea();
//
//
//							d3.select(".leaflet-overlay-pane").selectAll("path").on("mouseout",null).on("mouseover",null);
//							pymChild.sendMessage('navigate', indexarea + " " + dvc.time);

					}
					else {
							// Remove any selections
//							indexarea ="0";
//							myId=null;
//							selected=false;
//							leaveLayer();
//							d3.select(".leaflet-overlay-pane").selectAll("path").on("mouseout",leaveLayer).on("mouseover",enterLayer);
//							pymChild.sendMessage('navigate', indexarea + " " + dvc.time);

					}

			});

	};
		
	}

} else {
	
	//provide fallback for browsers that don't support webGL	

}