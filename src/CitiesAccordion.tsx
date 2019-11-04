import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CircularProgress } from '@material-ui/core';
import { City, fetchDescription } from './datasource';

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
  listDesc: {
    padding: '20px',
    textAlign: 'left',
  },
}));

const ListDescription = () => {
  const classes = useStyles();
  return (
    <div className={classes.listDesc}>
      <Typography className={classes.heading}>
        The list below contains 10 cities that noted worst air quality
        measured by pm10 value in last 3 days
      </Typography>
    </div>
  );
};

interface CitiesAccordionProps {
  cities: City[];
}

export default function CitiesAccordion({ cities }: CitiesAccordionProps) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [loading, setLoading] = React.useState<string | false>(false);
  const [descriptions, setDescriptions] = React.useState<{ [key: string]: string }>({});

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
      {cities.length > 0 && <ListDescription />}
      {cities.map((city) => (
        <ExpansionPanel
          expanded={expanded === city.name}
          onChange={handleCityClick(city.name)}
          key={city.name}
        >
          <ExpansionPanelSummary
            expandIcon={loading === city.name ? <CircularProgress /> : <ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            data-cy={`accordion-item-${city.name}`}
          >
            <Typography className={classes.heading}>{city.name}</Typography>
            <Typography className={classes.secondaryHeading}>{`${Math.round(city.worstValue)} ${city.unit}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails data-cy={`accordion-content-${city.name}`}>
            <div dangerouslySetInnerHTML={{ __html: descriptions[city.name] }} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}
