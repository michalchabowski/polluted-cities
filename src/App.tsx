import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, CssBaseline, CircularProgress } from '@material-ui/core';
import CountrySelect from './CountrySelect';
import CitiesAccordion from './CitiesAccordion';
import { fetchCities, City } from './datasource';

const countries = [
  { code: 'PL', label: 'Poland' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'FR', label: 'France' },
];

const CenteredLoader = () => (
  <div style={{ textAlign: 'center', width: '100%' }}>
    <CircularProgress data-cy="main-loader" style={{ margin: '20px' }} />
  </div>
);

const App: React.FC = () => {
  const initialCountryCode = window.localStorage.getItem('countryCode') || 'empty';
  const [chosenCountryCode, setChosenCountryCode] = useState<string>(initialCountryCode);
  const [countryCodeToCities, setCountryCodeToCities] = useState<{[countryCode: string]: City[]}>({ empty: [] });
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
    if (loading) {
      return <CenteredLoader />;
    }
    if (message) return <div>{message}</div>;
    return (
      <CitiesAccordion cities={
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
