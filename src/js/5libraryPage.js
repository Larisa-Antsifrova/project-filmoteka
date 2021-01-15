// Создание ссылок
const refs = {
  controls: document.querySelector('[data-controls]'),
  panes: document.querySelector('[data-panes]'),
  queueBtn: document.querySelector('[data-action-queue]'),
  watchedBtn: document.querySelector('[data-action-watched]'),
  galleryList: document.querySelector('.library-page-gallery'),
};

// Слушатели
refs.controls.addEventListener('click', onControlsClick); // для табов
refs.queueBtn.addEventListener('click', drawQueueFilmList);
refs.watchedBtn.addEventListener('click', drawWatchedFilmList);
refs.galleryList.addEventListener('click', activeDetailsPage); // делегирование при клике на фильм на список <ul>

// Функция для создания карточки фильма в  МОЕЙ ГАЛЕРЕЕ.
// Принимает один объект фильма from local storage  по инструкции.
// В данный момент для тестирования получила фильмы с помощью renderFilms.then()
// Поля в local storage надо согласовать с Яриком
// Делала функцию по патерну Ларисы
function createLibraryCardFunc(movie) {
  // const imgPath = filmObj.img;
  // const filmYear = filmObj.year;
  // const filmTitle = `${filmObj.title} (${filmYear})`;
  // const filmId = filmObj.id;
  // const filmRaiting = filmObj.voteAverage;
  const imgPath =
    movieApi.images.baseImageUrl +
    movieApi.imageBackdropSize +
    movie.backdrop_path;
  const filmYear = movie.release_date.slice(0, 4);
  const filmTitle = `${movie.title} (${filmYear})`;
  const movieId = movie.id;
  const movieRaiting = movie.vote_average;

  const libraryGalleryItemRef = document.createElement('li');
  libraryGalleryItemRef.classList.add('gallery-item-card');
  libraryGalleryItemRef.setAttribute('data-id', movieId);

  const libraryGalleryImageRef = document.createElement('img');
  libraryGalleryImageRef.src = imgPath;

  const libraryGalleryTitleRef = document.createElement('p');
  libraryGalleryTitleRef.classList.add('gallery-card-title');
  libraryGalleryTitleRef.textContent = filmTitle;

  const libraryGalleryRatingRef = document.createElement('p');
  libraryGalleryRatingRef.classList.add('gallery-card-raiting');
  libraryGalleryRatingRef.textContent = movieRaiting;

  libraryGalleryItemRef.appendChild(libraryGalleryRatingRef);
  libraryGalleryItemRef.appendChild(libraryGalleryImageRef);
  libraryGalleryItemRef.appendChild(libraryGalleryTitleRef);

  return libraryGalleryItemRef;
}

// Функция для создания/отрисовки списка фильмов
// Обращение к локальной памяти внутри функции. Если в памяти пусто,
// Вешается class message--active на <p> с текстом, который до этого
// был скрыт с помощью class message--hidden'
function drawFilmList(key, paneId) {
  const paneRef = getPaneById(paneId);
  const parsedFilms = getFilmListFromLocalStorage(key);

  if (parsedFilms === null || parsedFilms.length === 0) {
    const messageRef = paneRef.querySelector('.message');
    messageRef.classList.remove('message--hidden');
    messageRef.classList.add('message--active');
    return;
  }

  const listRef = paneRef.querySelector('.library-page-gallery');
  const filmsList = createFilmListFragment(parsedFilms);
  clearFilmList(listRef);
  listRef.appendChild(filmsList);
}

// Функция для создания/отрисовки списка фильмов в очереди на просмотр
function drawQueueFilmList() {
  drawFilmList('filmsQueue', 'queue');
}

// Функция для создания/отрисовки списка просмотренных фильмов
function drawWatchedFilmList() {
  drawFilmList('filmsWatched', 'watched');
}

// Функция для зачистки списка. Принимает аргументом ссылку на
// требуемый список
function clearFilmList(filmsListRef) {
  filmsListRef.innerHTML = '';
}

// Функция для получения данных с локальной памяти
// Принимает аргументом ключ
function getFilmListFromLocalStorage(key) {
  const filmsContainer = localStorage.getItem(key);
  return JSON.parse(filmsContainer);
}

// Функция для создания фрагмента документа с контентом
// Аргументами являются массив фильмов для отрисовки и ссылка на сам фрагмент документа
function createFilmListFragment(filmsArray) {
  let docFragmentRef = document.createDocumentFragment();
  filmsArray.forEach(film => {
    const filmEntry = createLibraryCardFunc(film);
    docFragmentRef.appendChild(filmEntry);
  });

  return docFragmentRef;
}

// Panes Queue/Watched => мастерская Саши Репеты

function onControlsClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'A') {
    return;
  }

  const activeControlItemRef = document.querySelector(
    '.controls__item--active',
  );

  if (activeControlItemRef) {
    activeControlItemRef.classList.remove('controls__item--active');
    const paneId = getPaneId(activeControlItemRef);
    const paneRef = getPaneById(paneId);
    paneRef.classList.remove('pane--active');
  }

  const controlItem = event.target;
  controlItem.classList.add('controls__item--active');

  const paneId = getPaneId(controlItem);
  const paneRef = getPaneById(paneId);
  paneRef.classList.add('pane--active');
}

function getPaneId(control) {
  return control.getAttribute('href').slice(1);
}

function getPaneById(id) {
  return refs.panes.querySelector(`#${id}`);
}

/////////////////////////////////
// Testing area. No tresspassing!
/////////////////////////////////
// localStorage.setItem('filmsQueue', JSON.stringify(filmObjArray));

// renderFilms.then(results =>
//   localStorage.setItem('filmsQueue', JSON.stringify(results)),
// );
