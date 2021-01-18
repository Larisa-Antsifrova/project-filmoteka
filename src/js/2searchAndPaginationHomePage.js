const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const paginationBar = document.querySelector('.pagination');
const prevBtn = document.querySelector('#previous__page');
const firstPage = document.querySelector('.first__page');
const delimiter = document.querySelector('.delimiter');
const totalPage = document.querySelector('.total__page');
const nextBtn = document.querySelector('#next__page');
const lastPage = document.querySelector('.total__page');

const paginationBtn = [...document.getElementsByClassName('spread__page')];

// глобальная переменная inputVaue
let inputVaue = '';

// слушатели событий
searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);
firstPage.addEventListener('click', getFirstPage);
delimiter.addEventListener('click', renderPageOnNumBtn);
prevBtn.addEventListener('click', paginationNavigation);
nextBtn.addEventListener('click', paginationNavigation);
lastPage.addEventListener('click', getLastPage);

// функции
// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  disabledPrevBtn();
  inputVaue = e.target.elements.query.value;
  toggleRenderPage();
}
// функция рендера страницы запроса
function fetchFilms(pageNumber, inputVaue) {
  let query = '';
  if (inputVaue.length > 0 && inputVaue.trim() !== '') {
    query = inputVaue.trim();
  } else {
    return;
  }

  movieApi
    .fetchSearchFilmsList(query)
    .then(createGallery)
    .then(fragment => renderGallery(fragment, homePageRef));
}
// функция отображения страниц зарпосов
function paginationNavigation(e) {
  const activeBtn = e.currentTarget.id;
  if (activeBtn === 'previous__page') {
    movieApi.decrementPage();
    disabledPrevBtn();
    clearHomePage();
    toggleRenderPage();
  }

  if (activeBtn === 'next__page') {
    movieApi.incrementPage();
    if (movieApi.pageNumber > 1) {
      prevBtn.removeAttribute('disabled');
    }
    clearHomePage();
    toggleRenderPage();
  }
}
// функция выбора отображения страницы в зависимости от наличия текстa в инпуте
function toggleRenderPage() {
  if (inputVaue.length === 0) {
    renderPopularMoviesList();
    renderFilms = movieApi.fetchPopularMoviesList();
  } else {
    fetchFilms(movieApi.pageNumber, inputVaue);
    renderFilms = movieApi.fetchSearchFilmsList(inputVaue);
  }
}
// функция очистки инпута и параграфа ошибки при фокусе
function onInputFocus() {
  clearError();
  clearInput();
  movieApi.resetPage();
}
//  функция дезактивации кнопки prevBtn если номер страницы 1
function disabledPrevBtn() {
  if (movieApi.pageNumber < 6) {
    prevBtn.setAttribute('disabled', '');
  } else {
    prevBtn.removeAttribute('disabled');
  }
}
// функция перехода на первую страницу
function getFirstPage() {
  movieApi.pageNumber = 1;
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
}
// функция перехода на последнюю страницу
function getLastPage() {
  movieApi.pageNumber = movieApi.totalPages;
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
}
// функция очистки инпута и запроса
function clearInput() {
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
  inputVaue = '';
}
// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = 'visible';
  const timeOfVisibleError = setTimeout(clearError, 2000);
  clearInput();
  movieApi.resetPage();
  disabledPrevBtn();
  return renderPopularMoviesList();
}
// функция сокрытия строки ошибки
function clearError() {
  errorArea.style.visibility = 'hidden';
}
// функция очистки стартовой страницы
function clearHomePage() {
  homePageRef.innerHTML = '';
}
// функция c кнопки "next" в ответ на рендер
function deactivationBtnNext(params) {
  if (params.results.length < movieApi.perPage || params.total_pages < 5) {
    nextBtn.setAttribute('disabled', '');
  } else {
    nextBtn.removeAttribute('disabled');
  }
}
// функция дезактивации кнопок пагинации в ответ на рендер
function deactivationPaginationBtn(params) {
  if (
    params.total_pages < 5 ||
    params.total_pages === movieApi.pageNumber ||
    movieApi.pageNumber >= movieApi.totalPages - 4
  ) {
    paginationBtn.map(e => {
      if (e.textContent > params.total_pages) {
        e.setAttribute('disabled', '');
      } else {
        e.removeAttribute('disabled');
      }
    });
  } else {
    paginationBtn.map(e => e.removeAttribute('disabled'));
  }
}
// функция рендера содержимого группы кнопок пагинации
function createPaginationMarkup(resp) {
  paginationBtn.map(e => {
    e.textContent = resp.page++;
  });
}
// функция отзыва кнопок и рендера страницы по номеру кнопки
function renderPageOnNumBtn(evt) {
  movieApi.pageNumber = evt.target.textContent;
  deactivationPaginationBtn(evt);
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
}

// PAGINATION with MATERIALIZE
// References
const paginationRefs = {
  paginationPageItemsContainerRef: document.querySelector('.pagination-page-items-container'),
  paginationToBeginningBtnRef: document.querySelector('.pagination-beginning'),
  paginationPreviousPageRef: document.querySelector('.pagination-previous-page'),
  paginationNextPageRef: document.querySelector('.pagination-next-page'),
  paginationToEndBtnRef: document.querySelector('.pagination-end'),
};

// Destructuring references
const {
  paginationPageItemsContainerRef,
  paginationToBeginningBtnRef,
  paginationPreviousPageRef,
  paginationNextPageRef,
  paginationToEndBtnRef,
} = paginationRefs;

// Variables common to some functions
const totalPages = 7;
const displayNumber = 5;
let lowRange = 1;
let upRange = totalPages > displayNumber ? lowRange + displayNumber - 1 : totalPages;
let currentActivePage = null;
console.log('Global currentActivePage', currentActivePage);
console.log('Global', lowRange, upRange);

// Event Listeners
paginationPageItemsContainerRef.addEventListener('click', e => {
  movieApi.pageNumber = e.target.dataset.page;
  console.log('Container Page Number: ', movieApi.pageNumber);
  console.log('Container Target: ', e.target);
});

paginationToBeginningBtnRef.addEventListener('click', goToBeginning);

paginationToEndBtnRef.addEventListener('click', goToEnd);

paginationNextPageRef.addEventListener('click', e => {
  console.log(' movieApi.pageNumber in Next Page', movieApi.pageNumber);
  console.log('Nex Page listener', currentActivePage.dataset.page);

  movieApi.pageNumber += 1;

  if (movieApi.pageNumber === totalPages) {
    paginationToEndBtnRef.classList.add('disabled');
    paginationNextPageRef.classList.add('disabled');
    movieApi.pageNumber = totalPages;
  }

  if (movieApi.pageNumber > upRange) {
    console.log('You cannot see me');
    lowRange = upRange + 1;
    upRange = totalPages > displayNumber ? lowRange + displayNumber - 1 : totalPages;
    console.log('low and up inside condition: ', lowRange, upRange);

    clearPaginationPageItems();
    renderPaginationPageItems();
  }

  const paginationPageItems = paginationPageItemsContainerRef.querySelectorAll('li');
  const activeTarget = [...paginationPageItems].find(node => node.dataset.page == movieApi.pageNumber);
  currentActivePage.classList.remove('active');
  activeTarget.classList.add('active');
  currentActivePage = activeTarget;
  console.log('Nex Page listener', currentActivePage.dataset.page);
});

// Functions
function createPaginationPageItemsMarkup() {
  let paginationPageItemsMarkup = '';
  for (let i = lowRange; i <= upRange; i++) {
    paginationPageItemsMarkup += `<li class="waves-effect" data-page ='${i}'>
              <a href="#!" class="paginator-page-item" data-page ='${i}'>${i}</a>
            </li>`;
  }
  return paginationPageItemsMarkup;
}

function renderPaginationPageItems() {
  const paginationPageItemsMarkup = createPaginationPageItemsMarkup();
  paginationPageItemsContainerRef.insertAdjacentHTML('afterbegin', paginationPageItemsMarkup);

  if (movieApi.pageNumber === 1) {
    paginationToBeginningBtnRef.classList.add('disabled');
    paginationPreviousPageRef.classList.add('disabled');

    paginationToEndBtnRef.classList.remove('disabled');
    paginationNextPageRef.classList.remove('disabled');
  }

  if (movieApi.pageNumber === totalPages) {
    paginationToEndBtnRef.classList.add('disabled');
    paginationNextPageRef.classList.add('disabled');

    paginationToBeginningBtnRef.classList.remove('disabled');
    paginationPreviousPageRef.classList.remove('disabled');
  }

  const paginationPageItems = paginationPageItemsContainerRef.querySelectorAll('li');
  const activeTarget = [...paginationPageItems].find(node => node.dataset.page == movieApi.pageNumber);
  activeTarget.classList.add('active');
  currentActivePage = activeTarget;
}

function clearPaginationPageItems() {
  paginationPageItemsContainerRef.innerHTML = '';
}

function goToBeginning() {
  console.log('You want to go to the very beginning');
  movieApi.pageNumber = 1;
  lowRange = 1;
  upRange = totalPages > displayNumber ? lowRange + displayNumber - 1 : totalPages;

  clearPaginationPageItems();
  renderPaginationPageItems();

  paginationToBeginningBtnRef.classList.add('disabled');
  paginationPreviousPageRef.classList.add('disabled');

  paginationToEndBtnRef.classList.remove('disabled');
  paginationNextPageRef.classList.remove('disabled');

  const paginationPageItems = paginationPageItemsContainerRef.querySelectorAll('li');
  const activeTarget = [...paginationPageItems].find(node => node.dataset.page == movieApi.pageNumber);
  activeTarget.classList.add('active');
  currentActivePage = activeTarget;

  // console.log('currentActivePage in Beginning, ', currentActivePage);
  // console.log('currentPageRef in Beginning, ', paginationPageItems);
  // console.log('Current page Ref ', activeTarget);
}

function goToEnd() {
  console.log('You want to go to the very end');
  movieApi.pageNumber = totalPages;
  upRange = totalPages;
  lowRange = totalPages > 5 ? upRange - displayNumber + 1 : 1;

  clearPaginationPageItems();
  renderPaginationPageItems();

  paginationToEndBtnRef.classList.add('disabled');
  paginationNextPageRef.classList.add('disabled');

  paginationToBeginningBtnRef.classList.remove('disabled');
  paginationPreviousPageRef.classList.remove('disabled');

  const paginationPageItems = paginationPageItemsContainerRef.querySelectorAll('li');
  const activeTarget = [...paginationPageItems].find(node => node.dataset.page == movieApi.pageNumber);
  activeTarget.classList.add('active');
  currentActivePage = activeTarget;

  // console.log('currentActivePage in End, ', currentActivePage);
  // console.log('currentPageRef in End, ', paginationPageItems);
  // console.log('Current page Ref ', activeTarget);
}

// Evoking funcitons
renderPaginationPageItems();
