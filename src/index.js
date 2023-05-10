import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputElement = document.querySelector('#search-box');
const listElement = document.querySelector('.country-list');
const infoElement = document.querySelector('.country-info');

function createMarkupForList(arr) {
  return arr
    .map(listElem => {
      return `<li class="list-item"><img width="25" 
      src="${listElem.flags.png}" 
      alt="${listElem.flags.alt}" /> 
      <span>${listElem.name.common}</span>
      </li>`;
    })
    .join('');
}

function createMarkupForCountry(arr) {
  return arr.map(el => {
    return `<div class="country">
        <img width="50" src="${el.flags.png}" alt="${el.flags.alt}" />
        <span class="country-name">${el.name.common}</span>
      </div>
      <p class="text"> Capital: ${el.capital}</p>
      <p class="text"> Population: ${el.population}</p>
      <p class="text"> Languages: ${Object.values(el.languages).join(', ')}</p>`;
  });
}
function clear() {
  listElement.innerHTML = '';
  infoElement.innerHTML = '';
}
inputElement.addEventListener(
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
            'Пожалуйста, введите более конкретное имя.'
          );
        }
        if (data.length >= 2 && data.length <= 10) {
          const List = createMarkupForList(data);
          listElement.innerHTML = List;
        }

        if (data.length === 1) {
          const Info = createMarkupForCountry(data);
          infoElement.innerHTML = Info;
        }
      })
      .catch(err => {
        Notiflix.Notify.failure('Ой, нет страны с таким названием');
        clear();
      });
  }, DEBOUNCE_DELAY)
);