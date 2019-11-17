/* eslint-disable @typescript-eslint/camelcase */
import Axios from 'axios';
import dayjs from 'dayjs';

// difference between city and measurement is slight in structure but huge in semantics.
// measurement means one value at a time,
// while city is more of an aggregate of measurements from one place.
export interface City {
  worstValue: number;
  unit: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface Measurement {
  value: number;
  unit: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const DEFAULT_CITIES_COUNT = 10;

const fetchMeasurementsPage = (countryCode: string, page: number): Promise<Measurement[]> => Axios.get('https://api.openaq.org/v1/measurements', {
  params: {
    country: countryCode,
    limit: 10,
    parameter: 'pm10',
    order_by: 'value',
    sort: 'desc',
    page,
    date_from: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
  },
}).then((response) => response.data.results);

// TODO to determine grouping by city we need accurate
export const fetchCities = async (countryCode: string): Promise<City[]> => {
  const fillCities = async (cities: City[], citiesNames: string[], page: number) => {
    const measurements = await fetchMeasurementsPage(countryCode, page);
    measurements.forEach((measurement) => {
      if (citiesNames.includes(measurement.city) || cities.length >= DEFAULT_CITIES_COUNT) return;
      cities.push({
        unit: measurement.unit,
        coordinates: measurement.coordinates,
        worstValue: measurement.value,
        name: measurement.city,
      });
      citiesNames.push(measurement.city);
    });
    if (cities.length < DEFAULT_CITIES_COUNT) {
      await fillCities(cities, citiesNames, page + 1);
    }
  };

  const cities: City[] = [];
  const citiesNames: string[] = [];
  await fillCities(cities, citiesNames, 1);
  return cities;
};

// TODO fetch description by city name and geocordinates. City name is not unique across the world.
export const fetchDescription = (city: string): Promise<string> => Axios.get('https://en.wikipedia.org/w/api.php', {
  params: {
    action: 'query',
    prop: 'extracts',
    format: 'json',
    titles: city,
    origin: '*',
  },
}).then((response) => {
  const { pages } = response.data.query;
  if (!Object.keys(pages).length) {
    return null;
  }
  const key = Object.keys(pages)[0];
  if (key === '-1') {
    return null;
  }
  return pages[key].extract;
});
