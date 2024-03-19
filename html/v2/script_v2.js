const pokemonList = document.querySelector('table>tbody');
const pageInfo = document.querySelector('p.info-page');

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    Pokemon.import_pokemon();
    showPokemons(Object.values(Pokemon.all_pokemons));
});

const showPokemons = (pokemons, page) => {
    pokemonList.innerHTML = '';
    pageTotal = Math.ceil(pokemons.length / pokemonsPerPage);

    pageInfo.textContent = currentPage + "/" + pageTotal;
    
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const currentPokemons = pokemons.slice(startIndex, endIndex);

    currentPokemons.forEach((p) => {
        let tr = document.createElement('tr');
        let info = [
            p.id,
            p.name,
            p.gen,
            p.types,
            p.stamina,
            p.attack,
            p.defense
        ];

        info.forEach((text) => {
            let td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        });

        let td_img = document.createElement('td');
        let img = document.createElement('img');
        img.src = "../webp/images/" + Pokemon.formatPokemonId(p.id) + ".webp";
        img.alt = p.name + " image";
        td_img.appendChild(img);
        tr.appendChild(td_img);
        pokemonList.appendChild(tr);
    });
}

const nextButton = document.querySelector('.next-page');
const prevButton = document.querySelector('.prev-page');

nextButton.addEventListener('click', () => {
    if (currentPage < pageTotal) {
        currentPage++;
        showPokemons(Object.values(Pokemon.all_pokemons));
    }
    if (currentPage === pageTotal){
        nextButton.disabled = true;
    }

    if (prevButton.disabled){
        prevButton.disabled = false;
    }
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPokemons(Object.values(Pokemon.all_pokemons));
    }

    if (currentPage === 1){
        prevButton.disabled = true;
    }

    if (nextButton.disabled){
        nextButton.disabled = false;
    }
});