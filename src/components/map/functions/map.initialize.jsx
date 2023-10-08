import mapboxgl from 'mapbox-gl';

export const initilize = async (mapState, mapDispatch, mapContainer, center) => {
  if (mapState) return; // initialize map only once
  await mapDispatch(
    new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    })
  );
  /*
  await mapDispatch({
    type: "UPDATE",
    payload: {
      value: new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: center,
        zoom: 16,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      }),
    },
  });
  */
};
