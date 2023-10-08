import { useContext } from 'react';
import CoordinatesContext from '../../providers/coordinates/coordinates.context';
import { useCoordinatesContext } from '../../providers/coordinates/coordinates.context';
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import AsyncSelect from 'react-select/async';
import { geoCoding } from '../map/functions/map.geocoding.js';
import { useMapContext } from '../../providers/mapbox/mapbox.context';
import { useMobileContext } from '../../providers/mobile/mobile.context';

import './input.styles.scss';

export const Input = ({ label, type }) => {
  const { corState, corDispatch } = useCoordinatesContext();
  const { mapState } = useMapContext();
  const { mobileDispatch } = useMobileContext();

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

  const getData = async event => {
    let data = [];
    const response = await geoCoding(event);

    if (response !== undefined) {
      data = response.features.map(x => {
        return { label: x.place_name, lat: x.geometry.coordinates[1], lng: x.geometry.coordinates[0] };
      });
    }
    return data;
  };

  return (
    <label className={`input__label`}>
      {type === 'mobile' ? '' : `${label}:`}
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={getData}
        className="input__box"
        onChange={handleChange}
        placeholder="Search Here..."
      />
    </label>
  );
};
