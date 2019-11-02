import React from 'react';
import './App.css';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CountrySelect from './CountrySelect';
import CitiesAccordion from './CitiesAccordion';


const App: React.FC = () => (
  <>
    <CssBaseline />
    <Container maxWidth="sm" style={{ padding: '10px' }}>
      {/* <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '100vh' }} /> */}
      <CountrySelect />
      <CitiesAccordion />
    </Container>
  </>
);

export default App;
