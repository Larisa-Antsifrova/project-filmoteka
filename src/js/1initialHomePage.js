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
    currentSizes: {
      backdropSize: '',
      posterSize: '',
    },
    backdropSizes: {
      mobile: 'w780',
      tablet: 'w1280',
      desktop: 'original',
    },
    posterSizes: {
      mobile: 'w500',
      tablet: 'w780',
      desktop: 'original',
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
      .then(({ results }) => results);
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
    if (window.screen.availWidth >= 1024) {
      this.images.currentSizes.backdropSize = this.images.backdropSizes.desktop;
    }
    if (window.screen.availWidth >= 768) {
      this.images.currentSizes.backdropSize = this.images.backdropSizes.tablet;
    }

    this.images.currentSizes.backdropSize = this.images.backdropSizes.mobile;
  },
  calculatePosterImgSize() {
    if (window.screen.availWidth >= 1024) {
      this.images.currentSizes.posterSize = this.images.posterSizes.desktop;
    }
    if (window.screen.availWidth >= 768) {
      this.images.currentSizes.posterSize = this.images.posterSizes.tablet;
    }

    this.images.currentSizes.posterSize = this.images.posterSizes.mobile;
  },
};

// Вызов функций для высчета размеров изображений для карточек и постера
movieApi.calculateBackdropImgSize();
movieApi.calculatePosterImgSize();

// Доступ к списку на домашней странице. В этот список будут рендерится популярные фильмы при загрузке страницы, и фильмы - результат поиска.
const homePageRef = document.querySelector('[data-home-gallery]');

// Глобальные переменные, которые требуются по инструкции
let renderFilms = '';
const genres = movieApi.fetchGenres(); // содержит промис с массивом объектов жанров
let pageNumber = 1; // можно заменить свойством в АПИШКЕ

// Функции
// Функция, которая рендерит (вставляет в DOM) всю страницу галереи. Принимает фрагмент и ссылку, куда надо вставить фрагмент.
function renderGallery(fragment, place) {
  place.appendChild(fragment);
}

// Функция, которая создает фрагмент со всеми карточками галереи. Принимает массив объектов фильмов.
function createGallery(movies) {
  const galleryFragment = document.createDocumentFragment();

  movies.forEach(movie => {
    const galleryItem = createCardFunc(movie);
    galleryFragment.appendChild(galleryItem);
  });

  return galleryFragment;
}

// Функция, которая создаёт одну карточку для фильма. Принимает один объект фильма.
function createCardFunc(movie) {
  const imgPath =
    movieApi.images.baseImageUrl +
    movieApi.imageBackdropSize +
    movie.backdrop_path;
  const filmYear = movie.release_date.slice(0, 4);
  const filmTitle = `${movie.title} (${filmYear})`;
  const movieId = movie.id;
  const movieRaiting = movie.vote_average;

  const galleryItemCard = document.createElement('li');
  galleryItemCard.classList.add('gallery-item-card');
  galleryItemCard.setAttribute('data-id', movieId);

  const galleryItemImage = document.createElement('img');
  galleryItemImage.src = imgPath;

  const galleryItemTitle = document.createElement('p');
  galleryItemTitle.classList.add('gallery-card-title');
  galleryItemTitle.textContent = filmTitle;

  const galleryItemRating = document.createElement('p');
  galleryItemRating.classList.add('gallery-card-raiting');
  galleryItemRating.textContent = movieRaiting;

  galleryItemCard.appendChild(galleryItemRating);
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
movieApi
  .fetchPopularMoviesList()
  .then(createGallery)
  .then(fragment => renderGallery(fragment, homePageRef));
