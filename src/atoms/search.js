import { useCallback } from "react";
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai";
import { atomWithImmer } from "jotai-immer";

const getCoordinates = async queryString => {
  const query = new URLSearchParams({
    q: queryString,
    limit: 5,
    debug: true,
    point: '42.31743,-83.02677',
    provider: 'default',
    key: import.meta.env.VITE_APP_API_KEY,
    bbox: [-83.139, 41.7252, -82.474, 42.4234],
  }).toString();

  const response = await fetch(`https://graphhopper.com/api/1/geocode?${query}`, { method: 'GET' });

  const result = await response.json();

  if (!("hits" in result) || result.hits.length === 0) {
    return [];
  }

  console.log("hits", result.hits);
  return result.hits.map(record => ({
    name: record.name,
    country: record.country,
    city: record.city,
    state: record.state,
    osmKey: record.osm_key,
    osmValue: record.osm_value,
    osmId: record.osm_id,
    lat: record.point.lat,
    lng: record.point.lng,
  }));
};

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

const searchStateAtom = atomWithImmer({
  state: "idle",
  error: null,
  data: null,
});

const searchDataAtom = atom((get) => get(searchStateAtom).data ?? []);
const resetSearchDataAtom = atom(
  null,
  (_get, set) => {
    set(searchStateAtom, (state) => {
      state.state = "idle";
      state.error = null;
      state.data = null;
    });
  },
);

export function useSearchData () {
  return useAtomValue(searchDataAtom);
}

export function useResetSearchData () {
  return useSetAtom(resetSearchDataAtom);
}

export function useGeoSearch() {
  const [state, setState] = useAtom(searchStateAtom);

  const trigger = useCallback(
    (inputValue) => {
      setState((state) => {
        state.state = "loading"
        state.data = null;
        state.error = null;
      });
      debouncedFetchGeoCoding(inputValue)
        .then((data) => {
          setState((state) => {
            state.state = "done";
            state.data = data;
            state.error = null;
          });
        })
        .catch((error) => {
          setState((state) => {
            state.state = "error"
            state.data = null;
            state.error = error;
          });
        });
    },
    [setState],
  );

  return [
    state,
    trigger,
  ]
}
