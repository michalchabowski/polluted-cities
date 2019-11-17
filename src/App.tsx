import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Container, CssBaseline, CircularProgress, makeStyles,
} from '@material-ui/core';
import CountrySelect from './CountrySelect';
import CitiesAccordion from './CitiesAccordion';
import { fetchCities, City } from './datasource';
import store from './store';

const countries = [
  { code: 'PL', label: 'Poland' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'FR', label: 'France' },
];

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  centeredLoader: {
    margin: '20px',
    textAlign: 'center',
    width: '100%',
  },
});

const CenteredLoader = () => {
  const classes = useStyles();
  return (
    <div className={classes.centeredLoader}>
      <CircularProgress data-cy="main-loader" />
    </div>
  );
};

const App: React.FC = () => {
  const classes = useStyles();
  const initialCountryCode = store.getCountryCode() || 'empty';
  const [chosenCountryCode, setChosenCountryCode] = useState(initialCountryCode);
  const [countryCodeToCities, setCountryCodeToCities] = useState<{[countryCode: string]: City[]}>({ empty: [] });
  const [loading, setLoading] = useState(false);
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
    store.setCountryCode(countryCode);
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
      <Container maxWidth="sm" className={classes.container}>
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
