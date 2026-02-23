const NO_FILM_MSG = 'Введите название фильма';
const NO_FILMS_MSG = 'Enter a movie in the input above!';


const inputNode = document.querySelector('.js-movie-input');

const addButtonMovie = document.querySelector('.arrow-btn');
const movieList = document.querySelector('.movie-list');


let films = [];

// init
document.addEventListener('DOMContentLoaded',() => {
        films = loadFilmsFromStorage();
        render()
});

addButtonMovie.addEventListener('click', addButtonHandler);


function addButtonHandler(){
    const title = inputNode.value;
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
    render()
    clearInput()
};

// обработка кликов 
movieList.addEventListener('click',(e) => {
    const filmId = e.target.closest('.film-item')?.dataset.id;
    if(!filmId) return;

    //удаление
    if(e.target.classList.contains('delete-btn')){
        films = films.filter(f => f.id !== Number(filmId))
        saveFilmsToStorage();
        render(); 
    }

    // отметка просмотренного
    if(e.target.type === 'radio') {
        const film = films.find(f => f.id === Number(filmId))
        if(film){
            film.isWatched = e.target.checked
            saveFilmsToStorage();
            render()
        }
    }

    
})

// рендер фильмов
function render() {
    movieList.innerHTML = '';
    if(films.length === 0) {
        movieList.innerText = NO_FILMS_MSG;
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
        movieList.appendChild(filmItem);
    })


}

//save to LocalStorage
function saveFilmsToStorage () {
    localStorage.setItem('films',JSON.stringify(films));
}

// загрузка из лс
function loadFilmsFromStorage () {
     return JSON.parse(localStorage.getItem('films')) || [];
}
// клиар инпут
function clearInput() {
    inputNode.value = '';
}

inputNode.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addButtonHandler();
    }
});