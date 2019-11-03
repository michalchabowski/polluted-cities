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
  const [message, setMessage] = useState<string | null>();

  const fetchCitiesInternal = (countryCode: string) => {
    if (countryCode === 'empty') return;
    setMessage(null);
    setLoading(true);
    fetchCities(countryCode).then((cities) => {
      setCountryCodeToCities({
        ...countryCodeToCities,
        [countryCode]: cities,
      });
    }).catch(() => setMessage('We\'re sorry. Data is unavailable')).finally(() => setLoading(false));
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

  const mainContent = (() => {
    if (loading) return <CircularProgress data-cy="main-loader" style={{ margin: '20px' }} />;
    if (message) return <div>{message}</div>;
    return (
      <CitiesAccordion measurements={
        countryCodeToCities[chosenCountryCode] ? countryCodeToCities[chosenCountryCode] : []
      }
      />
    );
  })();

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" style={{ padding: '10px' }}>
        <CountrySelect
          options={countries}
          onCountryChange={onCountryChange}
          chosenCountryCode={chosenCountryCode}
        />
        {mainContent}
      </Container>
    </>
  );
};


export default App;
