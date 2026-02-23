const NO_FILMS_MSG = 'Enter a movie in the input above!';

const inputNode = document.querySelector('.js-movie-input');
const addButtonMovie = document.querySelector('.js-add-button');
const movieList = document.querySelector('.js-movie-list');

let movie = [];

init();
addButtonMovie.addEventListener('click', addButtonHandler);

inputNode.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addButtonHandler();
    }
});


function init(){
    movie = loadFilmsFromStorage();
    render();  
};

function addButtonHandler(){
    
    const title = inputNode.value;
    if(!title) {
        return
    }

    const newMovie = {
        id: Date.now(),
        title: title,
        isWatched: false,
    }

    movie.push(newMovie);
    saveToLocalStorage();
    
    clearInputNode();
    render();
};

function saveToLocalStorage () {
    localStorage.setItem('movie',JSON.stringify(movie));
}

function loadFilmsFromStorage () {
     return JSON.parse(localStorage.getItem('movie')) || [];
}

function clearInputNode() {
    inputNode.value = '';
}

movieList.addEventListener('click', (event) => {
    const filmId = event.target.closest('.movie-item')?.dataset.id;
    if(!filmId) return;

    if(event.target.classList.contains('delete-btn')){
        movie = movie.filter(film => film.id !== Number(filmId));
        saveToLocalStorage();
        render(); 
        return;
    }

    if(event.target.type === 'radio') {
        const film = movie.find(film => film.id === Number(filmId));
        if(film) {
            film.isWatched = !film.isWatched;
            saveToLocalStorage();
            updateSingleFilm(filmId);
        }
    }
});

function applyFilmStyles(filmItem, film) {
    if(film.isWatched) {
        filmItem.classList.add('watched');
        filmItem.classList.remove('unwatched');
        filmItem.querySelector('input').checked = true;
        filmItem.querySelector('span').classList.add('crossed');
    } else {
        filmItem.classList.add('unwatched');
        filmItem.classList.remove('watched');
        filmItem.querySelector('input').checked = false;
        filmItem.querySelector('span').classList.remove('crossed');
    }
}

function updateSingleFilm(filmId) {
    const filmItem = document.querySelector(`[data-id="${filmId}"]`);
    if(!filmItem) return;

    const film = movie.find(f => f.id === Number(filmId));
    if(!film) return;
    
    applyFilmStyles(filmItem, film);
}

function render() {
    movieList.innerHTML = '';
    
    if(movie.length === 0) {
        movieList.innerText = NO_FILMS_MSG;
        return;
    }

    movie.forEach(film => {
        const filmItem = document.createElement('div');
        filmItem.className = 'movie-item';
        filmItem.dataset.id = film.id;
        
        filmItem.innerHTML = `
            <input type='radio'/>
            <span>${film.title}</span>
            <button class="delete-btn">✖</button>      
        `;

        applyFilmStyles(filmItem, film);
        movieList.appendChild(filmItem);
    });
}
