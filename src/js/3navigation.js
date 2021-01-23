const homeRef = document.querySelector('.home__link');
const libraryRef = document.querySelector('.library__link');
const homePageSectionRef = document.querySelector('[data-home-section]');
const librarySectionRef = document.querySelector('[data-library-section]');
const detailsSectionRef = document.querySelector('[data-details-section]');
const toggleQueueBtn = document.querySelector('[data-toggle-queue]');
const toggleWatchedBtn = document.querySelector('[data-toggle-watched]');
const favoriteBtn = document.querySelector('[data-toggle-favorite]');
const watchedBtn = document.querySelector('[data-action-watched]');
const queueBtn = document.querySelector('[data-action-queue]');
const favoriteMobileBtn = document.querySelector('[data-action-favorite]');
const logoRefs = document.querySelector('.logo__js');
const navigationRefs = document.querySelector('.navigation');
const togleSwitchBtn = document.querySelector('[data-action-togle]');
const homeMobileRef = document.querySelector('.home__link-mobile');
const libraryMobileRef = document.querySelector('.library__link-mobile');
const aboutContent = document.querySelector('.about__content');
const ditailsDescription = document.querySelector('#details__about');
const favoritePreTextIconRef = document.querySelector('[data-icon-favorite="addPlus"]');
const favoriteSpanTextRef = document.querySelector('[data-favorite-text="textButton"]');
const queuePreTextIconRef = document.querySelector('[data-icon-queue="addPlus"]');
const watchedSpanTextRef = document.querySelector('[data-watched-text="textButton"]');
const watchedPreTextIconRef = document.querySelector('[data-icon-watched="addPlus"]');
const queueSpanTextRef = document.querySelector('[data-queue-text="textButton"]');
const returnBtn = detailsSectionRef.querySelector('#return__btn');

let selectFilm = {};
homeRef.addEventListener('click', activeHomePage);
logoRefs.addEventListener('click', activeHomePage);
libraryRef.addEventListener('click', activeLibraryPage);
togleSwitchBtn.addEventListener('click', switchTheme);
homeMobileRef.addEventListener('click', activeHomePage);
libraryMobileRef.addEventListener('click', activeLibraryPage);
returnBtn.addEventListener('click', isReturnBtn);

function activeHomePage(e) {
  e.preventDefault();
  movieApi.resetPage();
  clearInput();
  trailer.clearTrailerKey();
  renderFilms = movieApi.fetchPopularFilmsList();
  renderPopularFilms().then(() => {
    paginator.recalculate(movieApi.totalPages);
  });
  toggleActiveLink(homeRef);
  homeMobileRef.classList.add('sidenav-close');
  homePageSectionRef.classList.remove('is-hidden');
  librarySectionRef.classList.add('is-hidden');
  detailsSectionRef.classList.add('is-hidden');
}
function activeLibraryPage(e) {
  e.preventDefault();
  clearInput();
  trailer.clearTrailerKey();
  toggleActiveLink(libraryRef);
  libraryMobileRef.classList.add('sidenav-close');
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailsSectionRef.classList.add('is-hidden');

  queueBtn.focus();
  libraryTabs.select('queue');
  drawQueueFilmList();
  drawWatchedFilmList();
  drawFavoriteFilmList();
}
function activeWatchedMobile(e) {
  e.preventDefault();
  clearInput();
  toggleActiveLink(libraryRef);
  libraryMobileRef.classList.add('sidenav-close');
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailsSectionRef.classList.add('is-hidden');
  refs.mobileWatchedBtn.classList.add('sidenav-close');

  watchedBtn.focus();
  libraryTabs.select('watched');
  drawQueueFilmList();
  drawWatchedFilmList();
  drawFavoriteFilmList();
}

function activeQueuedMobile(e) {
  e.preventDefault();
  clearInput();
  toggleActiveLink(libraryRef);
  libraryMobileRef.classList.add('sidenav-close');
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailsSectionRef.classList.add('is-hidden');
  refs.mobileQueueBtn.classList.add('sidenav-close');
  queueBtn.focus();
  libraryTabs.select('queue');

  drawQueueFilmList();
  drawWatchedFilmList();
  drawFavoriteFilmList();
}

function activeFavoriteMobile(e) {
  e.preventDefault();
  clearInput();
  toggleActiveLink(libraryRef);
  libraryMobileRef.classList.add('sidenav-close');
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailsSectionRef.classList.add('is-hidden');
  refs.mobileFavoriteBtn.classList.add('sidenav-close');
  favoriteMobileBtn.focus();
  libraryTabs.select('favorite');

  drawQueueFilmList();
  drawWatchedFilmList();
  drawFavoriteFilmList();
}
function activeDetailsPage(movieId, itsLibraryFilm) {
  detailsSectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  librarySectionRef.classList.add('is-hidden');
  const filmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
  const filmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));
  const filmsFavorite = JSON.parse(localStorage.getItem('filmsFavorite'));
  if (itsLibraryFilm) {
    if (watchedBtn.classList.contains('active')) {
      selectFilm = filmsWatched.find(el => {
        if (el.id === movieId) {
          return el;
        }
      });
    } else if (queueBtn.classList.contains('active')) {
      selectFilm = filmsQueue.find(el => {
        if (el.id === movieId) {
          return el;
        }
      });
    } else {
      selectFilm = filmsFavorite.find(el => {
        if (el.id === movieId) {
          return el;
        }
      });
    }
  } else {
    selectFilm = renderFilms.then(data => {
      return data.find(el => {
        if (el.id === movieId) {
          trailer.renderMovieTrailer(el.id);
          return el;
        }
      });
    });
  }

  showDetails(selectFilm);
  toggleQueueBtn.addEventListener('click', toggleToQueue);
  toggleWatchedBtn.addEventListener('click', toggleToWatched);
  favoriteBtn.addEventListener('click', toggleToFavorite);
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.active');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('active');
  }
  link.classList.add('active');
}

const goTopBtn = document.querySelector('.back__to__top');

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;
  if (scrolled > coords) {
    goTopBtn.classList.add('back__to__top-show');
  }
  if (scrolled < coords) {
    goTopBtn.classList.remove('back__to__top-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 20);
  }
}

function isReturnBtn() {
  trailer.clearTrailerKey();

  if (libraryRef.classList.contains('active')) {
    librarySectionRef.classList.remove('is-hidden');
    homePageSectionRef.classList.add('is-hidden');
    detailsSectionRef.classList.add('is-hidden');
    drawQueueFilmList();
    drawWatchedFilmList();
    drawFavoriteFilmList();
  } else {
    homePageSectionRef.classList.remove('is-hidden');
    librarySectionRef.classList.add('is-hidden');
    detailsSectionRef.classList.add('is-hidden');
  }
}
