const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const paginationBar = document.querySelector('.pagination');
const prevBtn = document.querySelector('#previous__page');
const currentPage = document.querySelector('.current__page');
const delimiter = document.querySelector('.delimiter');
const totalPage = document.querySelector('.total__page');
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
  showCurrentPage();
  disabledPrevBtn();
  inputVaue = e.target.elements.query.value;
  fetchFilms(movieApi.pageNumber, inputVaue);
  
  // условие заполнения глобальной переменной renderFilms
  if (inputVaue.length === 0) {
    renderFilms = movieApi.fetchPopularMoviesList();
  } else {
    renderFilms = movieApi.fetchSearchFilmsList(inputVaue);
  }
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
  showCurrentPage();
};

// функция очистки инпута и параграфа ошибки при фокусе
function focusFunction() {
  clearError();
    searchForm.elements.query.value = '';
    movieApi.resetPage();
};
//  функция дезактивации кнопки prevBtn если номер страницы 1
function disabledPrevBtn() {
   if (movieApi.pageNumber === 1) {
      prevBtn.setAttribute('disabled', '');
    }
};
// функция отображения в параграфе пагинации содержимого movieApi.pageNumber
function showCurrentPage() {
    currentPage.textContent = movieApi.pageNumber;
};
function notFound() {
  errorArea.style.visibility = "visible";
  searchForm.elements.query.value = '';
};
function clearError() {
  errorArea.style.visibility = "hidden";
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
      renderFilms = movieApi.fetchPopularMoviesList();
    } else {
      fetchFilms(movieApi.pageNumber, inputVaue);
      renderFilms = movieApi.fetchSearchFilmsList(inputVaue);
    }
};

