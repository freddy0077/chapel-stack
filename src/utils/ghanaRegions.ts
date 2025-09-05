// Ghana Regions Utility
// This utility provides a list of all 16 regions in Ghana for use in forms

export interface GhanaRegion {
  code: string;
  name: string;
  capital: string;
}

export const GHANA_REGIONS: GhanaRegion[] = [
  { code: "AH", name: "Ashanti", capital: "Kumasi" },
  { code: "BA", name: "Brong-Ahafo", capital: "Sunyani" },
  { code: "CP", name: "Central", capital: "Cape Coast" },
  { code: "EP", name: "Eastern", capital: "Koforidua" },
  { code: "AA", name: "Greater Accra", capital: "Accra" },
  { code: "NP", name: "Northern", capital: "Tamale" },
  { code: "UE", name: "Upper East", capital: "Bolgatanga" },
  { code: "UW", name: "Upper West", capital: "Wa" },
  { code: "TV", name: "Volta", capital: "Ho" },
  { code: "WP", name: "Western", capital: "Sekondi-Takoradi" },
  { code: "AF", name: "Ahafo", capital: "Goaso" },
  { code: "BE", name: "Bono East", capital: "Techiman" },
  { code: "BO", name: "Bono", capital: "Sunyani" },
  { code: "NE", name: "North East", capital: "Nalerigu" },
  { code: "OT", name: "Oti", capital: "Dambai" },
  { code: "SV", name: "Savannah", capital: "Damongo" },
  { code: "WN", name: "Western North", capital: "Sefwi Wiawso" },
];

// Hook for easy use in React components
export const useGhanaRegions = () => {
  return {
    regions: GHANA_REGIONS,
    getRegionByCode: (code: string) =>
      GHANA_REGIONS.find((region) => region.code === code),
    getRegionByName: (name: string) =>
      GHANA_REGIONS.find((region) => region.name === name),
    getRegionOptions: () =>
      GHANA_REGIONS.map((region) => ({
        value: region.name,
        label: region.name,
        code: region.code,
        capital: region.capital,
      })),
  };
};

// Simple function to get region options for select dropdowns
export const getGhanaRegionOptions = () => {
  return GHANA_REGIONS.map((region) => ({
    value: region.name,
    label: region.name,
  }));
};

export default GHANA_REGIONS;
