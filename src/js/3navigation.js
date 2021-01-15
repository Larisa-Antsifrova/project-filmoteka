const homeRef = document.querySelector('.home__link');
const libraryRef = document.querySelector('.library__link');
const homePageSectionRef = document.querySelector('[data-home-section]');
const librarySectionRef = document.querySelector('[data-library-section]');
const detailisSectionRef = document.querySelector('[data-detailis-section]');
const toggleQueueBtn = document.querySelector('[data-toggle-queue]');
const toggleWatchedBtn = document.querySelector('[data-toggle-watched]');
const watchedBtn = document.querySelector('[data-action-watched]');
const queueBtn = document.querySelector('[data-action-queue]');
const logoRefs = document.querySelector('.logo__js');
const navigationRefs = document.querySelector('.navigation');

// создаем глобальную переменную selectFilm
let selectFilm = {};

//вешаем слушатели
// homeRef.addEventListener('click', activeHomePage);
// logoRefs.addEventListener('click', activeHomePage);
// libraryRef.addEventListener('click', activeLibraryPage);

//создаем функцию activeHomePage которая показывает домашнюю страницу и прячет остальные
function activeHomePage(e) {
  e.preventDefault();
  toggleActiveLink(homeRef);

  homePageSectionRef.classList.remove('is-hidden');
  librarySectionRef.classList.add('is-hidden');
  detailisSectionRef.classList.add('is-hidden');
}
//создаем функцию activeLibraryPage которая показывает домашнюю страницу и прячет остальные
function activeLibraryPage(e) {
  e.preventDefault();
  toggleActiveLink(libraryRef);
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailisSectionRef.classList.add('is-hidden');
  drawQueueFilmList();
}

// создаем функцию activeDetailsPage которая показывает страницу детальной отрисовки фильма
function activeDetailsPage(movieId, itsLibraryFilm) {
  detailisSectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  librarySectionRef.classList.add('is-hidden');

  if (itsLibraryFilm) {
    selectFilm = JSON.parse(localStorage.getItem('filmsQueue'));
    return selectFilm.find(el => {
      if (el.id === movieId) {
        return el;
      }
    });
  } else {
    selectFilm = renderFilms.then(data => {
      return data.find(el => {
        if (el.id === movieId) {
          return el;
        }
      });
    });
  }

  showDetails(selectFilm);
  toggleQueueBtn.addEventListener('click', toggleToQueue);
  toggleWatchedBtn.addEventListener('click', toggleToWatched);
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.current');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('current');
  }
  link.classList.add('current');
}

// КНОПКА ВВЕРХ получение доступа и логика
const goTopBtn = document.querySelector('.back__to__top');

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);

// функция получения скролла страници и получние высоты одного экрана
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
// функция скролла вверх и ацнимация с помощью setTimout
function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 20);
  }
}
