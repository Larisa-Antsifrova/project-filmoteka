'use strict';
// Консолька для отслеживания, что JS файлы подключаются в верном порядке. Просто параноя уже по Gulp-у
console.log('1');

// Объект с данными и методами для работы с The MovieDB. Пока такой, будет пополняться по мере рефакторинга
const movieApi = {
  apiKey: '0757258023265e845275de2a564555e9',
  baseUrl: 'https://api.themoviedb.org/3/',
  baseImageUrl: 'https://image.tmdb.org/t/p/',
};
// Консолька для мониторинга состояния данных в объете для работы с API
console.log(movieApi);

// Доступ к списку на домашней странице. В этот список будут рендерится популярные фильмы
// при загрузке страницы, и фильмы - результат поиска
const homePageRef = document.querySelector('[data-home-page]');

// Глобальные переменные, которые требуются по инструкции
let renderFilms = '';
let genres = '';
let pageNumber = 1;

// Функции
// Функция, которая создает одну карточку для галереи и которая вешает на карточку слушатель события для показа страницы деталей фильма
function createCardFunc(imgPath, filmTitle, movieId) {
  // Создание карточки фильма. Карточка - это лишка, в которой есть изображение и название фильма
  const galleryItemCard = document.createElement('li');
  const galleryItemImage = document.createElement('img');
  const galleryItemTitle = document.createElement('p');
  galleryItemImage.src = imgPath;
  galleryItemTitle.textContent = filmTitle;
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

// Функция, которая фетчит список популярных фильмов с API. Далее она создает карточку для каждого объекта результата и встраивает в список на
//  домашней странице через фрагмент.
function fetchPopularMoviesList() {
  return fetch(
    `${movieApi.baseUrl}movie/popular?api_key=${movieApi.apiKey}&language=en-US&page=${pageNumber}`,
  )
    .then(res => res.json())
    .then(({ results }) => {
      console.log(results);

      return results;
    })
    .then(movies => {
      const popularMoviesFragment = document.createDocumentFragment();
      movies.forEach(movie => {
        const imgPath = movieApi.baseImageUrl + 'w500' + movie.backdrop_path;
        const filmTitle = movie.title;
        const movieId = movie.id;
        const popularMoviesItem = createCardFunc(imgPath, filmTitle, movieId);

        popularMoviesFragment.appendChild(popularMoviesItem);
      });

      return popularMoviesFragment;
    })
    .then(fragment => homePageRef.appendChild(fragment));
}

function fetchGenres() {
  return fetch(
    `${movieApi.baseUrl}genre/movie/list?api_key=${movieApi.apiKey}&language=en-US`,
  )
    .then(res => res.json())
    .then(genresObj => genresObj.genres);
}

fetchPopularMoviesList();
fetchGenres();
console.log("pageNumber", pageNumber);