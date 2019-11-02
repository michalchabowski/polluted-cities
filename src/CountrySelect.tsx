/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

export default function CountrySelect() {
  const classes = useStyles();

  return (
    <Autocomplete
    //   style={{ width: auto }}
      options={countries}
      classes={{
        option: classes.option,
      }}
      autoHightlight
      getOptionLabel={(option: CountryType) => option.label}
      renderOption={(option: CountryType) => (
        <React.Fragment>
          <span>{countryToFlag(option.code)}</span>
          {option.label} ({option.code})
        </React.Fragment>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Choose a country"
          variant="outlined"
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'disabled', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

interface CountryType {
  code: string;
  label: string;
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries = [
  { code: 'PL', label: 'Poland' },
  { code: 'DE', label: 'Germany' },
  { code: 'ES', label: 'Spain' },
  { code: 'FR', label: 'France' },
];
