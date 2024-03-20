const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

const errorMessage = document.getElementById('error-message');

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
    console.log(pokemonToShow);
    console.log(Attack.all_attacks)

    Object.keys(Type.all_types).forEach((t) => {
        let option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        typeFilter.appendChild(option);
    });

    const generations = [...new Set(Object.values(Pokemon.all_pokemons).map(p => p.gen))];

    generations.forEach((gen) => {
        let option = document.createElement('option');
        option.value = gen;
        option.textContent = gen;
        genFilter.appendChild(option);
    })


});

const showPokemons = () => {
    pokemonList.innerHTML = '';
    errorMessage.style.display = "none";
    pageTotal = Math.ceil(pokemonToShow.length / pokemonsPerPage);

    pageInfos.forEach((info) => info.textContent = currentPage + "/" + pageTotal)
    
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const currentPokemons = pokemonToShow.slice(startIndex, endIndex);

    updateNextButtons();
    updatePrevButtons();

    if (currentPokemons.length === 0){
        errorMessage.textContent = 'Nothing results...';
        errorMessage.style.display = "flex";
        return;
    }

    currentPokemons.forEach((p) => {
        let tr = document.createElement('tr');

        let info = [
            p.id,
            p.name,
            // enleve le "génération" du text quand la size est < 600 (UNIQUEMENT LORS DU RAFRAICHISSEMENT)
            window.screen.width > 600 ? p.gen : p.gen.replace('Generation', ""),
            p.stamina,
            p.attack,
            p.defense
        ];

        // Transforme les infos en <td>
        info = info.map((text) => {
            let td = document.createElement('td');
            td.textContent = text;
            return td;
        });
        
        // Créé un <td> contenant les <img> correspondant au types
        let td_types = document.createElement('td');
        p.types.forEach((t) => {
            let img = document.createElement('img');
            img.src = "../" + Type.getImgUrl(t);
            img.alt = t + " type logo";
            td_types.append(img);
        });

        // Ajoute le <td> des imgs à la position 3.
        info.splice(3, 0, td_types);

        // Ajoute les <td> dans le <tr>
        tr.append(...info);

        // Créé un <td> contenant l'<img> correspondant au pokemon
        let td_img = document.createElement('td');
        let img = document.createElement('img');
        img.src = "../webp/images/" + Pokemon.formatPokemonId(p.id) + ".webp";
        img.alt = p.name + " image";
        td_img.appendChild(img);
        // Ajoute l'image au tableau
        tr.appendChild(td_img);
        // Ajout de l'affichage des détails au click.
        tr.addEventListener('click', () => showMoreInfo(Pokemon.formatPokemonId(p.id)));

        // Ajout la ligne à la liste.
        pokemonList.appendChild(tr);
    });
}

const showMoreInfo = (id) => {
    // TODO
    console.log(id);
}

const nextButtons = document.querySelectorAll('.next-page');
const prevButtons = document.querySelectorAll('.prev-page');

const updateNextButtons = () => {
    nextButtons.forEach((button) => {
        console.log(currentPage, pageTotal)
        button.disabled = currentPage >= pageTotal;
    });
}

const updatePrevButtons = () => {
    prevButtons.forEach((button) => {
        button.disabled = currentPage == 1;
    });
}

updateNextButtons();
nextButtons.forEach((button) => {
    updateNextButtons();
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

updatePrevButtons();
prevButtons.forEach((button) => {
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
    return Object.values(Pokemon.all_pokemons)
        .filter((p) => {
            return (queryFilters.gen ? p.gen == queryFilters.gen : true)
                && (queryFilters.types ? p.types.includes(queryFilters.types) : true)
                && (queryFilters.names ? p.name.includes(queryFilters.names) : true)
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


