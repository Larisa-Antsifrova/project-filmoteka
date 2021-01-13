// Функция, которая создаёт одну карточку для фильма в  МОЕЙ ГАЛЕРЕЕ.
// Принимает один объект фильма from locale storage.

function createLibraryCardFunc(movieObj) {
  const filmYear = movieObj.year;
  const filmTitle = `${movieObj.title} (${filmYear})`;
  const movieId = movieObj.id;
  const movieRaiting = movieObj.vote_average;
  const imgPath = movieObj.img;

  const libraryGalleryItem = document.createElement('li');
  libraryGalleryItem.classList.add('library-gallery-item');
  libraryGalleryItem.setAttribute('data-library-id', movieId);

  const libraryGalleryImage = document.createElement('img');
  libraryGalleryImage.src = imgPath;

  const libraryGalleryTitle = document.createElement('p');
  libraryGalleryTitle.classList.add('library-gallery-title');
  libraryGalleryTitle.textContent = filmTitle;

  const libraryGalleryRating = document.createElement('p');
  libraryGalleryRating.classList.add('library-gallery-raiting');
  libraryGalleryRating.textContent = movieRaiting;

  libraryGalleryItem.appendChild(libraryGalleryRating);
  libraryGalleryItem.appendChild(libraryGalleryImage);
  libraryGalleryItem.appendChild(libraryGalleryTitle);

  // Добавление слушателя события, чтобы открыть страницу с деталями.
  // Для делегирования событий использую класс, общий для списка просмотренных
  // и фильмов в очереди (ПРАВИЛЬНО ЛИ???)
  const libraryGalleryListRef = document.querySelector('.');
  libraryGalleryListRef.addEventListener('click', () => {
    // Консолька для проверки, что слушатель события еще на месте.
    console.log('Hello, I am click event!');
    activeDetailsPage(movieId, false);
  });

  return libraryGalleryItem;
}

function drawQueueFilmList() {
  const libraryGalleryQueueFragment = document.createDocumentFragment();
  const queuedFilmsContainer = localStorage.getItem('filmsQueue');
  const parsedQueuedFilms = JSON.parse(queuedFilmsContainer);

  if (parsedQueuedFilms.isEmpty) {
    const messageRef = document.querySelector('#queue .message');
    messageRef.classList.remove('message--hidden');
    messageRef.classList.add('message--active');
  }
}

function drawWatchedFilmList() {
  const libraryGalleryWatchedFragment = document.createDocumentFragment();
  const watchedFilmsContainer = localStorage.getItem('filmsWatched');
  const parsedWatchedFilms = JSON.parse(watchedFilmsContainer);

  if (parsedWatchedFilms.isEmpty) {
    const messageRef = document.querySelector('#watched .message');
    messageRef.classList.remove('message--hidden');
    messageRef.classList.add('message--active');
  }
}

// Tabs Queue/Watched
const refs = {
  controls: document.querySelector('[data-controls]'),
  panes: document.querySelector('[data-panes]'),
};

refs.controls.addEventListener('click', onControlsClick);

function onControlsClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'A') {
    return;
  }

  const activeControlItem = document.querySelector('.controls__item--active');

  if (activeControlItem) {
    activeControlItem.classList.remove('controls__item--active');
    const paneId = getPaneId(activeControlItem);
    const pane = getPaneById(paneId);
    pane.classList.remove('pane--active');
  }

  const controlItem = event.target;
  controlItem.classList.add('controls__item--active');

  const paneId = getPaneId(controlItem);
  const pane = getPaneById(paneId);
  pane.classList.add('pane--active');
}

function getPaneId(control) {
  return control.getAttribute('href').slice(1);
}

function getPaneById(id) {
  return refs.panes.querySelector(`#${id}`);
}
