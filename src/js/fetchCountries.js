import Notiflix from 'notiflix';

export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';
  const END_POINT = '/name';
  const PARAMS = `/${name}?fields=name,capital,population,flags,languages`;
  let url = BASE_URL + END_POINT + PARAMS;
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error();
    }
    return res.json();
  });
}