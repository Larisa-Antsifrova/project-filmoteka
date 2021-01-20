// глобальная переменная inputValue
let inputValue = '';

// слушатели событий
searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// функции
// функция выбора отображения страницы в зависимости от наличия текстa в инпуте. Определяет, вызывается ли фетч популярных фильмов или запрос поиска
function toggleRenderPage() {
  if (!inputValue.length) {
    renderPopularFilms();
    renderFilms = movieApi.fetchPopularFilmsList();
  } else {
    renderSearchedFilms(inputValue);
    renderFilms = movieApi.fetchSearchFilmsList(inputValue);
  }
}

// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  inputValue = e.target.elements.query.value.trim();

  renderSearchedFilms(inputValue).then(() => {
    paginator.recalculate(movieApi.totalPages || 1);
  });
}

// функция рендера страницы запроса
function renderSearchedFilms(inputValue) {
  return movieApi
    .fetchSearchFilmsList(inputValue)
    .then(createGallery)
    .then(fragment => renderGallery(fragment, homePageRef));
}

function renderPopularFilms() {
  return movieApi
    .fetchPopularFilmsList()
    .then(createGallery)
    .then(fragment => renderGallery(fragment, homePageRef));
}

// функция очистки инпута и параграфа ошибки при фокусе
function onInputFocus() {
  clearError();
  clearInput();
  movieApi.resetPage();
}

// функция очистки инпута и запроса
function clearInput() {
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
  inputValue = '';
}

// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = 'visible';

  const timeOfVisibleError = setTimeout(clearError, 2000);

  clearInput();
  movieApi.resetPage();

  return renderPopularFilms().then(() => {
    paginator.recalculate(movieApi.totalPages);
  });
}

// функция сокрытия строки ошибки
function clearError() {
  errorArea.style.visibility = 'hidden';
}

// функция очистки стартовой страницы
function clearHomePage() {
  homePageRef.innerHTML = '';
}

// PAGINATION CLASS
class PaginationApi {
  constructor(totalPages = 1, displayNumber = 5) {
    this.paginationContainerRef = document.querySelector('.pagination-container');
    this.paginationPageItemsContainerRef = document.querySelector('.pagination-page-items-container');

    this.paginationToBeginningBtnRef = document.querySelector('.pagination-beginning');
    this.paginationToBeginningIconRef = this.paginationToBeginningBtnRef.querySelector('i');
    this.paginationPreviousPageRef = document.querySelector('.pagination-previous-page');
    this.paginationPreviousPageIconRef = this.paginationPreviousPageRef.querySelector('i');

    this.paginationToEndBtnRef = document.querySelector('.pagination-end');
    this.paginationToEndIconRef = this.paginationToEndBtnRef.querySelector('i');
    this.paginationNextPageRef = document.querySelector('.pagination-next-page');
    this.paginationNextPageIconRef = this.paginationNextPageRef.querySelector('i');

    this.totalPages = totalPages;
    this.displayNumber = displayNumber;
    this.lowRange = 1;
    this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;
    this.totalPaginationBatches = Math.ceil(this.totalPages / this.displayNumber);
    this.currentPaginationBatch = 1;
    this.isLastPaginationBatch = false;
    this.isFirstPaginationBatch = true;
    this.currentActivePage = null;

    this.paginationContainerRef.addEventListener('click', this.onPaginationClick.bind(this));
  }

  clearPaginationPageItems() {
    this.paginationPageItemsContainerRef.innerHTML = '';
  }

  createPaginationPageItemsMarkup() {
    let paginationPageItemsMarkup = '';
    for (let i = this.lowRange; i <= this.upRange; i++) {
      paginationPageItemsMarkup += `<li class="waves-effect" data-page ='${i}'>
              <a href="#!" class="paginator-page-item" data-page ='${i}'>${i}</a>
            </li>`;
    }
    return paginationPageItemsMarkup;
  }

  renderPaginationPageItems() {
    const paginationPageItemsMarkup = this.createPaginationPageItemsMarkup();
    this.paginationPageItemsContainerRef.insertAdjacentHTML('afterbegin', paginationPageItemsMarkup);

    const totalPageItems = this.paginationPageItemsContainerRef.querySelectorAll('li');

    if (totalPageItems.length === 1) {
      this.disableToBeginningBtn();
      this.disablePreviousPageBtn();
      this.disableToEndBtn();
      this.disableNextPageBtn();
      this.assignCurrentActivePage();
      return;
    }

    if (movieApi.pageNumber === 1) {
      this.disableToBeginningBtn();
      this.disablePreviousPageBtn();

      this.enableToEndBtn();
      this.enableNextPageBtn();
    }

    if (movieApi.pageNumber === this.totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();

      this.enableToBeginningBtn();
      this.enablePreviousPageBtn();
    }

    this.assignCurrentActivePage();
  }

  disableToEndBtn() {
    this.paginationToEndBtnRef.classList.add('disabled');
    this.paginationToEndIconRef.setAttribute('disabled', true);
  }
  enableToEndBtn() {
    this.paginationToEndBtnRef.classList.remove('disabled');
    this.paginationToEndIconRef.removeAttribute('disabled');
  }
  disableNextPageBtn() {
    this.paginationNextPageRef.classList.add('disabled');
    this.paginationNextPageIconRef.setAttribute('disabled', true);
  }
  enableNextPageBtn() {
    this.paginationNextPageRef.classList.remove('disabled');
    this.paginationNextPageIconRef.removeAttribute('disabled');
  }
  disableToBeginningBtn() {
    this.paginationToBeginningBtnRef.classList.add('disabled');
    this.paginationToBeginningIconRef.setAttribute('disabled', true);
  }
  enableToBeginningBtn() {
    this.paginationToBeginningBtnRef.classList.remove('disabled');
    this.paginationToBeginningIconRef.removeAttribute('disabled');
  }
  disablePreviousPageBtn() {
    this.paginationPreviousPageRef.classList.add('disabled');
    this.paginationPreviousPageIconRef.setAttribute('disabled', true);
  }
  enablePreviousPageBtn() {
    this.paginationPreviousPageRef.classList.remove('disabled');
    this.paginationPreviousPageIconRef.removeAttribute('disabled');
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

  goToBeginning() {
    this.currentPaginationBatch = 1;
    this.isFirstPaginationBatch = true;

    movieApi.resetPage();

    this.lowRange = 1;
    this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;

    this.clearPaginationPageItems();
    this.renderPaginationPageItems();

    this.disableToBeginningBtn();
    this.disablePreviousPageBtn();

    this.enableToEndBtn();
    this.enableNextPageBtn();

    this.assignCurrentActivePage();
  }

  goToEnd() {
    this.currentPaginationBatch = this.totalPaginationBatches;
    this.isLastPaginationBatch = true;

    movieApi.pageNumber = this.totalPages;
    this.upRange = this.totalPages;
    this.lowRange = this.totalPages > this.displayNumber ? this.upRange - this.displayNumber + 1 : 1;

    this.clearPaginationPageItems();
    this.renderPaginationPageItems();

    this.disableToEndBtn();
    this.disableNextPageBtn();

    this.enableToBeginningBtn();
    this.enablePreviousPageBtn();

    this.assignCurrentActivePage();
  }

  goToNextPage() {
    this.enableToBeginningBtn();
    this.enablePreviousPageBtn();

    movieApi.incrementPage();

    if (movieApi.pageNumber > this.totalPages) {
      movieApi.pageNumber = this.totalPages;
      return;
    }

    if (movieApi.pageNumber === this.totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();
    }

    if (movieApi.pageNumber > this.upRange) {
      this.currentPaginationBatch += 1;
      this.isLastPaginationBatch = this.currentPaginationBatch === this.totalPaginationBatches;

      if (this.isLastPaginationBatch) {
        this.upRange = this.totalPages;
        this.lowRange = this.totalPages > this.displayNumber ? this.upRange - this.displayNumber + 1 : 1;

        this.clearPaginationPageItems();
        this.renderPaginationPageItems();

        this.switchCurrentActivePage();

        return;
      }

      this.lowRange = this.upRange + 1;
      this.upRange =
        this.totalPages > this.displayNumber * this.currentPaginationBatch
          ? this.lowRange + this.displayNumber - 1
          : this.totalPages;

      this.clearPaginationPageItems();
      this.renderPaginationPageItems();
    }

    this.switchCurrentActivePage();
  }

  goToPreviousPage() {
    this.enableToEndBtn();
    this.enableNextPageBtn();

    movieApi.decrementPage();

    if (movieApi.pageNumber < 1) {
      movieApi.resetPage();
      return;
    }

    if (movieApi.pageNumber === 1) {
      this.disableToBeginningBtn();
      this.disablePreviousPageBtn();
    }

    if (movieApi.pageNumber < this.lowRange) {
      this.currentPaginationBatch -= 1;
      this.isFirstPaginationBatch = this.currentPaginationBatch === 1;

      if (this.isFirstPaginationBatch) {
        this.lowRange = 1;
        this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;

        this.clearPaginationPageItems();
        this.renderPaginationPageItems();

        this.assignCurrentActivePage();

        return;
      }

      this.upRange = this.lowRange - 1;
      this.lowRange = this.upRange - this.displayNumber + 1;

      this.clearPaginationPageItems();
      this.renderPaginationPageItems();
    }

    this.switchCurrentActivePage();
  }

  goToSelectedPage(e) {
    movieApi.pageNumber = +e.target.dataset.page;

    if (movieApi.pageNumber === 1) {
      this.disableToBeginningBtn();
      this.disablePreviousPageBtn();
      this.enableToEndBtn();
      this.enableNextPageBtn();
    }

    if (movieApi.pageNumber === this.totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();
      this.enableToBeginningBtn();
      this.enablePreviousPageBtn();
    }

    if (movieApi.pageNumber !== 1 && movieApi.pageNumber !== this.totalPages) {
      this.enableToBeginningBtn();
      this.enablePreviousPageBtn();
      this.enableToEndBtn();
      this.enableNextPageBtn();
    }

    this.switchCurrentActivePage();
  }

  onPaginationClick(e) {
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
      return;
    }

    if (e.target.hasAttribute('disabled')) {
      return;
    }

    if (e.target.nodeName === 'A' && e.target.classList.contains('paginator-page-item')) {
      this.goToSelectedPage(e);
      toggleRenderPage();
      return;
    }

    if (e.target.textContent === 'first_page') {
      this.goToBeginning();
      toggleRenderPage();
      return;
    }

    if (e.target.textContent === 'chevron_left') {
      this.goToPreviousPage();
      toggleRenderPage();
      return;
    }

    if (e.target.textContent === 'last_page') {
      this.goToEnd();
      toggleRenderPage();
      return;
    }

    if (e.target.textContent === 'chevron_right') {
      this.goToNextPage();
      toggleRenderPage();
      return;
    }
  }

  recalculate(newTotalPages) {
    this.totalPages = newTotalPages;

    this.lowRange = 1;
    this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;

    this.totalPaginationBatches = Math.ceil(this.totalPages / this.displayNumber);
    this.isLastPaginationBatch = false;
    this.isFirstPaginationBatch = true;

    this.clearPaginationPageItems();
    this.renderPaginationPageItems();
  }
}

const paginator = new PaginationApi(movieApi.totalPages);
