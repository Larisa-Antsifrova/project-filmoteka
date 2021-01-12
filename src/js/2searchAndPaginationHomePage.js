const searchForm = document.querySelector('.search__form');
const errorArea = document.querySelector('.error__area');
const plaginationBar = document.querySelector('.plagination');
const prevBtn = document.querySelector('#previous__page');
const currentPage = document.querySelector(".current__page");
const nextBtn = document.querySelector('#next__page');

// глобальная переменная inputVaue
let inputVaue = '';

// слушатели событий
searchForm.addEventListener('submit', searchFilms);
prevBtn.addEventListener('click', plaginationNavigation);
nextBtn.addEventListener('click', plaginationNavigation);


// функции
function searchFilms(e) {
    e.preventDefault();
    inputVaue = e.target.elements.query.value;
    fetchFilms(pageNumber, inputVaue);
};

function fetchFilms(pageNumber, inputVaue) {
        let query = '';
    if (inputVaue.length > 0 && inputVaue.trim() !== '') {
        query = inputVaue.trim();
    } else {
        return
    };

    fetch(
        `${movieApi.baseUrl}search/movie?api_key=${movieApi.apiKey}&language=en-US&query=${query}&page=${pageNumber}`,
  )
    .then(res => res.json())
    .then(({ results }) => {
        if (results.length === 0) {
            notFound();
      }
      return results;
    })
    .then(movies => {
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


    clearGallery();
    createCardFunc();
};
// ====================================================================
function plaginationNavigation(e) {
    if (e.currentTarget.id === 'previous__page') {
        pageNumber -= 1;
    };
    if (e.currentTarget.id === 'next__page') {
        pageNumber += 1;
    };
    currentPage.textContent = pageNumber;
    console.log(pageNumber);
    console.log(currentPage.textContent);
}

//функции добавления и сокрытия кнопок пагинации
function showPlagination() {
    plaginationBar.classList.remove('hidden');
};
function hidePlagination() {
    plaginationBar.classList.add('hidden');
};
function notFound() {
  errorArea.insertAdjacentHTML('afterbegin', '<span>Not Found. Please enter a more correctly query!</span>'); 
};
function clearError() {
    errorArea.innerHTML = '';
}
function clearGallery() {
    homePageRef.innerHTML = '';
}