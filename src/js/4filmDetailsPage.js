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
  const img = detailisSectionRef.querySelector('#details__img');
  const title = document.querySelector('#details__title');
  const vote = document.querySelector('#details__vote');
  const popularity = document.querySelector('#details__popularity');
  const originalTitle = document.querySelector('#original__title');
  const detailsAbout = document.querySelector('#details__about');

  selectFilm.then(el => {
    img.setAttribute(
      'src',
      `${movieApi.images.baseImageUrl}${movieApi.images.posterSizes.mobile}${el.poster_path}`,
    );
    title.textContent = el.title;
    vote.textContent = el.vote_average;
    popularity.textContent = el.popularity;
    originalTitle.textContent = el.original_title;
    detailsAbout.textContent = el.overview;
    let genre;
  });

  monitorButtonStatusText();
}

function monitorButtonStatusText() {}
