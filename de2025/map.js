// Initialize the map
const map = L.map('map').setView([40.700142, -73.921546],11);

// Add a basemap
L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dwIJ8hO2KsTMegUfEpYE',{
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

// FETCH TOPOJSON: Currently using CD.topo.json

// FETCH DATA: Currently, using data.js, which includes a variable, attributeData, that is the data object pass into renderMap()

// --- Convert TopoJSON to GeoJSON ---
const geojson = topojson.feature(topojsonData, topojsonData.objects.collection);

// --- Create a lookup for data and attributes ---
const dataLookup = {};
attributeData.forEach(item => {
  dataLookup[item.GeoID] = item;  // store whole record for easier access
});

// --- Attach the data to each feature of topo.json ---
geojson.features.forEach(feature => {
  const geoID = feature.properties.GEOCODE;
  const matchedData = dataLookup[geoID];
  if (matchedData) {
    feature.properties.dataValue = matchedData.Value;
    feature.properties.geographyName = matchedData.Geography;
  } else {
    feature.properties.dataValue = null;
    feature.properties.geographyName = feature.properties.GEONAME;
  }
});

// --- Find the min and max values in your dataset ---
const values = attributeData.map(d => d.Value).filter(v => v !== null && v !== undefined);
const minValue = Math.min(...values);
const maxValue = Math.max(...values);

// --- Create the color scale ---
const colorScale = d3.scaleSequential()
    .domain([maxValue, minValue])  // adjust as needed, maybe flip if you want colors reversed
    .interpolator(d3.interpolateViridis);

// --- Define style function using the color scale ---
function styleFeature(feature) {
    const value = feature.properties.dataValue;
    return {
      fillColor: value != null ? colorScale(value) : '#ccc',  // gray if no data
      weight: 0.35,
      color: 'black',
      fillOpacity: 0.8
    };
  }
  
  // --- Add the GeoJSON to the map ---
  L.geoJson(geojson, {
    style: styleFeature,
    onEachFeature: function(feature, layer) {
      layer.bindPopup(createPopupContent(feature.properties));
    }
  }).addTo(map);

// --- Function to create popup content ---
function createPopupContent(properties) {
    const name = properties.geographyName;
    const value = properties.dataValue;
    return `
      <div class="popup-content">
        <h4>${name}</h4>
        <p><strong>Value:</strong> ${value !== null ? value : 'No data'}</p>
      </div>
    `;
  }
  
