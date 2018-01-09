mapboxgl.accessToken = 'pk.eyJ1Ijoib25zZGF0YXZpcyIsImEiOiJjamMxdDduNnAwNW9kMzJyMjQ0bHJmMnI1In0.3PkmH-GL8jBbiWlFB1IQ7Q';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/light-v8', //stylesheet location
  center: [-2.5, 54], // starting position
  zoom: 4.5 // starting zoom
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

color = d3.scaleOrdinal(d3.schemeCategory20);

map.on('load', function() {
  loadDistricts("data/geog.json", function(data) {

    map.addSource('area', { 'type': 'geojson', 'data': data });

    for (var i = 0; i < 10; i++) {
      map.addLayer({
          'id': 'area' + i,
          'type': 'fill',
          'source': 'area',
          'layout': {},
          'paint': {
              'fill-color': color(i),
              'fill-opacity': 0.2
          },
          'filter': ['==', 'fill', color(i)]
      }, 'admin-3-4-boundaries-bg');
    }
    map.addLayer({
        'id': 'area',
        'type': 'fill',
        'source': 'area',
        'layout': {},
        'paint': {
			'fill-color': 'rgba(0,0,0,0)',
            'fill-opacity': 0.2,
            'fill-outline-color': '#ccc'
        },
    }, 'admin-3-4-boundaries-bg');
	
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


//    var labels = { 'type': 'FeatureCollection', 'features':[] };
//    data.features.map(function(d) {
//      var pt = turf.pointOnSurface(d);
//      pt.properties = d.properties;
//      labels.features.push(pt);
//    });
//    console.log(labels);
//
//    map.addSource('district_labels', { 'type': 'geojson', 'data': labels });
//    for (var i = 0; i < 10; i ++) {
//      map.addLayer({
//          'id': 'district_labels' + i,
//          'type': 'symbol',
//          'source': 'district_labels',
//          'layout': {
//              "text-field": '{CD114FP}',
//              "text-font": ["DIN Offc Pro Medium","Arial Unicode MS Regular"],
//              "text-size": { "stops": [[2,8],[7,18]], "base": 0.9 }
//          },
//          'paint': {
//              "text-color": color(i),
//              "text-halo-color": "#fff",
//              "text-halo-width": 1,
//              "text-halo-blur": 1
//          },
//          'filter': ['==', 'fill', color(i)]
//      });
//    }
	
	    map.on("mousemove", "area", function(e) {
			console.log(e)
        	map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);
   		});

    	// Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    	map.on("mouseleave", "area", function() {
        	map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
    	});
	
  });
});

function loadDistricts(file, cb) {
  d3.json(file, function(error, topoAreas) {
	  
	  console.log(topoAreas);

    //var areas = topojson.feature(topoAreas, topoAreas.objects.LAUKmerc);
	var areas = topojson.feature(topoAreas, topoAreas.objects.LA2014merc);
	console.log(areas)
	//,
     //   neighbors = topojson.neighbors(topoDistricts.objects.cb_2014_500k.geometries);

//    districts.features.map(function(d,i) {
//      d.properties.fill = d3.max(neighbors[i], function(n) {
//        return districts.features[n].properties.fill >= 0 ? districts.features[n].properties.fill + 1 : 0;
//      });
//    });
//
//    districts.features.map(function(d,i) {
//      d.properties.fill = color(d.properties.fill);
//    });

    cb(areas)
  });
}