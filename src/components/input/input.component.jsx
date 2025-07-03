import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncSelect from 'react-select/async';

import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { useMobileContext } from '../../providers/mobile/mobile.context';
import { getCoordinates } from '../graphhopper/graphhopper.component';

import './input.styles.scss';

/**
 * Very simple 1 sec promised based debounce function
 **/
function debounce(fn) {
  let id = null;
  return (...args) => {
    if (id != null) {
      clearTimeout(id);
    }
    return new Promise((resolve) => {
      id = setTimeout(() => {
        resolve(fn(...args));
      }, 1000);
    });
  };
}

async function fetchGeoCoding(input, state) {
  return await getCoordinates(input, state);
};

// This is to prevent a geolocation request to be sent out for
// each key press made by the user
const debouncedFetchGeoCoding = debounce(fetchGeoCoding);

export const Input = ({ label, type, placeholder }) => {
  const { corState, corDispatch } = useCoordinatesContext();
  const { mapState } = useMapContext();
  const { mobileDispatch } = useMobileContext();
  const [location, setLocation] = useState(null);

  async function handleChange(event) {
    if (label === 'end' && type === 'mobile') {
      mapState.flyTo({
        duration: 4000,
        center: [event.lng, event.lat],
        zoom: 16,
      });

      mobileDispatch('details');
    }

    await corDispatch({
      field: label.toLowerCase().replace(' ', '_'),
      lat: event.lat,
      lng: event.lng,
      location: event.label,
    });
  }

  const getData = useCallback(
    (inputString) => {
      return debouncedFetchGeoCoding(inputString, corState);
    },
    [corState]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation({ lat, lng });
      });
    }
  }, [setLocation]);

  const defaultOptions = useMemo(
    () => {
      if (location == null) {
        return [];
      }
      return [
        {
          label: "Current Location",
          lat: location.lat,
          lng: location.lng,
        },
      ];
    },
    [location],
  );

  return (
    <label className="input__label">
      {type === 'mobile' ? '' : `${label}:`}
      <AsyncSelect
        cacheOptions={true}
        isClearable={false}
        defaultOptions={defaultOptions}
        loadOptions={getData}
        className="input__box"
        onChange={handleChange}
        placeholder={placeholder ? placeholder : 'Search Here...'}
      />
    </label>
  );
};
