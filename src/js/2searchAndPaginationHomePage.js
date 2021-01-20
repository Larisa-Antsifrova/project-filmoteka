// глобальная переменная inputValue
let inputValue = '';

// слушатели событий
searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// функции
// функция выбора отображения страницы в зависимости от наличия текстa в инпуте
function toggleRenderPage() {
  if (!inputValue.length) {
    console.log('I toggle render POPULAR');
    renderPopularFilms();
    renderFilms = movieApi.fetchPopularFilmsList();
  } else {
    console.log('I toggle render SEARCH');
    renderSearchedFilms(inputValue).then(() => {
      if (movieApi.pageNumber === 1) {
        console.log('INPUT', inputValue);
        paginatorPopular.reset();
        paginatorSearch = new PaginationApi();
      }
    });
    renderFilms = movieApi.fetchSearchFilmsList(inputValue);
  }
}

// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  inputValue = e.target.elements.query.value.trim();
  toggleRenderPage();
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

  return renderPopularFilms();
}

// функция сокрытия строки ошибки
function clearError() {
  errorArea.style.visibility = 'hidden';
}

// функция очистки стартовой страницы
function clearHomePage() {
  homePageRef.innerHTML = '';
}

// функция отзыва кнопок и рендера страницы по номеру кнопки
// function renderPageOnNumBtn(evt) {
//   movieApi.pageNumber = +evt.target.textContent;
//   deactivationPaginationBtn(evt);
//   disabledPrevBtn();
//   clearHomePage();
//   toggleRenderPage();
// }

// PAGINATION with MATERIALIZE
class PaginationApi {
  constructor(displayNumber = 5) {
    this.paginationContainerRef = document.querySelector('.pagination-container');
    this.paginationPageItemsContainerRef = document.querySelector('.pagination-page-items-container');
    this.paginationToBeginningBtnRef = document.querySelector('.pagination-beginning');
    this.paginationPreviousPageRef = document.querySelector('.pagination-previous-page');
    this.paginationToEndBtnRef = document.querySelector('.pagination-end');
    this.paginationNextPageRef = document.querySelector('.pagination-next-page');

    this.totalPages = movieApi.totalPages;
    this.displayNumber = displayNumber;
    this.lowRange = 1;
    this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;
    this.totalPaginationBatches = Math.ceil(this.totalPages / this.displayNumber);
    this.currentPaginationBatch = 1;
    this.isLastPaginationBatch = false;
    this.isFirstPaginationBatch = true;
    this.currentActivePage = null;

    this.paginationContainerRef.addEventListener('click', this.onPaginationClick.bind(this));

    this.renderPaginationPageItems();
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

    // if (movieApi.pageNumber === 1 && movieApi.pageNumber === this.totalPages) {
    //   this.disableToBeginningBtn();
    //   this.disablePreviousPageBtn();
    //   this.disableToEndBtn();
    //   this.disableNextPageBtn();

    //   this.assignCurrentActivePage();

    //   return;
    // }

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

  goToBeginning() {
    if (this.paginationToBeginningBtnRef.classList.contains('disabled')) {
      return;
    }

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
    if (this.paginationToEndBtnRef.classList.contains('disabled')) {
      return;
    }

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
    }

    if (movieApi.pageNumber === this.totalPages) {
      this.disableToEndBtn();
      this.disableNextPageBtn();
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
      console.log('YOU MISSED THE PAGINATION BUTTONS');
      return;
    }

    if (e.target.nodeName === 'A') {
      this.goToSelectedPage(e);
    }

    if (e.target.textContent === 'first_page') {
      this.goToBeginning();
    }

    if (e.target.textContent === 'chevron_left') {
      this.goToPreviousPage();
    }

    if (e.target.textContent === 'last_page') {
      this.goToEnd();
    }

    if (e.target.textContent === 'chevron_right') {
      this.goToNextPage();
    }

    toggleRenderPage();
  }
  reset() {
    this.paginationPageItemsContainerRef.textContent = '';
  }
}

let paginatorPopular = null;
let paginatorSearch = null;
