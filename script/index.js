const filmInput = document.querySelector('.film-input');
const addFilmBtn = document.querySelector('.arrow-btn');
const filmList = document.querySelector('.films-list');
const NO_FILM_MSG = 'Введите название фильма';
const NO_FILMS_MSG = 'Enter a movie in the input above!';

let films = [];

// init
document.addEventListener('DOMContentLoaded',() => {
        films = loadFilmsFromStorage();
        renderFilms()
});

// добавление фильма
addFilmBtn.addEventListener('click',() => {
    const title = filmInput.value;
    if(!title) {
        return
    }

    const newFilm = {
        id: Date.now(),
        title,
        isWatched: false,
    }
    films.push(newFilm)
    saveFilmsToStorage()
    renderFilms()
    clearInput()
});

// обработка кликов 
filmList.addEventListener('click',(e) => {
    const filmId = e.target.closest('.film-item')?.dataset.id;
    if(!filmId) return;

    //удаление
    if(e.target.classList.contains('delete-btn')){
        films = films.filter(f => f.id !== Number(filmId))
        saveFilmsToStorage();
        renderFilms(); 
    }

    // отметка просмотренного
    if(e.target.type === 'radio') {
        const film = films.find(f => f.id === Number(filmId))
        if(film){
            film.isWatched = e.target.checked
            saveFilmsToStorage();
            renderFilms()
        }
    }

    
})

// рендер фильмов
function renderFilms() {
    filmList.innerHTML = '';
    if(films.length === 0) {
        filmList.innerText = NO_FILMS_MSG;
        return
    }

    films.forEach(f => {
        const filmItem = document.createElement('div');
        filmItem.classList ='film-item';
        filmItem.dataset.id = f.id;
        if(f.isWatched) filmItem.classList.add('watched');

        filmItem.innerHTML = `
             <input type='radio'${f.isWatched ? 'checked' : ''}/>
             <span class=${f.isWatched ? 'crossed' : ''}>${f.title}</span>
             <button class="delete-btn">✖</button>      
        `
        filmList.appendChild(filmItem);
    })


}
// сохранение в лс
function saveFilmsToStorage () {
    localStorage.setItem('films',JSON.stringify(films));
}

// загрузка из лс
function loadFilmsFromStorage () {
     return JSON.parse(localStorage.getItem('films')) || [];
}
// клиар инпут
function clearInput() {
    filmInput.value = '';
}