import nav from '../../../icon.png';

export function addMarker(map, coordinates) {
  // const layers = map.getStyle().layers;
  // const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field']).id;

  map.loadImage(nav, (error, image) => {
    if (error) throw error;
    map.addImage('custom-marker', image);
    // Add a GeoJSON source with 2 points
    map.addSource('nav', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            // feature for Mapbox DC
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates,
            },
            properties: {
              title: 'User Location',
            },
          },
        ],
      },
    });

    // Add a symbol layer
    map.addLayer({
      id: 'nav',
      type: 'symbol',
      source: 'nav',
      layout: {
        'icon-image': 'custom-marker',
        /*
        // get the title name from the source's "title" property
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.25],
        'text-anchor': 'top',
        */
      },
    });
  });
}

export function setMarker(map, coordinates) {
  // const layers = map.getStyle().layers;
  // const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field']).id;

  map.getSource('nav').setData({
    type: 'FeatureCollection',
    features: [
      {
        // feature for Mapbox DC
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
        properties: {
          title: 'User Location',
        },
      },
    ],
  });
}

export function removeMarker(map) {
  map.removeLayer('nav');
  map.removeSource('nav');
}
