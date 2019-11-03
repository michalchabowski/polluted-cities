import React, { useState } from 'react';
import './App.css';
import { Container, CssBaseline, CircularProgress } from '@material-ui/core';
import CountrySelect from './CountrySelect';
import CitiesAccordion from './CitiesAccordion';
import { fetchCities, Measurement } from './datasource';

const countries = [
  { code: 'PL', label: 'Poland' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'FR', label: 'France' },
];

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
