const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = 1;

var pokemonToShow = [];

const nameFilter = document.getElementById('name-filter');
const genFilter = document.getElementById('gen-filter');
const typeFilter = document.getElementById('type-filter');


document.addEventListener('DOMContentLoaded', () => {
    Pokemon.import_pokemon();
    pokemonToShow = Object.values(Pokemon.all_pokemons);
    showPokemons();

    Object.keys(Type.all_types).forEach((t) => {
        let option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        typeFilter.appendChild(option);
    });


});

const showPokemons = () => {
    pokemonList.innerHTML = '';
    pageTotal = Math.ceil(pokemonToShow.length / pokemonsPerPage);

    pageInfos.forEach((info) => info.textContent = currentPage + "/" + pageTotal)
    
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const currentPokemons = pokemonToShow.slice(startIndex, endIndex);

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
        tr.addEventListener('click', () => showMoreInfo(Pokemon.formatPokemonId(p.id)));
        pokemonList.appendChild(tr);
    });
}

const showMoreInfo = (id) => {
    // TODO
}

const nextButtons = document.querySelectorAll('.next-page');
const prevButtons = document.querySelectorAll('.prev-page');

nextButtons.forEach((button) => {
    button.disabled = currentPage === pageTotal;

    button.addEventListener('click', () => {
        if (currentPage < pageTotal) {
            currentPage++;
            showPokemons();
        }
        if (currentPage === pageTotal){
            nextButtons.forEach((b) => b.disabled = true);
        }
    
        if (prevButtons[0].disabled){
            prevButtons.forEach((b) => b.disabled = false);
        }
    });
});

prevButtons.forEach((button) => {
    button.disabled = currentPage == 1;

    button.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPokemons();
        }

        if (currentPage === 1){
            prevButtons.forEach((b) => b.disabled = true);
        }
    
        if (nextButtons[0].disabled){
            nextButtons.forEach((b) => b.disabled = false);
        }
    });
    
});

var queryFilters = {
    gen: null,
    types: null,
    names: ""
}
const getPokemonsFiltered = () => {

    console.log(queryFilters.gen, queryFilters.types, queryFilters.names)
    return Object.values(Pokemon.all_pokemons)
        .filter((p) => {
            console.log(queryFilters.gen ? p.gen == queryFilters.gen : true,
                 queryFilters.types ? p.types.includes(queryFilters.types) : true,
            queryFilters.names ? p.name.includes(queryFilters.names) : true,
            p.name)

            return queryFilters.gen ? p.gen == queryFilters.gen : true
                && queryFilters.types ? p.types.includes(queryFilters.types) : true
                && queryFilters.names ? p.name.includes(queryFilters.names) : true
        });
}

const updatePokemonsFiltered = () => {
    pokemonToShow = getPokemonsFiltered();
    currentPage = 1;
    showPokemons();
}

nameFilter.addEventListener('input', () => {
    queryFilters.names = nameFilter.value;
    updatePokemonsFiltered();
});

genFilter.addEventListener('change', (e) => {
    queryFilters.gen = e.target.value;
    updatePokemonsFiltered();
});

typeFilter.addEventListener('change', (e) => {
    queryFilters.types = e.target.value;
    updatePokemonsFiltered();
});

