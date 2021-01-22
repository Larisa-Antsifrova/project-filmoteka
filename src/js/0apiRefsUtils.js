'use strict';

// ===== Объект со свойствами и методами для работы с The MovieDB
const movieApi = {
  apiKey: API_KEY,
  baseUrl: 'https://api.themoviedb.org/3/',
  searchQuery: '',
  perPage: 20,
  totalPages: 1,
  pageNumber: 1,
  images: {
    baseImageUrl: 'https://image.tmdb.org/t/p/',
    defaultBackdropImg: '',
    defaultPosterImg: '',
    currentSizes: {
      backdropSize: '',
      posterSize: '',
    },
    backdropSizes: {
      mobile: 'w780',
      tablet: 'w780',
      desktop: 'w780',
    },
    posterSizes: {
      mobile: 'w342',
      tablet: 'w500',
      desktop: 'w780',
    },
  },

  incrementPage() {
    this.pageNumber += 1;
  },
  decrementPage() {
    this.pageNumber -= 1;
  },
  resetPage() {
    this.pageNumber = 1;
  },
  get imageBackdropSize() {
    return this.images.currentSizes.backdropSize;
  },
  get imagePosterSize() {
    return this.images.currentSizes.posterSize;
  },
  calculateBackdropImgSize() {
    if (window.visualViewport.width >= 1024) {
      this.images.currentSizes.backdropSize = this.images.backdropSizes.desktop;
      this.images.defaultBackdropImg = '../images/default/backdrop-desktop.jpg';
      return;
    }
    if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
      this.images.currentSizes.backdropSize = this.images.backdropSizes.tablet;
      this.images.defaultBackdropImg = '../images/default/backdrop-tablet.jpg';
      return;
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.backdropSize = this.images.backdropSizes.mobile;
      this.images.defaultBackdropImg = '../images/default/backdrop-mobile.jpg';
      return;
    }
  },
  calculatePosterImgSize() {
    if (window.visualViewport.width >= 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.desktop;
      this.images.defaultPosterImg = '../images/default/poster-desktop.jpg';
    }
    if (window.visualViewport.width >= 768 && window.visualViewport.width < 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
      this.images.defaultPosterImg = '../images/default/poster-tablet.jpg';
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
      this.images.defaultPosterImg = '../images/default/poster-mobile.jpg';
    }
  },
  fetchPopularFilmsList() {
    return fetch(`${this.baseUrl}movie/popular?api_key=${this.apiKey}&language=en-US&page=${this.pageNumber}`)
      .then(response => response.json())
      .then(resp => {
        this.totalPages = resp.total_pages;
        return resp;
      })
      .then(({ results }) => results);
  },
  fetchSearchFilmsList(query) {
    spinner.show();
    this.searchQuery = query;
    return fetch(
      `${this.baseUrl}search/movie?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}&page=${this.pageNumber}`,
    )
      .then(res => res.json())
      .then(resp => {
        this.totalPages = resp.total_pages;
        return resp;
      })
      .then(({ results }) => {
        // тут прописана логика вывода ошибки
        if (results.length === 0) {
          notFound();
        }
        return results;
      })
      .finally(() => {
        spinner.hide();
      });
  },
  fetchTrailersAPI(el) {
  return fetch(`${this.baseUrl}movie/${el}/videos?api_key=${this.apiKey}&language=en-US`)
    .then(response => response.json())
    .then(resp => resp)
    .then(({ results }) => {
      // проверка на наличие трейлера
      if (!results.length) {
        return;
      } else {
        return results.find(e => {
          if (e.type == 'Trailer') {
            return e;
          }
        });
      }
    });
  },
  fetchGenresList() {
    return fetch(`${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`)
      .then(response => response.json())
      .then(data => data.genres);
  },
};

/// ===== Доступы к ДОМ-элементам и их деструктуризация
const domRefs = {
  homePageRef: document.querySelector('[data-home-gallery]'),
  searchForm: document.querySelector('.search__form'),
  errorArea: document.querySelector('.error__area'),
};

const { homePageRef, searchForm, errorArea } = domRefs;

// ===== Объект спиннера и его методы
const spinner = {
  spinnerRef: document.querySelector('[data-spinner]'),

  show() {
    this.spinnerRef.style.display = 'inline-block';
  },
  hide() {
    this.spinnerRef.style.display = 'none';
  },
};

// ===== Класс пагинатора
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

// ===== Глобальные переменные
const genres = movieApi.fetchGenresList(); // содержит промис с массивом объектов жанров
let renderFilms = movieApi.fetchPopularFilmsList(); // содержит массив с объектами фильмов
