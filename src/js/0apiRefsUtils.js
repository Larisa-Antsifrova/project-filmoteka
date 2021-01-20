'use strict';

// Объект с данными и методами для работы с The MovieDB
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
  fetchGenresList() {
    return fetch(`${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`)
      .then(response => response.json())
      .then(data => data.genres);
  },
};

// Доступы к ДОМ-элементам и их деструктуризация
const DOMrefs = {
  homePageRef: document.querySelector('[data-home-gallery]'),
  searchForm: document.querySelector('.search__form'),
  errorArea: document.querySelector('.error__area'),
};

const { homePageRef, searchForm, errorArea } = DOMrefs;

// Объект спиннера и его методы
const spinner = {
  spinnerRef: document.querySelector('[data-spinner]'),

  show() {
    this.spinnerRef.style.display = 'inline-block';
  },
  hide() {
    this.spinnerRef.style.display = 'none';
  },
};
