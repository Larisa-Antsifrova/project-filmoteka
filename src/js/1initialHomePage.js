'use strict';
// Консолька для отслеживания, что JS файлы подключаются в верном порядке. Просто параноя уже по Gulp-у
console.log('1');

// Объект с данными и методами для работы с The MovieDB.
const movieApi = {
  apiKey: '0757258023265e845275de2a564555e9',
  baseUrl: 'https://api.themoviedb.org/3/',
  searchQuery: '',
  totalResults: 0,
  perPage: 20,
  totalPages: 0,
  pageNumber: 1,
  isLastPage: false,
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
    this.pageNumber = +this.pageNumber + 5;
  },
  decrementPage() {
    this.pageNumber -= 5;
  },
  resetPage() {
    this.pageNumber = 1;
  },
  get query() {
    return this.searchQuery;
  },
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  },
  fetchPopularMoviesList() {
    return fetch(
      `${this.baseUrl}movie/popular?api_key=${this.apiKey}&language=en-US&page=${this.pageNumber}`,
    )
      .then(response => response.json())
      .then(resp => {
        createPaginationMarkup(resp);
        lastPage.style.visibility = "hidden";
        disactiveBtnNext(resp);
        disactivePaginationBtn(resp);

        return resp;
      })
      .then(({ results }) => results);
  },
  fetchSearchFilmsList(query) {
    showSpinner(spinerRef);
    this.searchQuery = query;
    return fetch(
      `${this.baseUrl}search/movie?api_key=${this.apiKey}&language=en-US&query=${this.searchQuery}&page=${this.pageNumber}`,
    )
      .then(res => res.json())
      .then(resp => {
        console.log(resp);
        this.totalPages = resp.total_pages;
        if (resp.total_pages > 1) {
          createPaginationMarkup(resp);
          lastPage.style.visibility = "visible";
          disactiveBtnNext(resp);
          disactivePaginationBtn(resp);
        }
        // =============================================
        if (resp.page === 1 && resp.total_pages === 0) {
          notFound();
        }
        // =============================================
        return resp
      })
      .then(({ results }) => {
        // тут прописана логика вывода ошибки
        // if (results.length === 0) {
        //   notFound();
        // }
        return results;
      })
      .finally(() => hideSpinner(spinerRef));
  },
  fetchGenres() {
    return fetch(`${this.baseUrl}genre/movie/list?api_key=${this.apiKey}`)
      .then(response => response.json())
      .then(data => data.genres);
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
    if (
      window.visualViewport.width >= 768 &&
      window.visualViewport.width < 1024
    ) {
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
    if (
      window.visualViewport.width >= 768 &&
      window.visualViewport.width < 1024
    ) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
      this.images.defaultPosterImg = '../images/default/poster-tablet.jpg';
    }
    if (window.visualViewport.width < 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
      this.images.defaultPosterImg = '../images/default/poster-mobile.jpg';
    }
  },
};

// Вызов функций для высчета размеров изображений для карточек и постера
movieApi.calculateBackdropImgSize();
movieApi.calculatePosterImgSize();

// Доступ к списку на домашней странице. В этот список будут рендерится популярные фильмы при загрузке страницы, и фильмы - результат поиска.
const homePageRef = document.querySelector('[data-home-gallery]');

// Access to spinner wraper
const spinerRef = document.querySelector('[data-spiner]');
// Funtions to hide or show spinner
function showSpinner(spinner) {
  spinner.style.display = 'inline-block';
}
function hideSpinner(spinner) {
  spinner.style.display = 'none';
}
hideSpinner(spinerRef);
// Глобальные переменные, которые требуются по инструкции
let renderFilms = movieApi.fetchPopularMoviesList();
// let renderFilms;
const genres = movieApi.fetchGenres(); // содержит промис с массивом объектов жанров
let pageNumber = 1; // можно заменить свойством в АПИШКЕ

// Функции
// Функция, которая рендерит (вставляет в DOM) всю страницу галереи. Принимает фрагмент и ссылку, куда надо вставить фрагмент.
function renderGallery(fragment, place) {
  place.appendChild(fragment);
}

// Функция, которая создает фрагмент со всеми карточками галереи. Принимает массив объектов фильмов.
function createGallery(movies) {
  // Alex add - create HPage
  clearHomePage();
  const galleryFragment = document.createDocumentFragment();

  movies.forEach(movie => {
    const galleryItem = createCardFunc(movie);
    galleryFragment.appendChild(galleryItem);
  });

  return galleryFragment;
}

// Функция, которая создаёт одну карточку для фильма. Принимает один объект фильма.
function createCardFunc(movie) {
  const imgPath = movie.backdrop_path
    ? movieApi.images.baseImageUrl +
      movieApi.imageBackdropSize +
      movie.backdrop_path
    : movieApi.images.defaultBackdropImg;
  const filmYear = movie.release_date
    ? `(${movie.release_date.slice(0, 4)})`
    : '';
  const filmTitle = `${movie.title} ${filmYear}`;
  const movieId = movie.id;
  const movieRaiting = movie.vote_average;

  const galleryItemCard = document.createElement('li');
  galleryItemCard.classList.add('gallery-item-card');
  galleryItemCard.classList.add('hoverable');
  galleryItemCard.classList.add('z-depth-3');
  galleryItemCard.setAttribute('data-id', movieId);

  const galleryItemImage = document.createElement('img');
  galleryItemImage.src = imgPath;
  // galleryItemImage.setAttribute('data-id', movieId);

  const galleryItemTitle = document.createElement('p');
  galleryItemTitle.classList.add('gallery-card-title');
  galleryItemTitle.textContent = filmTitle;

  if (movieRaiting) {
    const galleryItemRating = document.createElement('p');
    galleryItemRating.classList.add('gallery-card-raiting');
    galleryItemRating.classList.add('valign-wrapper');

    const movieRatingSpan = document.createElement('span');
    movieRatingSpan.textContent = movieRaiting;

    const star = document.createElement('i');
    star.classList.add('material-icons');
    star.classList.add('yellow-text');
    star.classList.add('text-darken-1');
    star.classList.add('tiny');
    star.textContent = 'star';
    galleryItemRating.appendChild(movieRatingSpan);
    galleryItemRating.appendChild(star);

    galleryItemCard.appendChild(galleryItemRating);
  }

  galleryItemCard.appendChild(galleryItemImage);
  galleryItemCard.appendChild(galleryItemTitle);

  // Добавление слушателя события, чтобы открыть страницу с деталями.
  // Пока так по инструкции. Но потом стоит переделать на делегирование.
  // Иначе у нас миллион слушателей будет.
  galleryItemCard.addEventListener('click', () => {
    // Консолька для проверки, что слушатель события еще на месте.
    console.log('Hello, I am click event!');
    activeDetailsPage(movieId, false);
  });

  return galleryItemCard;
}

// Вызов функций, которые фетчат популярные фильмы, создают фразмент с карточками галереи для каждого фильма и рендерят весь фрагмент в DOM

// Alex add - вывел фетч в функцию, во избежание дублирования кода т.к. она нужна для рендера страницы при выводе ошибки (стр 65)
function renderPopularMoviesList() {
  movieApi
    .fetchPopularMoviesList()
    .then(createGallery)
    .then(fragment => renderGallery(fragment, homePageRef));
}
renderPopularMoviesList();
