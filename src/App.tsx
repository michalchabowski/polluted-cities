import React, { useState } from 'react';
import './App.css';
import { Container, CssBaseline, CircularProgress } from '@material-ui/core';
import Axios from 'axios';
import moment from 'moment';
import CountrySelect from './CountrySelect';
import CitiesAccordion from './CitiesAccordion';

const countries = [
  { code: 'PL', label: 'Poland' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'FR', label: 'France' },
];

const fetchCities = (countryCode: string): Promise<Measurement[]> => Axios.get('https://api.openaq.org/v1/measurements', {
  params: {
    country: countryCode,
    limit: 10,
    parameter: 'pm10',
    order_by: 'value',
    sort: 'desc',
    page: 1,
    date_from: moment().subtract(30, 'days').format('YYYY-MM-DD'),
  },
}).then((response) => response.data.results);

export interface Measurement {
  value: number;
  unit: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const App: React.FC = () => {
  const [chosenCountryCode, setChosenCountryCode] = useState<string>('empty');
  const [countryCodeToCities, setCountryCodeToCities] = useState<{ [countryCode: string]: Measurement[] }>({ empty: [] });
  const [loading, setLoading] = useState<boolean>(false);

  const onCountryChange = (countryCode: string) => {
    setChosenCountryCode(countryCode);
    if (!countryCodeToCities[countryCode]) {
      setLoading(true);
      fetchCities(countryCode).then((cities) => {
        setCountryCodeToCities({
          ...countryCodeToCities,
          [countryCode]: cities,
        });
      }).finally(() => setLoading(false));
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" style={{ padding: '10px' }}>
        {/* <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }} /> */}
        <CountrySelect options={countries} onCountryChange={onCountryChange} />
        {loading ? <CircularProgress data-cy="main-loader" style={{ margin: '20px' }} /> : (
          <CitiesAccordion measurements={
          countryCodeToCities[chosenCountryCode] ? countryCodeToCities[chosenCountryCode] : []
        }
          />
        )}
      </Container>
    </>
  );
};


export default App;
