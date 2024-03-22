const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    Pokemon.import_pokemon();
    showPokemons(Object.values(Pokemon.all_pokemons));
});

const showPokemons = (pokemons) => {
    pokemonList.innerHTML = '';
    pageTotal = Math.ceil(pokemons.length / pokemonsPerPage);

    pageInfos.forEach((info) => info.textContent = currentPage + "/" + pageTotal)
    
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const currentPokemons = pokemons.slice(startIndex, endIndex);

    currentPokemons.forEach((p) => {
        let tr = document.createElement('tr');
        let info = [
            p.id,
            p.name,
            // enleve le "génération" du text quand la size est < 600 (UNIQUEMENT LORS DU RAFRAICHISSEMENT)
            window.screen.width > 600 ? p.gen : p.gen.replace('Generation', ""),
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

const nextButtons = document.querySelectorAll('.next-page');
const prevButtons = document.querySelectorAll('.prev-page');

nextButtons.forEach((button) => {
    button.disabled = currentPage === pageTotal;

    button.addEventListener('click', () => {
        if (currentPage < pageTotal) {
            currentPage++;
            showPokemons(Object.values(Pokemon.all_pokemons));
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
            showPokemons(Object.values(Pokemon.all_pokemons));
        }

        if (currentPage === 1){
            prevButtons.forEach((b) => b.disabled = true);
        }
    
        if (nextButtons[0].disabled){
            nextButtons.forEach((b) => b.disabled = false);
        }
    });
});