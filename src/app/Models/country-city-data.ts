export interface CountryCityMap {
    [countryCode: string]: string[];
  }
  
  // Countries list
  export const countries = [
    // { name: 'Select a country', code: '' },
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    // Add more countries as needed
  ];
  
  // Country-city mapping
  export const citiesByCountry: CountryCityMap = {
    'US': ['New York', 'Los Angeles', 'Chicago'],
    'CA': ['Toronto', 'Vancouver', 'Montreal'],
    'UK': ['London', 'Manchester', 'Birmingham'],
    // Add more country-city mappings as needed
  };