const refs = {
  tabs: document.querySelector('.tabs'),
  tabPanes: document.querySelector('.tab-panes'),
  queueBtn: document.querySelector('[data-action-queue]'),
  watchedBtn: document.querySelector('[data-action-watched]'),
  favoriteBtn: document.querySelector('[data-action-favorite]'),
  galleryList: document.querySelector('.library-page-gallery'),
  mobileWatchedBtn: document.querySelector('.watched__link-mobile'),
  mobileQueueBtn: document.querySelector('.queue__link-mobile'),
  mobileFavoriteBtn: document.querySelector('.favorite__link-mobile'),
};
refs.tabs.addEventListener('click', onControlsClick);
refs.queueBtn.addEventListener('click', drawQueueFilmList);
refs.watchedBtn.addEventListener('click', drawWatchedFilmList);
refs.favoriteBtn.addEventListener('click', drawFavoriteFilmList);
refs.mobileWatchedBtn.addEventListener('click', activeWatchedMobile);
refs.mobileQueueBtn.addEventListener('click', activeQueuedMobile);
refs.mobileFavoriteBtn.addEventListener('click', activeFavoriteMobile);

let libraryTabs = null;
function drawFilmList(key, paneId) {
  const paneRef = getTabPaneById(paneId);
  const messageRef = paneRef.querySelector('.message');
  const listRef = paneRef.querySelector('.library-page-gallery');

  clearGallery(listRef);

  const parsedFilms = getFilmListFromLocalStorage(key);

  if (parsedFilms === null || parsedFilms.length === 0) {
    messageRef.classList.remove('message--hidden');
    messageRef.classList.add('message--shown');
    return;
  }

  messageRef.classList.add('message--hidden');
  messageRef.classList.remove('message--shown');

  const filmsList = createGalleryFragment(parsedFilms);
  listRef.appendChild(filmsList);
}

function drawQueueFilmList() {
  drawFilmList('filmsQueue', 'queue');
}

function drawWatchedFilmList() {
  drawFilmList('filmsWatched', 'watched');
}

function drawFavoriteFilmList() {
  drawFilmList('filmsFavorite', 'favorite');
}

function clearGallery(filmsListRef) {
  filmsListRef.innerHTML = '';
}

function getFilmListFromLocalStorage(key) {
  const filmsContainer = localStorage.getItem(key);
  return JSON.parse(filmsContainer);
}

function onControlsClick(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'A') {
    return;
  }

  const activeTabPaneRef = document.querySelector('.tab-pane--active');

  if (activeTabPaneRef) {
    activeTabPaneRef.classList.remove('tab-pane--active');
    const tabPaneId = getTabPaneId(activeTabPaneRef);
    const tabPaneRef = getTabPaneById(tabPaneId);
    tabPaneRef.classList.remove('tab-pane--active');
  }

  const activeTabPane = event.target;
  activeTabPane.classList.add('tab-pane--active');

  const tabPaneId = getTabPaneId(activeTabPane);
  const tabPaneRef = getTabPaneById(tabPaneId);
  tabPaneRef.classList.add('tab-pane--active');
}

function getTabPaneId(tab) {
  return tab.getAttribute('href').slice(1);
}

function getTabPaneById(id) {
  return refs.tabPanes.querySelector(`#${id}`);
}
