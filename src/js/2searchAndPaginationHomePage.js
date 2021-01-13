const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const plaginationBar = document.querySelector('.plagination');
const prevBtn = document.querySelector('#previous__page');
const currentPage = document.querySelector('.current__page');
const nextBtn = document.querySelector('#next__page');

// глобальная переменная inputVaue
let inputVaue = '';

// слушатели событий
searchForm.addEventListener('click', focusFunction);
searchForm.addEventListener('submit', searchFilms);
prevBtn.addEventListener('click', paginationNavigation);
nextBtn.addEventListener('click', paginationNavigation);

// функции
// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  inputVaue = e.target.elements.query.value;
  fetchFilms(movieApi.pageNumber, inputVaue);
}
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
    if (movieApi.pageNumber === 1) {
      prevBtn.setAttribute('disabled', '');
    }
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
  currentPage.textContent = movieApi.pageNumber;
};

// функция очистки инпута и параграфа ошибки при фокусе
function focusFunction() {
  clearError();
    searchForm.children.query.value = '';
    movieApi.resetPage();
};

function notFound() {
  errorArea.insertAdjacentHTML(
    'afterbegin',
    '<span>По вашему запросу ничего не найдено. Попробуйте еще раз!</span>',
  );
};
function clearError() {
  errorArea.innerHTML = '';
};
function clearHomePage() {
  homePageRef.innerHTML = '';
};
// функция дезактивации кнопки "next" в ответ на рендер
function disactiveBtnNext(params) {
      if (params.length === movieApi.perPage) {
        nextBtn.removeAttribute('disabled');
      } else {
        nextBtn.setAttribute('disabled', '');
      }
};
// функция выбора отображения страницы в зависимости от наличия текст в инпуте
function toggleRenderPage() {
    if (inputVaue.length === 0) {
      renderPopularMoviesList();
    } else {
      fetchFilms(movieApi.pageNumber, inputVaue);
    }
};

