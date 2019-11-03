import React, { useState, useEffect } from 'react';
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
  const initialCountryCode = window.localStorage.getItem('countryCode') || 'empty';
  const [chosenCountryCode, setChosenCountryCode] = useState<string>(initialCountryCode);
  const [countryCodeToCities, setCountryCodeToCities] = useState<{ [countryCode: string]: Measurement[] }>({ empty: [] });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCitiesInternal = (countryCode: string) => {
    if (countryCode === 'empty') return;
    setLoading(true);
    fetchCities(countryCode).then((cities) => {
      setCountryCodeToCities({
        ...countryCodeToCities,
        [countryCode]: cities,
      });
    }).finally(() => setLoading(false));
  };

  const onCountryChange = (countryCode: string) => {
    setChosenCountryCode(countryCode);
    window.localStorage.setItem('countryCode', countryCode);
    if (!countryCodeToCities[countryCode]) {
      fetchCitiesInternal(countryCode);
    }
  };

  useEffect(() => {
    fetchCitiesInternal(initialCountryCode);
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" style={{ padding: '10px' }}>
        <CountrySelect options={countries} onCountryChange={onCountryChange} chosenCountryCode={chosenCountryCode} />
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
