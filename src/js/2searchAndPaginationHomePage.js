const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const plaginationBar = document.querySelector('.plagination');
const prevBtn = document.querySelector('#previous__page');
const currentPage = document.querySelector('.current__page');
const nextBtn = document.querySelector('#next__page');

// глобальная переменная inputVaue
let inputVaue = '';

// слушатели событий
searchForm.addEventListener('submit', searchFilms);
prevBtn.addEventListener('click', plaginationNavigation);
nextBtn.addEventListener('click', plaginationNavigation);

// функции
// функция-слушатель инпута и отображения страницы согласно запросу
function searchFilms(e) {
  e.preventDefault();
  inputVaue = e.target.elements.query.value;
  fetchFilms(pageNumber, inputVaue);
}
// функция рендера страницы запроса
function fetchFilms(pageNumber, inputVaue) {
  let query = '';
  if (inputVaue.length > 0 && inputVaue.trim() !== '') {
    query = inputVaue.trim();
  } else {
    return;
  }

  createCardFunc();

  fetch(
    `${movieApi.baseUrl}search/movie?api_key=${movieApi.apiKey}&language=en-US&query=${query}&page=${pageNumber}`,
  )
    .then(res => res.json())
    .then(({ results }) => {
      // тут прописана логика вывода ошибки и активности кнопки "next" в ответ на рендер
      if (results.length === 0) {
        notFound();
      }
      if (results.length === 20) {
        nextBtn.removeAttribute('disabled');
      } else {
        nextBtn.setAttribute('disabled', '');
      }
      return results;
    })
    .then(movies => {
      clearhomePage();
      const popularMoviesFragment = document.createDocumentFragment();
      movies.forEach(movie => {
        const imgPath = movieApi.baseImageUrl + 'w500' + movie.backdrop_path;
        const filmTitle = movie.title;
        const movieId = movie.id;
        const popularMoviesItem = createCardFunc(imgPath, filmTitle, movieId);

        popularMoviesFragment.appendChild(popularMoviesItem);
      });

      return popularMoviesFragment;
    })
    .then(fragment => homePageRef.appendChild(fragment));

  //   clearhomePage();
  //   createCardFunc();
}

// функция отображения страниц зарпосов
function plaginationNavigation(e) {
  const activeBtn = e.currentTarget.id;
  if (activeBtn === 'previous__page') {
    pageNumber -= 1;
    if (pageNumber === 1) {
      prevBtn.setAttribute('disabled', '');
    }
    clearhomePage();
    if (inputVaue.length === 0) {
      fetchPopularMoviesList();
    } else {
      fetchFilms(pageNumber, inputVaue);
    }
  }

  if (activeBtn === 'next__page') {
    pageNumber += 1;
    if (pageNumber > 1) {
      prevBtn.removeAttribute('disabled');
    }
    clearhomePage();
    if (inputVaue.length === 0) {
      fetchPopularMoviesList();
    } else {
      fetchFilms(pageNumber, inputVaue);
    }
  }
  currentPage.textContent = pageNumber;
}
// функция очистки инпута и параграфа ошибки при фокусе
function focusFunction() {
  clearError();
  searchForm.children.query.value = '';
}

function notFound() {
  errorArea.insertAdjacentHTML(
    'afterbegin',
    '<span>По вашему запросу ничего не найдено. Попробуйте еще раз!</span>',
  );
}
function clearError() {
  errorArea.innerHTML = '';
}
function clearhomePage() {
  homePageRef.innerHTML = '';
}

console.log(errorArea);
