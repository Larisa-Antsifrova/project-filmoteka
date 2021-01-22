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
  renderFilms = movieApi.fetchSearchFilmsList(movieApi.searchQuery);
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

function clearInput() {
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
}

// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = 'visible';
  setTimeout(clearError, 2000);
  clearInput();
  movieApi.resetPage();

  return renderPopularFilms().then(() => {
    paginator.recalculate(movieApi.totalPages);
  });
}

function clearError() {
  errorArea.style.visibility = 'hidden';
}

const trailer = {
  trailerSection: document.querySelector('.trailer'),
  trailerItem: document.createElement('li'),
  YOUTUBE_URL: 'https://www.youtube.com//embed/',
  trailerKey: '',

  renderMovieTrailer(el) {
    movieApi.fetchTrailersAPI(el).then(this.createTrailerBtn.bind(this));
  },
  // функция принимает ключ трейлера и вставляет полную ссылку на него в li
  createTrailerRef(key) {
    this.trailerItem.classList.add('trailer__ref');
    const fullURL = `${this.YOUTUBE_URL}${key}`;
    const trailerRef = `<a href="${fullURL}" class='waves-effect waves-light btn-small pink'><i class="material-icons left">videocam</i> <span>Watch me!</span></a>`;
    this.trailerItem.insertAdjacentHTML('afterbegin', trailerRef);
    return this.trailerItem;
  },
  createDisabledButton() {
    this.trailerItem.classList.add('trailer__ref');
    const disabledBtn = `<a href="#" class='disabled btn-small '><i class="material-icons left">videocam_off</i> <span>No trailer</span></a>`;
    this.trailerItem.insertAdjacentHTML('afterbegin', disabledBtn);
    return this.trailerItem;
  },

  // функция принимает li с ссылкой и вставляет в список
  createTrailerBtn(trailer) {
    if (!trailer) {
      const trailerBtn = this.createDisabledButton();
      this.trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
      return;
    }

    this.trailerKey = trailer.key;
    const trailerBtn = this.createTrailerRef(this.trailerKey);
    this.trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
    this.trailerSection.addEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
  clearTrailerKey() {
    this.trailerItem.innerHTML = '';
    this.trailerSection.removeEventListener('click', modalWindow.openModal.bind(modalWindow));
  },
};

const modalWindow = {
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
  lightboxCard: document.querySelector('.js-lightbox'),
  trailerVideo: document.querySelector('.trailer_referense'),

  openModal(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'A') {
      return;
    }
    this.trailerVideo.src = event.target.href;
    this.lightboxCard.classList.add('is-open');
    this.lightboxOverlay.addEventListener('click', this.onClickOverlay.bind(this));
    this.addKeydownListener();
  },
  addKeydownListener() {
    window.addEventListener('keydown', this.onPressEscape.bind(this));
  },
  removeKeydownListener() {
    window.removeEventListener('keydown', this.onPressEscape.bind(this));
  },
  onClickOverlay(event) {
    if (event.target === event.currentTarget) {
      this.closeLightboxHandler();
    }
  },
  onPressEscape(event) {
    if (event.code === 'Escape') {
      this.closeLightboxHandler();
    }
  },
  closeLightboxHandler() {
    this.removeKeydownListener();
    this.lightboxCard.classList.remove('is-open');
    this.trailerVideo.src = '';
    this.lightboxOverlay.removeEventListener('click', this.onClickOverlay.bind(this));
  },
};
