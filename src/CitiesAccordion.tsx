import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const cities = [{
    name: 'Katowice',
    pm10: 45
}, {
    name: 'Rybnik',
    pm10: 43
}, {
    name: 'Tychy',
    pm10: 33
}, {
    name: 'Pszczyna',
    pm10: 23
}, {
    name: 'Żory',
    pm10: 13
}, {
    name: 'Bielsko-biała',
    pm10: 8
}, {
    name: 'Zakopane',
    pm10: 7
}, {
    name: 'Andrychów',
    pm10: 6
}, {
    name: 'Oświęcim',
    pm10: 6
}, {
    name: 'Warszawa',
    pm10: 6
}]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

export default function CitiesAccordion() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      {cities.map(city =>
        <ExpansionPanel expanded={expanded === city.name} onChange={handleChange(city.name)}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>{city.name}</Typography>
            <Typography className={classes.secondaryHeading}>{city.pm10 + 'um'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
    </div>
  );
}
