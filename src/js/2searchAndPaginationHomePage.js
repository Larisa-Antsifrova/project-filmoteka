const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const paginationBar = document.querySelector('.pagination');
const prevBtn = document.querySelector('#previous__page');
const firstPage = document.querySelector('.first__page');
const delimiter = document.querySelector('.delimiter');
const totalPage = document.querySelector('.total__page');
const nextBtn = document.querySelector('#next__page');
const lastPage = document.querySelector('.total__page');

const paginationBtn = [...document.getElementsByClassName('spread__page')];

// глобальная переменная inputVaue
let inputVaue = '';

// слушатели событий
searchForm.addEventListener('click', onInputFocus);
searchForm.addEventListener('submit', searchFilms);
firstPage.addEventListener('click', getFirstPage);
delimiter.addEventListener('click', renderPageOnNumBtn);
prevBtn.addEventListener('click', paginationNavigation);
nextBtn.addEventListener('click', paginationNavigation);
lastPage.addEventListener('click', getLastPage);

// функции
// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  disabledPrevBtn();
  inputVaue = e.target.elements.query.value;
  toggleRenderPage();
};
// функция рендера страницы запроса
function fetchFilms(pageNumber, inputVaue) {
  let query = '';
  if (inputVaue.length > 0 && inputVaue.trim() !== '') {
    query = inputVaue.trim();
  } else {
    return;
    };
    
    movieApi
        .fetchSearchFilmsList(query)
        .then(createGallery)
      .then(fragment => renderGallery(fragment, homePageRef));
}
// функция отображения страниц зарпосов
function paginationNavigation(e) {
  const activeBtn = e.currentTarget.id;
  if (activeBtn === 'previous__page') {
    movieApi.decrementPage();
    disabledPrevBtn();
    clearHomePage();
    toggleRenderPage();
  }

  if (activeBtn === 'next__page') {
    movieApi.incrementPage();
    if (movieApi.pageNumber > 1) {
      prevBtn.removeAttribute('disabled');
    }
    clearHomePage();
    toggleRenderPage();
  }
};
// функция выбора отображения страницы в зависимости от наличия текстa в инпуте
function toggleRenderPage() {
    if (inputVaue.length === 0) {
      renderPopularMoviesList();
      renderFilms = movieApi.fetchPopularMoviesList();
    } else {
      fetchFilms(movieApi.pageNumber, inputVaue);
      renderFilms = movieApi.fetchSearchFilmsList(inputVaue);
    }
};
// функция очистки инпута и параграфа ошибки при фокусе
function onInputFocus() {
  clearError();
  clearInput();
  movieApi.resetPage();
};
//  функция дезактивации кнопки prevBtn если номер страницы 1
function disabledPrevBtn() {
   if (movieApi.pageNumber < 6) {
      prevBtn.setAttribute('disabled', '');
   } else {
     prevBtn.removeAttribute('disabled');
    }
};
// функция перехода на первую страницу
function getFirstPage() {
  movieApi.pageNumber = 1;
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
}
// функция перехода на последнюю страницу
function getLastPage() {
  movieApi.pageNumber = movieApi.totalPages;
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
};
// функция очистки инпута и запроса
function clearInput() {
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
  inputVaue = '';
};
// функция реагирования на некорректный запрос
function notFound() {
  errorArea.style.visibility = "visible";
  const timeOfVisibleError = setTimeout(clearError, 2000);
  clearInput();
  movieApi.resetPage();
  disabledPrevBtn();
  return renderPopularMoviesList();
};
// функция сокрытия строки ошибки
function clearError() {
  errorArea.style.visibility = "hidden";
};
// функция очистки стартовой страницы
function clearHomePage() {
  homePageRef.innerHTML = '';
};
// функция c кнопки "next" в ответ на рендер
function deactivationBtnNext(params) {
  if (params.results.length < movieApi.perPage || params.total_pages < 5) {
    nextBtn.setAttribute('disabled', '');
    } else {
    nextBtn.removeAttribute('disabled');
  }
};
// функция дезактивации кнопок пагинации в ответ на рендер
function deactivationPaginationBtn(params) {
  if (params.total_pages < 5
    || params.total_pages === movieApi.pageNumber
    || movieApi.pageNumber >= (movieApi.totalPages - 4)) {
    paginationBtn.map(e => {
      if (e.textContent > params.total_pages) {
        e.setAttribute('disabled', '');
      } else {
        e.removeAttribute('disabled');
      }
    })
  } else {
    paginationBtn.map(e => e.removeAttribute('disabled'))
  }
};
// функция рендера содержимого группы кнопок пагинации
function createPaginationMarkup(resp) {
  paginationBtn.map(e => {
    e.textContent = resp.page++;
  })
}
// функция отзыва кнопок и рендера страницы по номеру кнопки
function renderPageOnNumBtn(evt) {
  movieApi.pageNumber = evt.target.textContent;
  deactivationPaginationBtn(evt);
  disabledPrevBtn();
  clearHomePage();
  toggleRenderPage();
};


// ==== for modal window ====
const trailerSection = document.querySelector('.trailer');
const lightboxOverlay = document.querySelector('.lightbox__overlay');
const lightboxCard = document.querySelector('.js-lightbox');
const trailerVideo = document.querySelector('.trailer_referense');

trailerSection.addEventListener('click', openModale);
lightboxOverlay.addEventListener('click', onClickOverlay);


// ================= trailer ======================
function fetchTrailersAPI(el) {
  return fetch(`${movieApi.baseUrl}movie/${el}/videos?api_key=${movieApi.apiKey}&language=en-US`)
    .then(response => response.json())
    .then(resp => resp)
    .then(({ results }) => {
      // проверка на наличие трейлера
      if (!results.length) {
        return
      } else {
        return results.find(e => {
          if (e.type == 'Trailer') {
            return e
          }
        })
      }
    })
}

// функция принимает li с ссылкой и вставляет в список
function createTrailerBtn(trailer) {
  // ============== тут продумать логику рендера кнопки ==============
  const className = detailisSectionRef.attributes.class.textContent;
  if (!trailer || className.includes('is-hidden')) {
      console.log('non', trailer);

    return
  }
  console.log('trailer', trailer);
  const trailerBtn = createTrailerRef(trailer.key);
  trailerSection.insertAdjacentElement('afterbegin', trailerBtn);
};
// функция принимает ключ трейлера и вставляет полную ссылку на него в li
function createTrailerRef(key) {
  const trailerItem = document.createElement('li');
  trailerItem.classList.add('trailer__ref');
  const YouTubeURL = 'https://www.youtube.com//embed/';
  const fullURL = `${YouTubeURL}${key}`;
  const trailerRef = `<a href="${fullURL}" class='trailer__a'>Trailer</a>`;
  trailerItem.insertAdjacentHTML('afterbegin', trailerRef);
  return trailerItem;
};

function renderMovieTrailer(el) {
  fetchTrailersAPI(el)
    .then(createTrailerBtn)
};


// ==== modal window =====
function openModale(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'A') {
    return
  };
  trailerVideo.src = event.target.href
  lightboxCard.classList.add('is-open');
  lightboxOverlay.addEventListener('click', onClickOverlay);
  trailerSection.removeEventListener('click', openModale);
  addKeydownListener();
};

function onClickOverlay(event) {
     if (event.target === event.currentTarget) {
        closeLightboxHandler()
    }
};
function onPressEscape(event) {
    if (event.code === 'Escape') {
        closeLightboxHandler()
        }
};
function closeLightboxHandler() {
    removeKeydownListener();
    lightboxCard.classList.remove('is-open');
    trailerVideo.src = '';
    lightboxOverlay.removeEventListener('click', onClickOverlay);
    trailerSection.addEventListener('click', openModale);
};
function addKeydownListener() {
    window.addEventListener('keydown', onPressEscape);
};
function removeKeydownListener() {
    window.removeEventListener('keydown', onPressEscape);
};
