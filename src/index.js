import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

function createMarkupForList(arr) {
  return arr
    .map(listElem => {
      return `<li class="list-item"><img width="25" src="${listElem.flags.png}" alt="${listElem.flags.alt}" /> <span>${listElem.name.common}</span></li>`;
    })
    .join('');
}

function createMarkupForCountry(arr) {
  return arr.map(el => {
    return `<div class="country">
        <img width="50" src="${el.flags.png}" alt="${el.flags.alt}" />
        <span class="country-name">${el.name.common}</span>
      </div>
      <p>Capital: ${el.capital}</p>
      <p>Population: ${el.population}</p>
      <p>Languages: ${Object.values(el.languages).join(', ')}</p>`;
  });
}
function clear() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
inputEl.addEventListener(
  'input',
  debounce(e => {
    const inputValue = e.target.value.trim();
    if (inputValue === '') {
      clear();
      return;
    }
    fetchCountries(inputValue)
      .then(data => {
        clear();
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (data.length >= 2 && data.length <= 10) {
          const markupList = createMarkupForList(data);
          listEl.innerHTML = markupList;
        }

        if (data.length === 1) {
          const markupInfo = createMarkupForCountry(data);
          infoEl.innerHTML = markupInfo;
        }
      })
      .catch(err => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clear();
      });
  }, DEBOUNCE_DELAY)
);