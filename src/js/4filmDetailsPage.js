function toggleToQueue() {
  let filmsQueueArr = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData) {
    filmsQueueArr = [...JSON.parse(localStorageData)];
  }
  if (selectFilm instanceof Promise) {
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
  } else {
    let entryIndex = filmsQueueArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      filmsQueueArr.splice(entryIndex, 1);
    } else {
      filmsQueueArr.push(selectFilm);
    }
    localStorage.setItem('filmsQueue', JSON.stringify(filmsQueueArr));
    monitorButtonStatusText();
  }
}

function toggleToWatched() {
  let filmsWatchedArr = [];
  let localStorageData = localStorage.getItem('filmsWatched');
  if (localStorageData) {
    filmsWatchedArr = [...JSON.parse(localStorageData)];
  }
  if (selectFilm instanceof Promise) {
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
  } else {
    let entryIndex = filmsWatchedArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      filmsWatchedArr.splice(entryIndex, 1);
    } else {
      filmsWatchedArr.push(selectFilm);
    }
    localStorage.setItem('filmsWatched', JSON.stringify(filmsWatchedArr));
    monitorButtonStatusText();
  }
}

function toggleToFavorite() {
  let filmsFavoriteArr = [];
  let localStorageData = localStorage.getItem('filmsFavorite');
  if (localStorageData) {
    filmsFavoriteArr = [...JSON.parse(localStorageData)];
  }
  if (selectFilm instanceof Promise) {
    selectFilm.then(obj => {
      let entryIndex = filmsFavoriteArr.findIndex(el => el.id === obj.id);
      if (entryIndex !== -1) {
        filmsFavoriteArr.splice(entryIndex, 1);
      } else {
        filmsFavoriteArr.push(obj);
      }
      localStorage.setItem('filmsFavorite', JSON.stringify(filmsFavoriteArr));
      monitorButtonStatusText();
    });
  } else {
    let entryIndex = filmsFavoriteArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      filmsFavoriteArr.splice(entryIndex, 1);
    } else {
      filmsFavoriteArr.push(selectFilm);
    }
    localStorage.setItem('filmsFavorite', JSON.stringify(filmsFavoriteArr));
    monitorButtonStatusText();
  }
}

function monitorButtonStatusText() {
  let filmsQueueArr = [];
  let localStorageData = localStorage.getItem('filmsQueue');
  if (localStorageData) {
    filmsQueueArr = [...JSON.parse(localStorageData)];
  }

  if (selectFilm instanceof Promise) {
    selectFilm.then(obj => {
      let entryIndex = filmsQueueArr.findIndex(el => el.id === obj.id);
      if (entryIndex !== -1) {
        queuePreTextIconRef.textContent = 'delete';
        queueSpanTextRef.textContent = 'from queue';
      } else {
        queueSpanTextRef.textContent = 'to queue';
        queuePreTextIconRef.textContent = 'add';
      }
    });
  } else {
    let entryIndex = filmsQueueArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      queuePreTextIconRef.textContent = 'delete';
      queueSpanTextRef.textContent = 'from queue';
    } else {
      queueSpanTextRef.textContent = 'to queue';
      queuePreTextIconRef.textContent = 'add';
    }
  }

  let filmsWatchedArr = [];
  let localStorageDataW = localStorage.getItem('filmsWatched');
  if (localStorageDataW) {
    filmsWatchedArr = [...JSON.parse(localStorageDataW)];
  }
  if (selectFilm instanceof Promise) {
    selectFilm.then(obj => {
      let entryIndex = filmsWatchedArr.findIndex(el => el.id === obj.id);
      if (entryIndex !== -1) {
        watchedPreTextIconRef.textContent = 'delete';
        watchedSpanTextRef.textContent = 'from watched';
      } else {
        watchedSpanTextRef.textContent = 'to watched';
        watchedPreTextIconRef.textContent = 'add';
      }
    });
  } else {
    let entryIndex = filmsWatchedArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      watchedPreTextIconRef.textContent = 'delete';
      watchedSpanTextRef.textContent = 'from watched';
    } else {
      watchedSpanTextRef.textContent = 'to watched';
      watchedPreTextIconRef.textContent = 'add';
    }
  }

  let filmsFavoriteArr = [];
  let localStorageDataF = localStorage.getItem('filmsFavorite');
  if (localStorageDataF) {
    filmsFavoriteArr = [...JSON.parse(localStorageDataF)];
  }
  if (selectFilm instanceof Promise) {
    selectFilm.then(obj => {
      let entryIndex = filmsFavoriteArr.findIndex(el => el.id === obj.id);
      if (entryIndex !== -1) {
        favoritePreTextIconRef.textContent = 'delete';
        favoriteSpanTextRef.textContent = 'from favorite';
      } else {
        favoriteSpanTextRef.textContent = 'to favorite';
        favoritePreTextIconRef.textContent = 'add';
      }
    });
  } else {
    let entryIndex = filmsFavoriteArr.findIndex(el => el.id === selectFilm.id);
    if (entryIndex !== -1) {
      favoritePreTextIconRef.textContent = 'delete';
      favoriteSpanTextRef.textContent = 'from favorite';
    } else {
      favoriteSpanTextRef.textContent = 'to favorite';
      favoritePreTextIconRef.textContent = 'add';
    }
  }
}

function showDetails(selectFilm) {
  const img = detailsSectionRef.querySelector('#details__img');
  const title = document.querySelector('#details__title');
  const vote = document.querySelector('#details__vote');
  const popularity = document.querySelector('#details__popularity');
  const originalTitle = document.querySelector('#original__title');
  const detailsAbout = document.querySelector('#details__about');
  const selectGenres = document.querySelector('#details__genre');

  if (selectFilm instanceof Promise) {
    selectFilm.then(el => {
      const imgPath = el.poster_path
        ? movieApi.images.baseImageUrl + movieApi.imagePosterSize + el.poster_path
        : movieApi.images.defaultPosterImg;

      img.setAttribute('src', imgPath);

      title.textContent = el.title;
      vote.textContent = `${el.vote_average} / ${el.vote_count}`;
      popularity.textContent = el.popularity;
      originalTitle.textContent = el.original_title;
      detailsAbout.textContent = el.overview;

      let genresIdArr = el.genre_ids;

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
  } else {
    const imgPath = selectFilm.poster_path
      ? movieApi.images.baseImageUrl + movieApi.imagePosterSize + selectFilm.poster_path
      : movieApi.images.defaultPosterImg;

    img.setAttribute('src', imgPath);
    title.textContent = selectFilm.title;
    vote.textContent = `${selectFilm.vote_average} / ${selectFilm.vote_count}`;
    popularity.textContent = selectFilm.popularity;
    originalTitle.textContent = selectFilm.original_title;
    detailsAbout.textContent = selectFilm.overview;

    let genresIdArr = selectFilm.genre_ids;

    genres.then(genresArr => {
      let thisMovieGenres = genresArr.reduce((acc, genre) => {
        if (genresIdArr.includes(genre.id)) {
          acc.push(genre.name);
        }
        return acc;
      }, []);
      selectGenres.textContent = thisMovieGenres.join(', ');
    });
  }
  monitorButtonStatusText();
}

const bodyRef = document.querySelector('body');
function switchTheme(e) {
  if (e.target.textContent === 'brightness_6') {
    bodyRef.classList.add('dark-theme');
    localStorage.setItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
  } else if (e.target.textContent === 'brightness_5') {
    bodyRef.classList.remove('dark-theme');
    localStorage.removeItem('Theme', 'DARK');
    togleSwitchBtn.firstElementChild.textContent = 'brightness_6';
  }
}

if (localStorage.getItem('Theme') === 'DARK') {
  bodyRef.classList.add('dark-theme');
  togleSwitchBtn.firstElementChild.textContent = 'brightness_5';
}
