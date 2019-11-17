/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode: string): string {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
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
  // css override styles. width 100% from MuiInputBase-input caused wrapping clear button
  // this only shows in production build where css evaluation order changes
  textInputOverride: {
    width: 0,
    flexGrow: 1,
  },
});

interface CountryType {
  code: string;
  label: string;
}

interface CountrySelectProps {
  onCountryChange: (countryCode: string) => void;
  options: CountryType[];
  chosenCountryCode: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  options,
  onCountryChange,
  chosenCountryCode,
}) => {
  const classes = useStyles();
  const chosenOption = options.find((countryType) => countryType.code === chosenCountryCode);

  const renderOption = (option: CountryType) => (
    <>
      <span>{countryToFlag(option.code)}</span>
      {`${option.label} (${option.code})`}
    </>
  );

  return (
    <Autocomplete
      options={options}
      classes={{
        option: classes.option,
        input: classes.textInputOverride,
      }}
      autoHightlight
      getOptionLabel={(option: CountryType) => option.label}
      renderOption={renderOption}
      renderInput={(params) => (
        <TextField
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...params}
          label="Choose a country"
          variant="outlined"
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'disabled', // disable autocomplete and autofill
          }}
          data-cy="country-input"
        />
      )}
      value={(chosenOption)}
      onChange={(e, value) => {
        onCountryChange(value ? value.code : 'empty');
      }}
    />
  );
};

export default CountrySelect;
