import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { Measurement } from './App';

const cities = [{
  name: 'Guadalajara',
  pm10: 45,
}, {
  name: 'Rybnik',
  pm10: 43,
}, {
  name: 'Tychy',
  pm10: 33,
}, {
  name: 'Pszczyna',
  pm10: 23,
}, {
  name: 'Żory',
  pm10: 13,
}, {
  name: 'Bielsko-biała',
  pm10: 8,
}, {
  name: 'Zakopane',
  pm10: 7,
}, {
  name: 'Andrychów',
  pm10: 6,
}, {
  name: 'Oświęcim',
  pm10: 6,
}, {
  name: 'Warszawa',
  pm10: 6,
}];

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const fetchDescription = async (cityName: string) => axios.get('/wikipedia', {
  params: {
    cityName,
  },
}).then((response) => response.data.query.pages['73208'].extract);

interface CitiesAccordionProps {
  measurements: Measurement[];
}

export default function CitiesAccordion({ measurements }: CitiesAccordionProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [loading, setLoading] = React.useState<string | false>(false);
  const [descriptions, setDescriptions] = React.useState<{[key: string]: string}>({});

  const handleCityClick = (cityName: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    if (loading === cityName) {
      setLoading(false);
    }
    if (loading === false && !descriptions[cityName]) {
      setLoading(cityName);
      fetchDescription(cityName).then((description) => {
        setDescriptions({
          ...descriptions,
          [cityName]: description,
        });
      }).finally(() => setLoading(false));
    }
    setExpanded(isExpanded ? cityName : false);
  };

  return (
    <div className={classes.root}>
      {measurements.map((measurement) => (
        <ExpansionPanel expanded={expanded === measurement.city} onChange={handleCityClick(measurement.city)}>
          <ExpansionPanelSummary
            expandIcon={loading === measurement.city ? <CircularProgress /> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            data-cy={`accordion-${measurement.city}`}
          >
            <Typography className={classes.heading}>{measurement.city}</Typography>
            <Typography className={classes.secondaryHeading}>{`${measurement.value} ${measurement.unit}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails data-cy={`accordion-${measurement.city}-desc`}>
            <Typography>
              <div dangerouslySetInnerHTML={{ __html: descriptions[measurement.city] }} />
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}
