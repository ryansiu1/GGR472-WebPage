// adding 3D map from mapbox style 
mapboxgl.accessToken = 'pk.eyJ1IjoicmVtdXMtaCIsImEiOiJjbGNxd3EzeWUwMHhqM25wczN4c2ptZXMxIn0.5EiYWJX4GvtLPR4snGgTHA'; //Add default public map token from your Mapbox account
const map = new mapboxgl.Map({
container: 'map4', // div container ID 
style: 'mapbox://styles/remus-h/clg1ais10000n01rpb9lff9b3', // style URL
center: [-79.725, 43.885], // starting position [longitude, latitude]
zoom: 8.50, // starting zoom
bearing: -16.6, // compass bearing for map
pitch: 40, // tilt angle
}); 

const zoomThreshold = 10 // Setting the zoom threshold where by a transition from CSD to CT will occur

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