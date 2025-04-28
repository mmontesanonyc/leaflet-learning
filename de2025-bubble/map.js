// Initialize the map
const map = L.map('map').setView([40.700142, -73.921546], 11);

// Add a basemap
L.tileLayer('https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dwIJ8hO2KsTMegUfEpYE',{
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright/" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

// --- Convert TopoJSON to GeoJSON ---
const geojson = topojson.feature(topojsonData, topojsonData.objects.collection);

// --- Create a lookup for data and attributes ---
const dataLookup = {};
attributeData.forEach(item => {
  dataLookup[item.GeoID] = item;  // store the full record
});

// --- Attach data to each feature ---
geojson.features.forEach(feature => {
  const geoID = feature.properties.GEOCODE;
  const matchedData = dataLookup[geoID];
  if (matchedData) {
    feature.properties = {
      ...feature.properties,  // keep original properties
      ...matchedData          // add all fields from matchedData
    };
  } else {
    feature.properties.dataValue = null;
  }
});

// --- Find min and max values ---
const values = attributeData.map(d => d.Value).filter(v => v != null);
const minValue = Math.min(...values);
const maxValue = Math.max(...values);

// --- Create the inverted Viridis color scale ---
const colorScale = d3.scaleSequential()
    .domain([maxValue, minValue])  // ✅ Inverted: max first, min second
    .interpolator(d3.interpolateViridis);

// --- Create a radius scale (adjust these numbers to taste) ---
const radiusScale = d3.scaleSqrt()
    .domain([minValue, maxValue])
    .range([4, 20]);  // bubbles between 4px and 20px radius

// --- Define style for the polygons (light gray overlay) ---
function styleFeature(feature) {
  return {
    fillColor: '#eee',
    weight: 1,
    color: '#999',
    fillOpacity: 0.3
  };
}

// --- Function to create popup content ---
function createPopupContent(properties) {
  return `
    <div class="popup-content">
      <strong>${properties.Geography}</strong>
      <hr>
      <em>Asthma ED visits (age 5 to 17)</em>: in <strong>${properties.TimePeriod || 'Unknown'}</strong>, the estimated annual rate was <strong>${properties.Value}</strong> per 10,000.
      <span style="font-size:12px">${properties.Note && properties.Note.length > 1 ? `<hr><em>Note:</em> ${properties.Note}` : ''}</span>
    </div>
  `;
}

// --- Add the GeoJSON overlay (in light gray) ---
L.geoJson(geojson, {
  style: styleFeature,
  onEachFeature: function(feature, layer) {
    layer.bindPopup(createPopupContent(feature.properties));
  }
}).addTo(map);

// --- Add bubbles on top ---
attributeData.forEach(item => {
  if (item.Lat != null && item.Long != null && item.Value != null) {
    const latlng = [item.Lat, item.Long];
    const circle = L.circleMarker(latlng, {
      radius: radiusScale(item.Value),
      fillColor: colorScale(item.Value),
      color: '#333',  // optional: dark stroke
      weight: 1,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map);

    circle.bindPopup(createPopupContent(item));
  }
});
