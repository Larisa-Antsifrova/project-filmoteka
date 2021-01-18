const homeRef = document.querySelector('.home__link');
const libraryRef = document.querySelector('.library__link');
const homePageSectionRef = document.querySelector('[data-home-section]');
const librarySectionRef = document.querySelector('[data-library-section]');
const detailisSectionRef = document.querySelector('[data-detailis-section]');
const toggleQueueBtn = document.querySelector('[data-toggle-queue]');
const toggleWatchedBtn = document.querySelector('[data-toggle-watched]');
const watchedBtn = document.querySelector('[data-action-watched]');
const queueBtn = document.querySelector('[data-action-queue]');
const favoriteBtn = document.querySelector('[data-toggle-favorite]');
const logoRefs = document.querySelector('.logo__js');
const navigationRefs = document.querySelector('.navigation');
const togleSwitchBtn = document.querySelector('[data-action-togle]');
// получаем доступ к mobile-menu
const homeMobileRef = document.querySelector('.home__link-mobile');
const libraryMobileRef = document.querySelector('.library__link-mobile');
// получаем доступ к details About и кнопке Read More
const readMoreBtn = document.getElementById('read__more');
const aboutContent = document.querySelector('.about__content');
const ditailsDescription = document.querySelector('#details__about');

// создаем глобальную переменную selectFilm
let selectFilm = {};

// создаем обьект с методами переключения темы
const togleSwitchTheme = {
  refs: {
    bodyRef: document.querySelector('body'),
    headerRef: document.querySelector('nav'),
    searchContainerRef: document.querySelector('.search-container'),
    linkRef: document.querySelector('.btn-floating'),
    detailsH2Ref: detailisSectionRef.querySelector('h2'),
    detailsH3Ref: detailisSectionRef.querySelector('h3'),
    detailsAboutRef: detailisSectionRef.querySelector('#details__about'),
    detailsDescriptionRef: detailisSectionRef.querySelector(
      '.details-about-text',
    ),
  },

  removeClass(ref, className) {
    ref.classList.remove(className);
  },
  addClass(ref, className) {
    ref.classList.add(className);
  },

  switchTheme(e) {
    if (e.target.textContent === 'brightness_6') {
      togleSwitchTheme.removeClass(togleSwitchTheme.refs.bodyRef, 'white');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.bodyRef, 'black');

      togleSwitchTheme.removeClass(togleSwitchTheme.refs.headerRef, 'indigo');
      togleSwitchTheme.removeClass(togleSwitchTheme.refs.headerRef, 'darken-2');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'blue-grey');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'darken-4');

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.searchContainerRef,
        'indigo',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.searchContainerRef,
        'blue-grey',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.searchContainerRef,
        'darken-2',
      );

      togleSwitchTheme.removeClass(togleSwitchTheme.refs.linkRef, 'indigo');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.linkRef, 'pink');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.linkRef, 'accent-3');

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'indigo-text',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'pink-text',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'text-accent-3',
      );

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'indigo-text',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'pink-text',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'text-accent-3',
      );
      // blue-grey lighten-5
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsAboutRef,
        'blue-grey-text',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsAboutRef,
        'text-lighten-2',
      );

      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsDescriptionRef,
        'text-lighten-2',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsDescriptionRef,
        'blue-grey-text',
      );

      togleSwitchBtn.children[0].textContent = 'brightness_5';
      localStorage.setItem('Theme', 'DARK');
    } else if (e.target.textContent === 'brightness_5') {
      togleSwitchTheme.removeClass(togleSwitchTheme.refs.bodyRef, 'black');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.bodyRef, 'white');

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.headerRef,
        'blue-grey',
      );
      togleSwitchTheme.removeClass(togleSwitchTheme.refs.headerRef, 'darken-4');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'indigo');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'darken-2');

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.searchContainerRef,
        'blue-grey',
      );
      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.searchContainerRef,
        'darken-2',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.searchContainerRef,
        'indigo',
      );

      togleSwitchTheme.removeClass(togleSwitchTheme.refs.linkRef, 'pink');
      togleSwitchTheme.removeClass(togleSwitchTheme.refs.linkRef, 'accent-3');
      togleSwitchTheme.addClass(togleSwitchTheme.refs.linkRef, 'indigo');

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'pink-text',
      );
      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'text-accent-3',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH2Ref,
        'indigo-text',
      );

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'pink-text',
      );
      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'text-accent-3',
      );
      togleSwitchTheme.addClass(
        togleSwitchTheme.refs.detailsH3Ref,
        'indigo-text',
      );

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsDescriptionRef,
        'blue-grey-text',
      );

      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsAboutRef,
        'blue-grey-text',
      );
      togleSwitchTheme.removeClass(
        togleSwitchTheme.refs.detailsAboutRef,
        'text-lighten-2',
      );

      togleSwitchBtn.children[0].textContent = 'brightness_6';
      localStorage.removeItem('Theme');
    }
  },
};

// условие при котором нужно добавить или удалить классы с DOM елементов
if (localStorage.getItem('Theme') === 'DARK') {
  togleSwitchBtn.children[0].textContent = 'brightness_5';
  togleSwitchTheme.addClass(togleSwitchTheme.refs.bodyRef, 'black');
  togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'blue-grey');
  togleSwitchTheme.addClass(togleSwitchTheme.refs.headerRef, 'darken-4');
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.searchContainerRef,
    'blue-grey',
  );
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.searchContainerRef,
    'darken-2',
  );
  togleSwitchTheme.addClass(togleSwitchTheme.refs.linkRef, 'pink');
  togleSwitchTheme.addClass(togleSwitchTheme.refs.linkRef, 'accent-3');
  togleSwitchTheme.removeClass(togleSwitchTheme.refs.linkRef, 'indigo');
  togleSwitchTheme.removeClass(
    togleSwitchTheme.refs.detailsH2Ref,
    'indigo-text',
  );
  togleSwitchTheme.addClass(togleSwitchTheme.refs.detailsH2Ref, 'pink-text');
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.detailsH2Ref,
    'text-accent-3',
  );
  togleSwitchTheme.removeClass(
    togleSwitchTheme.refs.detailsH3Ref,
    'indigo-text',
  );
  togleSwitchTheme.addClass(togleSwitchTheme.refs.detailsH3Ref, 'pink-text');
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.detailsH3Ref,
    'text-accent-3',
  );

  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.detailsDescriptionRef,
    'blue-grey-text',
  );
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.detailsAboutRef,
    'blue-grey-text',
  );
  togleSwitchTheme.addClass(
    togleSwitchTheme.refs.detailsAboutRef,
    'text-lighten-2',
  );
}
// вешаем слушатели
homeRef.addEventListener('click', activeHomePage);
logoRefs.addEventListener('click', activeHomePage);
libraryRef.addEventListener('click', activeLibraryPage);
togleSwitchBtn.addEventListener('click', togleSwitchTheme.switchTheme);
homeMobileRef.addEventListener('click', activeHomePage);
libraryMobileRef.addEventListener('click', activeLibraryPage);

//создаем функцию activeHomePage которая показывает домашнюю страницу и прячет остальные
function activeHomePage(e) {
  e.preventDefault();
  movieApi.resetPage();
  clearInput();
  renderFilms = movieApi.fetchPopularMoviesList();
  renderPopularMoviesList();
  toggleActiveLink(homeRef);

  homePageSectionRef.classList.remove('is-hidden');
  librarySectionRef.classList.add('is-hidden');
  detailisSectionRef.classList.add('is-hidden');
}
//создаем функцию activeLibraryPage которая показывает домашнюю страницу и прячет остальные
function activeLibraryPage(e) {
  e.preventDefault();
  clearInput();
  toggleActiveLink(libraryRef);
  librarySectionRef.classList.remove('is-hidden');
  homePageSectionRef.classList.add('is-hidden');
  detailisSectionRef.classList.add('is-hidden');
  // drawQueueFilmList();
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
  favoriteBtn.addEventListener('click', toggleToFavorite);
}

function toggleActiveLink(link) {
  const currentActiveLink = navigationRefs.querySelector('.active');
  if (currentActiveLink) {
    currentActiveLink.classList.remove('active');
  }
  link.classList.add('active');
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
