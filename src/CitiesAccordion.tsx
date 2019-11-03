import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CircularProgress } from '@material-ui/core';
import { Measurement, fetchDescription } from './datasource';

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
          [cityName]: description || "We're sorry. City description is not available",
        });
      }).finally(() => setLoading(false));
    }
    setExpanded(isExpanded ? cityName : false);
  };

  return (
    <div className={classes.root}>
      {measurements.map((measurement) => (
        <ExpansionPanel expanded={expanded === measurement.city} onChange={handleCityClick(measurement.city)} key={measurement.city}>
          <ExpansionPanelSummary
            expandIcon={loading === measurement.city ? <CircularProgress /> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            data-cy={`accordion-item-${measurement.city}`}
          >
            <Typography className={classes.heading}>{measurement.city}</Typography>
            <Typography className={classes.secondaryHeading}>{`${measurement.value} ${measurement.unit}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails data-cy={`accordion-content-${measurement.city}`}>
            <div dangerouslySetInnerHTML={{ __html: descriptions[measurement.city] }} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}
