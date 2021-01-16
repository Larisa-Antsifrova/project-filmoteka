function toggleToQueue() {
  let filmsQueueArr = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData) {
    filmsQueueArr = [...JSON.parse(localStorageData)];
  }

  selectFilm.then(obj => {
    let entryIndex = filmsQueueArr.findIndex(el => el.id === obj.id);
    if (entryIndex !== -1) {
      filmsQueueArr.splice(entryIndex, 1);
    } else {
      filmsQueueArr.push(obj);
    }
    localStorage.setItem('filmsQueue', JSON.stringify(filmsQueueArr));
    monitorButtonStatusText();
  });
}

function toggleToWatched() {
  let filmsWatchedArr = [];
  let localStorageData = localStorage.getItem('filmsWatched');
  if (localStorageData) {
    filmsWatchedArr = [...JSON.parse(localStorageData)];
  }
  selectFilm.then(obj => {
    let entryIndex = filmsWatchedArr.findIndex(el => el.id === obj.id);
    if (entryIndex !== -1) {
      filmsWatchedArr.splice(entryIndex, 1);
    } else {
      filmsWatchedArr.push(obj);
    }
    localStorage.setItem('filmsWatched', JSON.stringify(filmsWatchedArr));
    monitorButtonStatusText();
  });
}

function monitorButtonStatusText() {
  let filmsQueueArr = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData) {
    filmsQueueArr = [...JSON.parse(localStorageData)];
  }
  selectFilm.then(obj => {
    let entryIndex = filmsQueueArr.findIndex(el => el.id === obj.id);
    if (entryIndex !== -1) {
      toggleQueueBtn.textContent = 'Delete from queue';
    } else {
      toggleQueueBtn.textContent = 'Add to queue';
    }
  });

  let filmsWatchedArr = [];
  let localStorageDataW = localStorage.getItem('filmsWatched');
  if (localStorageDataW) {
    filmsWatchedArr = [...JSON.parse(localStorageDataW)];
  }
  selectFilm.then(obj => {
    let entryIndex = filmsWatchedArr.findIndex(el => el.id === obj.id);
    if (entryIndex !== -1) {
      toggleWatchedBtn.textContent = 'Delete from watched';
    } else {
      toggleWatchedBtn.textContent = 'Add to queue';
    }
  });
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
    });
  });
  monitorButtonStatusText();
}
