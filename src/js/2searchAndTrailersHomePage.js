searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);

// функция выбора отображения страницы в зависимости от наличия текстa в инпуте.
// Определяет, вызывается ли фетч популярных фильмов или запрос поиска
function toggleRenderPage() {
  if (!movieApi.searchQuery.length) {
    renderPopularFilms().then(() => {
      window.scrollTo({
        top: 100,
        left: 100,
        behavior: 'smooth',
      });
    });
    renderFilms = movieApi.fetchPopularFilmsList();
  } else {
    renderSearchedFilms(movieApi.searchQuery).then(() => {
      window.scrollTo({
        top: 100,
        left: 100,
        behavior: 'smooth',
      });
    });
    renderFilms = movieApi.fetchSearchFilmsList(movieApi.searchQuery);
  }
}

// функция для слушателя инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  movieApi.searchQuery = e.target.elements.query.value.trim();

  if (movieApi.searchQuery) {
    renderSearchedFilms(movieApi.searchQuery).then(() => {
      paginator.recalculate(movieApi.totalPages || 1);
    });
  }
  renderFilms = movieApi.fetchSearchFilmsList(inputValue);
}

// функция рендера страницы запроса
function renderSearchedFilms(inputValue) {
  return movieApi
    .fetchSearchFilmsList(inputValue)
    .then(createGalleryFragment)
    .then(fragment => renderGallery(fragment, homePageRef));
}

function renderPopularFilms() {
  return movieApi
    .fetchPopularFilmsList()
    .then(createGalleryFragment)
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

// функция очистки стартовой страницы - Здесь: у Тани более универсальная функция, оптимальнее оставить ее :)
// function clearHomePage() {
//   homePageRef.innerHTML = '';
// }

// ============================= for modal window =======================================
const trailerSection = document.querySelector('.trailer');
const lightboxOverlay = document.querySelector('.lightbox__overlay');
const lightboxCard = document.querySelector('.js-lightbox');
const trailerVideo = document.querySelector('.trailer_referense');

trailerSection.addEventListener('click', openModal);
lightboxOverlay.addEventListener('click', onClickOverlay);

// =============================== trailer ====================================

function renderMovieTrailer(el) {
  movieApi.fetchTrailersAPI(el)
    .then(createTrailerBtn);
}

// функция принимает li с ссылкой и вставляет в список
function createTrailerBtn(trailer) {
  if (!trailer) {
    return;
  }
  const trailerBtn = createTrailerRef(trailer.key);
  trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
}

// функция принимает ключ трейлера и вставляет полную ссылку на него в li
function createTrailerRef(key) {
  const trailerItem = document.createElement('li');
  trailerItem.classList.add('trailer__ref');
  const YOUTUBE_URL = 'https://www.youtube.com//embed/';
  const fullURL = `${YOUTUBE_URL}${key}`;
  const trailerRef = `<a href="${fullURL}" class='trailer__a'>Trailer</a>`;
  trailerItem.insertAdjacentHTML('afterbegin', trailerRef);
  return trailerItem;
}
// функция сноса секции трейлера
function clearTrailerKey() {
  trailerSection.innerHTML = '';
}

// ==== modal window =====
function openModal(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'A') {
    return;
  }
  trailerVideo.src = event.target.href;
  lightboxCard.classList.add('is-open');
  lightboxOverlay.addEventListener('click', onClickOverlay);
  trailerSection.removeEventListener('click', openModal);
  addKeydownListener();
}

function onClickOverlay(event) {
  if (event.target === event.currentTarget) {
    closeLightboxHandler();
  }
}

function onPressEscape(event) {
  if (event.code === 'Escape') {
    closeLightboxHandler();
  }
}

function closeLightboxHandler() {
  removeKeydownListener();
  lightboxCard.classList.remove('is-open');
  trailerVideo.src = '';
  lightboxOverlay.removeEventListener('click', onClickOverlay);
  trailerSection.addEventListener('click', openModal);
}

function addKeydownListener() {
  window.addEventListener('keydown', onPressEscape);
}

function removeKeydownListener() {
  window.removeEventListener('keydown', onPressEscape);
}
