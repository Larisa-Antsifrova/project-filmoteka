// Глобальные переменные которые требуются по инструкции
const genres = movieApi.fetchGenresList(); // содержит промис с массивом объектов жанров
let renderFilms = movieApi.fetchPopularFilmsList(); // содержит массив с объектами фильмов

// Вызов функций для высчета размеров изображений для карточек и постера
movieApi.calculateBackdropImgSize();
movieApi.calculatePosterImgSize();

// Вызов функции, чтобы сразу спрятать спиннер
spinner.hide();

// Функции
// Функция, которая рендерит (вставляет в DOM) всю страницу галереи. Принимает фрагмент и ссылку, куда надо вставить фрагмент.
function renderGallery(fragment, place) {
  clearHomePage();
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
  const imgPath = movie.backdrop_path
    ? movieApi.images.baseImageUrl + movieApi.imageBackdropSize + movie.backdrop_path
    : movieApi.images.defaultBackdropImg;
  const filmYear = movie.release_date ? `(${movie.release_date.slice(0, 4)})` : '';
  const filmTitle = `${movie.title} ${filmYear}`;
  const movieId = movie.id;
  const movieRaiting = movie.vote_average;

  const galleryItemCard = document.createElement('li');
  galleryItemCard.classList.add('gallery-item-card', 'hoverable', 'z-depth-3');
  // galleryItemCard.setAttribute('data-id', movieId);

  const galleryItemImage = document.createElement('img');
  galleryItemImage.src = imgPath;
  // galleryItemImage.setAttribute('data-id', movieId);

  const galleryItemTitle = document.createElement('p');
  galleryItemTitle.classList.add('gallery-card-title');
  galleryItemTitle.textContent = filmTitle;

  if (movieRaiting) {
    const galleryItemRating = document.createElement('p');
    galleryItemRating.classList.add('gallery-card-raiting', 'valign-wrapper');

    const movieRatingSpan = document.createElement('span');
    movieRatingSpan.textContent = movieRaiting;

    const star = document.createElement('i');
    star.classList.add('material-icons', 'yellow-text', 'text-darken-1', 'tiny');
    star.textContent = 'star';

    galleryItemRating.appendChild(movieRatingSpan);
    galleryItemRating.appendChild(star);
    galleryItemCard.appendChild(galleryItemRating);
  }

  galleryItemCard.appendChild(galleryItemImage);
  galleryItemCard.appendChild(galleryItemTitle);

  galleryItemCard.addEventListener('click', () => {
    activeDetailsPage(movieId, false);
  });

  return galleryItemCard;
}

// Вызоб самого первого фетча за популярными фильмами и его рендер
renderPopularFilms().then(() => {
  paginator.recalculate(8);
  // paginator.recalculate(movieApi.totalPages);

  console.log('PAGE TOTAL ', movieApi.totalPages);
});
