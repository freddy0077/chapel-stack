// Ghana Country Utility
// This utility provides Ghana as the only country option for forms

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const GHANA_COUNTRY: Country = {
  code: 'GH',
  name: 'Ghana',
  flag: '🇬🇭',
  dialCode: '+233'
};

// Hook for easy use in React components
export const useGhanaCountry = () => {
  return {
    country: GHANA_COUNTRY,
    getCountryOption: () => ({
      value: GHANA_COUNTRY.name,
      label: GHANA_COUNTRY.name,
      code: GHANA_COUNTRY.code,
      flag: GHANA_COUNTRY.flag,
      dialCode: GHANA_COUNTRY.dialCode
    })
  };
};

// Simple function to get country option for select dropdowns
export const getGhanaCountryOption = () => {
  return {
    value: GHANA_COUNTRY.name,
    label: GHANA_COUNTRY.name
  };
};

// Function to get country options array (for consistency with other utilities)
export const getGhanaCountryOptions = () => {
  return [getGhanaCountryOption()];
};

export default GHANA_COUNTRY;
