// function toggleToQueue() {
//   let filmsQueueArr = [];
//   let localStorageData = localStorage.getItem('filmsQueue');
//   if (localStorageData === []) {
//     // filmsQueueArr.push(JSON.parse(localStorageData));
//     filmsQueueArr.push('nice');
//   }
//   if (filmsQueueArr.find(el => el.id === selectFilm.id)) {
//     filmsQueueArr = filmsQueueArr.filter(el => el.id !== selectFilm.id);
//   } else {
//     // filmsQueueArr.push('nice');
//     // filmsQueueArr.push(JSON.parse(localStorageData));
//   }
//   localStorage.setItem('filmsQueue', JSON.stringify(filmsQueueArr));
//   monitorButtonStatusText();
//   console.log(localStorageData);
// }

let filmsQueueArr = JSON.parse(localStorage.getItem('filmsQueue'));
let filmsWatchedArr = JSON.parse(localStorage.getItem('filmsWatched'));
if (!filmsQueueArr) {
  filmsQueueArr = [];
}
if (!filmsWatchedArr) {
  filmsWatchedArr = [];
}

function toggleToQueue() {
  let findFilm = filmsQueueArr.find(el => el.id === selectFilm.id);
  if (findFilm) {
    let index = filmsQueueArr.indexOf(findFilm);
    filmsQueueArr.splice(index, 1);
  } else {
    filmsQueueArr.push(selectFilm);
  }
  localStorage.setItem('filmsQueue', JSON.stringify(filmsQueueArr));
  monitorButtonStatusText();
}

function toggleToWatched() {
  let findFilm = filmsWatchedArr.find(el => el.id === selectFilm.id);
  if (findFilm) {
    let index = filmsWatchedArr.indexOf(findFilm);
    filmsWatchedArr.splice(index, 1);
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
  const selectGenres = document.querySelector('#details__genre');
  selectFilm.then(el => {
    img.setAttribute(
      'src',
      `${movieApi.images.baseImageUrl}${movieApi.images.currentSizes.posterSize}${el.poster_path}`,
    );
    title.textContent = el.title;
    vote.textContent = `${el.vote_average} / ${el.vote_count}`;
    popularity.textContent = el.popularity;
    originalTitle.textContent = el.original_title;
    detailsAbout.textContent = el.overview;

    let genresIdArr = el.genre_ids;
    // console.log(genresIdArr);
    genres.then(genresArr => {
      let thisMovieGenres = genresArr.reduce((acc, genre) => {
        if (genresIdArr.includes(genre.id)) {
          acc.push(genre.name);
        }
        return acc;
      }, []);
      selectGenres.textContent = thisMovieGenres.join(', ');
      console.log(thisMovieGenres.join(', '));
    });
  });
  monitorButtonStatusText();
}
// genres.then(console.log);
function monitorButtonStatusText() {
  let localStorageFilmsQueue = localStorage.getItem('filmsQueue');
  localStorageFilmsQueue === null
    ? (toggleQueueBtn.textContent = 'Add to queue')
    : JSON.parse(localStorageFilmsQueue).find(el => el.id === selectFilm.id)
    ? (toggleQueueBtn.innerHTML =
        '<i class="material-icons left">delete</i><span>queue</span>')
    : (toggleQueueBtn.innerHTML =
        '<i class="material-icons left">add</i><span>queue</span>');

  let localStorageFilmsWatch = localStorage.getItem('filmsWatched');
  localStorageFilmsWatch === null
    ? (toggleWatchedBtn.textContent = 'Add to watched')
    : JSON.parse(localStorageFilmsWatch).find(el => el.id === selectFilm.id)
    ? (toggleWatchedBtn.innerHTML =
        '<i class="material-icons left">delete</i><span>watched</span>')
    : (toggleWatchedBtn.innerHTML =
        '<i class="material-icons left">add</i><span>watched</span>');
}
