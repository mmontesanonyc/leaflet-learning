# leaflet-learning
Following along with [MapTiler's Leaflet tutorial](https://www.youtube.com/watch?v=wVnimcQsuwk) to learn [Leaflet](https://leafletjs.com/).

Here's what I've got:
- choro.html: this comes right from [Leaflet demos](https://leafletjs.com/examples/choropleth/) - a helpul way to grab some basics and figure out what's going on.
- index.html: just an initial approcach following other Leaflet demos, adding some map items.
- nyc.html: put in place some basic functionality, including toggling the neighborhood layer via the buttons.
- nyc-radio.html: same as above, but with radio button selectors in a 'legend' overlay
- nr-select: a mock up map selector that zooms and styles on click, delivers the `GEOCODE` to JS for later use, adds hash, and reads the hash to point to the hashed location. 

More things to try:
- Loop through a GeoJSON object (NYC neighborhoods) and add data to the GeoJSON - and display that as choro.

Types of maps I can imagine making:
- Geography selector - clicking on a neighborhood to get more information about it (basically already done, powered by `polySelect()`)
- Point selector - I think I can do this.
- Choropleth map - have a model
- Bubble map - could combine approaches with choro and data?
- [Custom zoom with home button](https://gis.stackexchange.com/questions/127286/home-button-leaflet-map)