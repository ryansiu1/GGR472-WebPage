// Add default public map token from your Mapbox account
mapboxgl.accessToken = 'pk.eyJ1IjoicnlhbnNpdSIsImEiOiJjbGRtMHJneGgwNHRxM3B0Ym5tb251bDg3In0.gJy3-nzKDytiGCJoqi1Y6w';

// Initializing the map
const map = new mapboxgl.Map({
    container: 'map2', // Add div container ID for your map
    style: 'mapbox://styles/mapbox/dark-v11', // Add link to style URL, I used a default styling offered by Mapbox
    projection: 'globe', // Displays the web map as a globe, instead of the default Web Mercator
    center: [-79.725, 43.885], // Starting position [longitude, latitude]
    zoom: 8.5, // starting zoom value
    bearing: -16.6, // compass bearing for map
    minZoom: 8, // minimum zoom level
    maxZoom: 12 // maximum zoom level
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style, this adds the 'foggy' like feature when fully zoomed out
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

const zoomThreshold = 9 // Setting the zoom threshold where by a transition from CSD to CT will occur

map.on('load', () => {

    map.addSource('CSD-2021', { // Adding the source for the CSD layer
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/ryansiu1/ggr472-webpage/main/data/CSD_2021.geojson'
    });

    map.addLayer({ // Adding the 2021 CSD layer
        'id': '2021-Income-CSD',
        'source': 'CSD-2021',
        // 'source-layer': 'CSD_2021-4jcege',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'COL22'], // GET expression retrieves property value from 'capacity' data field
                '#eaeaea', // Colour assigned to any values < first step
                92000, '#c7e9c0', // Colours assigned to values >= each step
                104000, '#74c476',
                112000, '#238b45',
                128000, '#00441b'
            ],
            'fill-opacity': 0.9,
            'fill-outline-color': 'white'
        },

    });
    
    map.addLayer({ // Same layer as above with a yellow boundary and higher opacity
        'id': '2021-Income-CSD-Fill',
        'source': 'CSD-2021',
        // 'source-layer': 'CSD_2021-4jcege',
        'maxzoom': zoomThreshold,
        'type': 'fill',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'COL22'], // GET expression retrieves property value from 'capacity' data field
                '#eaeaea', // Colour assigned to any values < first step
                92000, '#c7e9c0', // Colours assigned to values >= each step
                104000, '#74c476',
                112000, '#238b45',
                128000, '#00441b'
            ],
            'fill-opacity': 1,
            'fill-outline-color': 'yellow'
        },
        'filter': ['==', ['get', 'CSDUID'], ''] // This filter will disable the layer from appearing until it is hovered over
    });

    map.addSource('CT-2021', { // Adding the source for the CT layer
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/ryansiu1/ggr472-webpage/main/data/CT_2021.json'
    });

    map.addLayer({ // Adding the 2021 CT layer
        'id': '2021-Income',
        'source': 'CT-2021',
        // 'source-layer': 'CT_2021-8ixpqy',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'COL2'], // GET expression retrieves property value from 'capacity' data field
                '#eaeaea', // Colour assigned to any values < first step
                73500, '#c7e9c0', // Colours assigned to values >= each step
                84000, '#74c476',
                121000, '#238b45',
                178000, '#00441b'
            ],
            'fill-opacity': 0.9,
            'fill-outline-color': 'white'
        },

    });

    map.addLayer({ // Same layer as above with a yellow boundary and higher opacity
        'id': '2021-Income-Fill',
        'source': 'CT-2021',
        // 'source-layer': 'CT_2021-8ixpqy',
        'minzoom': zoomThreshold,
        'type': 'fill',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'COL2'], // GET expression retrieves property value from 'capacity' data field
                '#eaeaea', // Colour assigned to any values < first step
                73500, '#c7e9c0', // Colours assigned to values >= each step
                84000, '#74c476',
                121000, '#238b45',
                286000, '#00441b'
            ],
            'fill-opacity': 1,
            'fill-outline-color': 'yellow'
        },
        'filter': ['==', ['get', 'CTUID'], ''] // This filter will disable the layer from appearing until it is hovered over
    });
    
    map.addSource('Subway', { // Adding the source for the subway layer
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/ryansiu1/ggr472-webpage/main/data/subway.geojson'
    });

    map.addLayer({ // Adding the 2021 CSD layer
        'id': 'Subway-Layer',
        'source': 'Subway',
        //'maxzoom': zoomThreshold,
        'type': 'line',
        'paint': {
            'line-color': '#000000',
            'line-width': 3
        },
    });
});

    // Add a hover effect for the CSD when the mouse is over it
    map.on('mousemove', '2021-Income-CSD', (e) => {
        if (e.features.length > 0) { //determines if there is a feature under the mouse
            map.setFilter('2021-Income-CSD-Fill', ['==', ['get', 'CSDUID'], e.features[0].properties.CSDUID]); //applies the filter set above
        }
    });

    map.on('mouseleave', '2021-Income-CSD-Fill', () => { //removes the highlight when the mouse moves away
        map.setFilter("2021-Income-CSD-Fill", ['==', ['get', 'CSDUID'], '']);
    });

    // Add a hover effect for the CT when the mouse is over it
    map.on('mousemove', '2021-Income', (e) => {
        if (e.features.length > 0) { //determines if there is a feature under the mouse
            map.setFilter('2021-Income-Fill', ['==', ['get', 'CTUID'], e.features[0].properties.CTUID]); //applies the filter set above
        }
    });

    map.on('mouseleave', '2021-Income-Fill', () => { //removes the highlight when the mouse moves away
        map.setFilter("2021-Income-Fill", ['==', ['get', 'CTUID'], '']);
    });

    // Add a dynamic textbox that will change when hovering over different CSD or CT (depending on zoom level) to update the median income.
    map.on('zoom', () => {
        if (map.getZoom() < zoomThreshold) {
            map.on("mousemove", function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ["2021-Income-CSD"]
                });

                if (features.length) {
                    //show median income in textbox
                    document.getElementById('indicator').innerHTML = "The median household income for this CSD is $" + features[0].properties.COL2;

                } else {
                    //if not hovering over a feature set indicator to default message
                    document.getElementById('indicator').innerHTML = "Hover your cursor over a Census Subdivision to see the median income here, or click on it to view the CSDUID.";
                }
            });
        } else {
            map.on("mousemove", function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ["2021-Income"]
                });

                if (features.length) {
                    //show median income in textbox
                    document.getElementById('indicator').innerHTML = "The median household income for this CT is $" + features[0].properties.COL2;

                } else {
                    //if not hovering over a feature set indicator to default message
                    document.getElementById('indicator').innerHTML = "Hover your cursor over a Census Tract to see the median income here, or click on it to view the CTUID.";
                }
            });
        }
    });

    //Create popups upon a click for each CT displaying the median income
    map.on('click', '2021-Income-CSD', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("CSDUID: " + e.features[0].properties.CSDUID) //indexes the GeoJSON code for the CSDUID from properties
            .addTo(map);
    });

    //Create popups upon a click for each CT displaying the median income
    map.on('click', '2021-Income', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("CTUID: " + e.features[0].properties.CTUID) //indexes the GeoJSON code for the CTUID from properties
            .addTo(map);
    });

    // Changes the cursor to a link pointer when the mouse is over a CSD
    map.on('mouseenter', '2021-Income-CSD', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Changes the cursor back to a pointer when it leaves a CSD
    map.on('mouseleave', '2021-Income-CSD', () => {
        map.getCanvas().style.cursor = '';
    });

    // Changes the cursor to a link pointer when the mouse is over a CT
    map.on('mouseenter', '2021-Income', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Changes the cursor back to a pointer when it leaves a CT.
    map.on('mouseleave', '2021-Income', () => {
        map.getCanvas().style.cursor = '';
    });

// change the legend depending on the zoom threshold
const CSDLegend = document.getElementById('CSD-legend');
const CTLegend = document.getElementById('CT-legend');
map.on('zoom', () => {
    if (map.getZoom() > zoomThreshold) {
        CSDLegend.style.display = 'none';
        CTLegend.style.display = 'block';
    } else {
        CSDLegend.style.display = 'block';
        CTLegend.style.display = 'none';
    }
});

//Change map layer display based on check box using setlayoutproperty
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'Subway-Layer',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

// /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
// var prevScrollpos = window.pageYOffset;
// window.onscroll = function () {
//     var currentScrollPos = window.pageYOffset;
//     if (prevScrollpos > currentScrollPos) {
//         document.getElementById("navbar").style.top = "0";
//     } else {
//         document.getElementById("navbar").style.top = "-50px";
//     }
//     prevScrollpos = currentScrollPos;
// }


