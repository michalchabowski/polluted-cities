/* eslint-disable @typescript-eslint/camelcase */
import Axios from 'axios';
import moment from 'moment';

export interface Measurement {
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
    date_from: moment().subtract(2, 'days').format('YYYY-MM-DD'),
  },
}).then((response) => response.data.results);

export const fetchCities = async (countryCode: string): Promise<Measurement[]> => {
  const fillCities = async (cities: Measurement[], citiesNames: string[], page: number) => {
    const measurements = await fetchMeasurementsPage(countryCode, page);
    measurements.forEach((measurement) => {
      if (citiesNames.includes(measurement.city) || cities.length >= DEFAULT_CITIES_COUNT) return;
      cities.push(measurement);
      citiesNames.push(measurement.city);
    });
    if (cities.length < DEFAULT_CITIES_COUNT) {
      await fillCities(cities, citiesNames, page + 1);
    }
  };

  const cities: Measurement[] = [];
  const citiesNames: string[] = [];
  await fillCities(cities, citiesNames, 1);
  return cities;
};

export interface City {
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const fetchDescription = (city: string): Promise<string> => Axios.get('/wikipedia', {
  params: {
    city,
  },
}).then((response) => response.data.query.pages['73208'].extract);