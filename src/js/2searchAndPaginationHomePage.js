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
searchForm.addEventListener('click', focusFunction);
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

function notFound() {
  errorArea.style.visibility = "visible";
  const timeOfVisibleError = setTimeout(clearError, 2000);
  searchForm.elements.query.value = '';
  movieApi.searchQuery = '';
  movieApi.resetPage();
  disabledPrevBtn();
  return renderPopularMoviesList();

};
function clearError() {
  errorArea.style.visibility = "hidden";
};
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
  clearHomePage();
  toggleRenderPage();
};
