export default {
  setCountryCode(countryCode: string) {
    window.localStorage.setItem('countryCode', countryCode);
  },
  getCountryCode() {
    return window.localStorage.getItem('countryCode');
  },
};
