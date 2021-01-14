function toggleToQueue() {
  let filmsQueueArr = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData) {
    filmsQueueArr.push(JSON.parse(localStorageData));
  }
  if (filmsQueueArr.includes(selectFilm)) {
    filmsQueueArr.indexOf(selectFilm);
    filmsQueueArr.splice(filmsQueueArr.indexOf(selectFilm));
  } else {
    filmsQueueArr.push(selectFilm);
  }
  localStorage.setItem('filmsQueue', JSON.stringify(filmsQueueArr));
  monitorButtonStatusText();
}

function toggleToWatched() {
  let filmsWatchedArr = [];
  let localStorageData = localStorage.getItem('filmsWatched');
  if (localStorageData) {
    filmsWatchedArr.push(JSON.parse(localStorageData));
  }
  if (filmsWatchedArr.find(el => el.id === selectFilm.id)) {
    filmsWatchedArr = filmsWatchedArr.filter(el => el.id !== selectFilm.id);
  } else {
    filmsWatchedArr.push(selectFilm);
  }
  localStorage.setItem('filmsWatched', JSON.stringify(filmsWatchedArr));
  monitorButtonStatusText();
}

function showDetails(selectFilm) {
  const img = document.querySelector('#js-detailsImg');
  img.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/w500${selectFilm.poster_path}`,
  );
  const title = document.querySelector('#js-detailsTitle');
  title.textContent = selectFilm.title;
  const vote = document.querySelector('#js-vote');
  vote.textContent = selectFilm.vote_average;
  const popolarity = document.querySelector('#js-popularity');
  popolarity.textContent = selectFilm.popularity;
  const originalTitle = document.querySelector('js-originalTitle');
  originalTitle.textContent = selectFilm.original_title;
  let genre;
  const detailsAbout = document.querySelector('#js-detailsAbout');
  detailsAbout.textContent = selectFilm.overview;
  monitorButtonStatusText();
}

function monitorButtonStatusText() {}
