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
class PaginationApi {
  constructor(totalPages, displayNumber = 5) {
    this.paginationContainerRef = document.querySelector('.pagination-container');
    this.paginationPageItemsContainerRef = document.querySelector('.pagination-page-items-container');
    this.paginationToBeginningBtnRef = document.querySelector('.pagination-beginning');
    this.paginationPreviousPageRef = document.querySelector('.pagination-previous-page');
    this.paginationNextPageRef = document.querySelector('.pagination-next-page');
    this.paginationToEndBtnRef = document.querySelector('.pagination-end');
    this.totalPages = totalPages;
    this.displayNumber = displayNumber;
    this.lowRange = 1;
    this.upRange = this.totalPages > this.displayNumber ? this.lowRange + this.displayNumber - 1 : this.totalPages;
    this.totalPaginationBatches = Math.ceil(this.totalPages / this.displayNumber);
    this.currentPaginationBatch = 1;
    this.isLastPaginationBatch = false;
    this.isFirstPaginationBatch = true;
    this.currentActivePage = null;
    this.paginationPageItemsContainerRef.addEventListener('click', this.goToSelectedPage.bind(this));
    this.paginationToEndBtnRef.addEventListener('click', this.goToEnd.bind(this));
    this.paginationToBeginningBtnRef.addEventListener('click', this.goToBeginning.bind(this));
    this.paginationNextPageRef.addEventListener('click', this.goToNextPage.bind(this));
    this.paginationPreviousPageRef.addEventListener('click', this.goToPreviousPage.bind(this));
    this.paginationContainerRef.addEventListener('click', this.initiateFetch.bind(this));

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
    if ([...this.paginationToBeginningBtnRef.classList].includes('disabled')) {
      return;
    }

    this.currentPaginationBatch = 1;
    this.isFirstPaginationBatch = true;

    movieApi.pageNumber = 1;

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
    if ([...this.paginationToEndBtnRef.classList].includes('disabled')) {
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

    movieApi.pageNumber += 1;

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

    movieApi.pageNumber -= 1;

    if (movieApi.pageNumber < 1) {
      movieApi.pageNumber = 1;
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
  initiateFetch(e) {
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'I') {
      console.log('YOU MISSED THE PAGINATION BUTTONS');
      return;
    }
    toggleRenderPage();

    // movieApi
    //   .fetchPopularMoviesList()
    //   .then(createGallery)
    //   .then(fragment => {
    //     renderGallery(fragment, homePageRef);

    //     console.log('TOTAL PAGES INSIDE FENTCH: ', movieApi.totalPages, movieApi.pageNumber);
    //   });

    // console.log('EVENT TARGET ON CONTAINER', e.target);
    // console.log('MOVIE.API PAGE NUMBER', movieApi.pageNumber);
  }
}

let paginator = null;
