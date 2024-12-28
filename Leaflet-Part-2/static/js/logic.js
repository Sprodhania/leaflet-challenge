// Define the API endpoint
    let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02";

    // Create the map
    let myMap = L.map("map").setView([39.742043,  -104.991531], 5);

    // Add tile layers
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Fetch the earthquake data
    d3.json(queryUrl).then(function(data) {
        createFeatures(data.features);
    });

    function createFeatures(earthquakeData) {
        earthquakeData.forEach(function(feature) {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2];
            let coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

            // Define marker size based on magnitude
            let markerSize = magnitude * 5;

            // Define marker color based on depth
            //let markerColor = depth > 30 ? 'red' : depth > 20 ? 'orange' : depth > 10 ? 'yellow' : 'green';
            let markerColor = depth > 90 
    ? 'red' 
    : depth > 70 
    ? 'orange' 
    : depth > 50 
    ? 'gold' 
    : depth > 30 
    ? 'yellow' 
    : depth > 10 
    ? 'lime' 
    : depth >= -10 
    ? 'green' 
    : 'gray';
     

            // Create a circle marker
            L.circleMarker(coords, {
                radius: markerSize,
                fillColor: markerColor,
                color: markerColor,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${feature.properties.place}</h3><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`).addTo(myMap);
        });

        // Create a legend
        createLegend();
    }

    function createLegend() {
        let legend = L.control({position: 'bottomright'});

        legend.onAdd = function () {
            let div = L.DomUtil.create('div', 'legend');
            div.innerHTML += '<strong>Depth (km)</strong><br>';
            div.innerHTML += '<i style="background: green; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> -10 to 10<br>';
            div.innerHTML += '<i style="background: lime; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> 10 to 30<br>';
            div.innerHTML += '<i style="background: yellow; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> 30 to 50<br>';
            div.innerHTML += '<i style="background: gold; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> 50 to 70<br>';
            div.innerHTML += '<i style="background: orange; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> 70 to 90<br>';
            div.innerHTML += '<i style="background: red; width: 15px; height: 15px; display: inline-block; margin-right: 5px;"></i> 90+<br>';
            return div;
        };

        legend.addTo(myMap);
    }