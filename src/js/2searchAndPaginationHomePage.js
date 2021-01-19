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
  movieApi.pageNumber = +movieApi.totalPages;
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
  movieApi.pageNumber = +evt.target.textContent;
  deactivationPaginationBtn(evt);
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
}

// PAGINATION with MATERIALIZE
// References
class PaginationApi {
  constructor() {
    this.paginationContainerRef = document.querySelector('.pagination-container');
    this.paginationPageItemsContainerRef = document.querySelector('.pagination-page-items-container');
    this.paginationToBeginningBtnRef = document.querySelector('.pagination-beginning');
    this.paginationPreviousPageRef = document.querySelector('.pagination-previous-page');
    this.paginationNextPageRef = document.querySelector('.pagination-next-page');
    this.paginationToEndBtnRef = document.querySelector('.pagination-end');
    this.totalPages = 12;
    this.displayNumber = 5;
    this.lowRange = 1;
    this.upRange = this.calculateUpRange();
    this.totalPaginationBatches = Math.ceil(this.totalPages / this.displayNumber);
    this.currentPaginationBatch = 1;
    this.isLastPaginationBatch = false;
    this.isFirstPaginationBatch = true;
    this.currentActivePage = null;
  }
  clearPaginationPageItems() {
    this.paginationPageItemsContainerRef.innerHTML = '';
  }
  createPaginationPageItemsMarkup() {
    let paginationPageItemsMarkup = '';
    for (let i = lowRange; i <= upRange; i++) {
      paginationPageItemsMarkup += `<li class="waves-effect" data-page ='${i}'>
              <a href="#!" class="paginator-page-item" data-page ='${i}'>${i}</a>
            </li>`;
    }
    return paginationPageItemsMarkup;
  }
  renderPaginationPageItems() {
    const paginationPageItemsMarkup = this.createPaginationPageItemsMarkup();
    this.paginationPageItemsContainerRef.insertAdjacentHTML('afterbegin', paginationPageItemsMarkup);

    if (movieApi.pageNumber === 1) {
      this.disableToBeginningBtn();
      this.disablePreviousPageBtn();

      this.enableToEndBtn();
      this.enableNextPageBtn();
    }

    if (movieApi.pageNumber === totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();

      this.enableToBeginningBtn();
      this.enablePreviousPageBtn();
    }

    this.assignCurrentActivePage();
  }
  disableToEndBtn() {
    this.paginationToEndBtnRef.classList.add('disabled');
  }
  enableToEndBtn() {
    this.paginationToEndBtnRef.classList.remove('disabled');
  }
  disableNextPageBtn() {
    this.paginationNextPageRef.classList.add('disabled');
  }
  enableNextPageBtn() {
    this.paginationNextPageRef.classList.remove('disabled');
  }
  disableToBeginningBtn() {
    this.paginationToBeginningBtnRef.classList.add('disabled');
  }
  enableToBeginningBtn() {
    this.paginationToBeginningBtnRef.classList.remove('disabled');
  }
  disablePreviousPageBtn() {
    this.paginationPreviousPageRef.classList.add('disabled');
  }
  enablePreviousPageBtn() {
    this.paginationPreviousPageRef.classList.remove('disabled');
  }
  assignCurrentActivePage() {
    const paginationPageItems = this.paginationPageItemsContainerRef.querySelectorAll('li');
    const activeTarget = [...paginationPageItems].find(node => +node.dataset.page === movieApi.pageNumber);
    activeTarget.classList.add('active');
    this.currentActivePage = activeTarget;
  }
  switchCurrentActivePage() {
    const paginationPageItems = this.paginationPageItemsContainerRef.querySelectorAll('li');
    const activeTarget = [...paginationPageItems].find(node => +node.dataset.page === movieApi.pageNumber);
    this.currentActivePage.classList.remove('active');
    activeTarget.classList.add('active');
    this.currentActivePage = activeTarget;
  }
  calculateUpRange() {
    return this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;
  }
  calculateLowRange() {
    return this.totalPages > this.displayNumber ? this.upRange - this.displayNumber + 1 : 1;
  }
  goToBeginning() {
    if ([...this.paginationToBeginningBtnRef.classList].includes('disabled')) {
      return;
    }

    this.currentPaginationBatch = 1;
    this.isFirstPaginationBatch = true;

    movieApi.pageNumber = 1;

    this.lowRange = 1;
    this.upRange = this.calculateUpRange();

    this.clearPaginationPageItems();
    this.renderPaginationPageItems();

    this.disableToBeginningBtn();
    this.disablePreviousPageBtn();

    this.enableToEndBtn();
    this.enableNextPageBtn();

    this.assignCurrentActivePage();
  }
  goToEnd() {
    if ([...this.paginationToEndBtnRef.classList].includes('disabled')) {
      return;
    }

    this.currentPaginationBatch = this.totalPaginationBatches;
    this.isLastPaginationBatch = true;

    movieApi.pageNumber = this.totalPages;
    this.upRange = totalPages;
    this.lowRange = this.calculateLowRange();

    clearPaginationPageItems();
    renderPaginationPageItems();

    this.disableToEndBtn();
    this.disableNextPageBtn();

    this.enableToBeginningBtn();
    this.enablePreviousPageBtn();

    this.assignCurrentActivePage();
  }
  goToNextPage() {
    this.enableToBeginningBtn();
    this.enablePreviousPageBtn();

    movieApi.pageNumber += 1;

    if (movieApi.pageNumber > totalPages) {
      movieApi.pageNumber = totalPages;
      return;
    }

    if (movieApi.pageNumber === totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();
    }

    if (movieApi.pageNumber > upRange) {
      currentPaginationBatch += 1;
      isLastPaginationBatch = currentPaginationBatch === totalPaginationBatches;
      console.log(isLastPaginationBatch);

      if (isLastPaginationBatch) {
        upRange = totalPages;
        lowRange = totalPages > displayNumber ? upRange - displayNumber + 1 : 1;

        clearPaginationPageItems();
        renderPaginationPageItems();

        this.switchCurrentActivePage();

        return;
      }

      lowRange = upRange + 1;
      upRange = totalPages > displayNumber * currentPaginationBatch ? lowRange + displayNumber - 1 : totalPages;

      clearPaginationPageItems();
      renderPaginationPageItems();
    }

    this.switchCurrentActivePage();
  }
}

// Functions

function goToPreviousPage() {
  this.enableToEndBtn();
  this.enableNextPageBtn();

  movieApi.pageNumber -= 1;

  if (movieApi.pageNumber < 1) {
    movieApi.pageNumber = 1;
    return;
  }

  if (movieApi.pageNumber === 1) {
    this.disableToBeginningBtn();
    this.disablePreviousPageBtn();
  }

  if (movieApi.pageNumber < lowRange) {
    currentPaginationBatch -= 1;
    isFirstPaginationBatch = currentPaginationBatch === 1;

    if (isFirstPaginationBatch) {
      lowRange = 1;
      upRange = totalPages > displayNumber ? lowRange + displayNumber - 1 : totalPages;

      clearPaginationPageItems();
      renderPaginationPageItems();

      this.assignCurrentActivePage();

      return;
    }

    upRange = lowRange - 1;
    lowRange = upRange - displayNumber + 1;

    clearPaginationPageItems();
    renderPaginationPageItems();
  }

  this.switchCurrentActivePage();
}

function goToSelectedPage(e) {
  movieApi.pageNumber = +e.target.dataset.page;

  if (movieApi.pageNumber === 1) {
    this.disableToBeginningBtn();
    this.disablePreviousPageBtn();
  }

  if (movieApi.pageNumber === totalPages) {
    this.disableToEndBtn();
    this.disableNextPageBtn();
  }

  if (movieApi.pageNumber !== 1 && movieApi.pageNumber !== totalPages) {
    this.enableToBeginningBtn();
    this.enablePreviousPageBtn();
    this.enableToEndBtn();
    this.enableNextPageBtn();
  }

  this.switchCurrentActivePage();
}

// Pagination instance creation
const pagination = new PaginationApi();
console.log(pagination);

// Evoking funcitons
pagination.renderPaginationPageItems();

// Event Listeners
pagination.paginationContainerRef.addEventListener('click', e => {
  console.log('EVENT TARGET ON CONTAINER', e.target);
  console.log('MOVIE.API PAGE NUMBER', movieApi.pageNumber);
});

pagination.paginationPageItemsContainerRef.addEventListener('click', goToSelectedPage);

pagination.paginationToEndBtnRef.addEventListener('click', goToEnd);

pagination.paginationToBeginningBtnRef.addEventListener('click', goToBeginning);

pagination.paginationNextPageRef.addEventListener('click', goToNextPage);

pagination.paginationPreviousPageRef.addEventListener('click', goToPreviousPage);
