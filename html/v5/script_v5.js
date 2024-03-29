const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

const errorMessage = document.getElementById('error-message');

const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    let cookie = cookies.find((c) => c.split('=')[0] == name);
    if (cookie) return decodeURI(cookie.split("=")[1]);
    return undefined;
}

const setCookie = (name, value, expire) => {
    const date = new Date();
    date.setDate(date + expire);
    document.cookie = `${name}=${encodeURI(value)}; expires=${date.toUTCString()};`
}

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = getCookie("page") || 1;

const createTDWithImage = (url, name) => {
    let td_img = document.createElement('td');
    let img = document.createElement('img');
    img.src = url;
    img.alt = name;
    td_img.appendChild(img);
    return td_img;
}

const bigImage = document.getElementById('big-img');

var pokemonToShow = [];

const nameFilter = document.getElementById('name-filter');
const genFilter = document.getElementById('gen-filter');
const typeFilter = document.getElementById('type-filter');

var currentButtonSort = null;

const sortingButtons = document.querySelectorAll('table.sortable th');

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

        let td_img = createTDWithImage("../webp/images/" + Pokemon.formatPokemonId(p.id) + ".webp", p.name + " image");
        let img = td_img.querySelector('img');
        img.addEventListener('mouseenter', () => {
            console.log('enter')
            bigImage.src = img.src;
            bigImage.alt = img.alt;
            bigImage.style.display = "flex";
        });

        img.addEventListener('mouseout', () => {
            console.log('leaving');
            bigImage.style.display = "none";
        });

        tr.appendChild(td_img);

        // Ajout de l'affichage des détails au click.
        tr.addEventListener('click', () => showMoreInfo(p.id));

        // Ajout la ligne à la liste.
        pokemonList.appendChild(tr);
    });
}

const getBestAttacksForEnemy = (name) => {
    // On récupére le pokemon associé au nom ansi que ses types.
    let pokemon = Object.values(Pokemon.all_pokemons).find((p) => p.name == name);
    let types = pokemon.getTypes();

    // Pour chacun des types existant, on calcul son efficacité.
    // On associe pour chacun des types, le type et l'efficacité.
    let types_efficiency = Object.values(Type.all_types)
        .map((type) => {
            let efficiency = types
                            .map((t) => type.getEffectivenessByType(t.name))
                            .reduce((acc, curr) => acc * curr);
            return [type, efficiency];
        });

    // On réduit notre tableau de [type, efficacité] créé précédemment
    return types_efficiency.reduce((acc, [type, efficiency]) => {
        // Si cette effifacité est supérieur à l'ancienne dans ce cas l'objet de stockage est recréé.
        if (efficiency > acc.efficiency) {
            return {types: [type], efficiency: efficiency};
        // sinon si c'est égale, on ajoute ce pokémon à l'objet de stockage.
        } else if (efficiency === acc.efficiency) {
            acc.types.push(type);
        }
        // On return l'objet de stockage    
        return acc;
    // par défaut cette objet est initialisé avec un tableau vide 
    // et une efficiency à -1 car aucun pokémon ne peux avoir une efficacité négative.
    }, {types: [], efficiency: -1}).types;
}

const modal = document.getElementById('modal-wrapper');
const closeButton = document.getElementById('cross');

const pokemonName = modal.querySelector('h3');
const pokemonId = modal.querySelector('#pok-id');
const pokemonImg = modal.querySelector('.img_more_pok');
const generationField = modal.querySelector('#pok-gen');
const pokemonTypes = modal.querySelector('#pok-types');
const pokemonStats = modal.querySelector('#pok-stats');
const pokemonWeakness = modal.querySelector('#pok-weakness');
const pokemonChargedMoves = modal.querySelector('#charged_move>tbody');
const pokemonFastMoves = modal.querySelector('#fast_move>tbody')

const showMoreInfo = (id) => {
    getCookie();
    let pokemon = Pokemon.all_pokemons[id];

    modal.style.display = "flex";
    
    pokemonName.innerText = pokemon.name;
    pokemonId.innerText = Pokemon.formatPokemonId(pokemon.id);
    pokemonImg.src = "../webp/images/"+Pokemon.formatPokemonId(pokemon.id)+".webp";
    pokemon.alt = pokemon.name + " image";
    generationField.innerText = pokemon.gen;

    pokemonTypes.innerHTML = "";
    pokemon.types.forEach((t) => {
        let img = document.createElement('img');
        img.classList.add('type');
        img.src = "../" + Type.getImgUrl(t);
        img.alt = t + " type icon";
        pokemonTypes.appendChild(img);
    });

    pokemonStats.innerHTML = "";
    [pokemon.attack, pokemon.defense, pokemon.stamina].forEach((stat) => {
        let td = document.createElement('td');
        td.textContent = stat;
        pokemonStats.appendChild(td);
    });

    pokemonWeakness.innerHTML = "";
    getBestAttacksForEnemy(pokemon.name).forEach((t) => {
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.src = '../' + Type.getImgUrl(t.name);
        img.alt = t + " type icon";
        li.appendChild(img);
        pokemonWeakness.appendChild(li);
    });

    let attacks = pokemon.getAttacks();

    pokemonChargedMoves.innerHTML = "";
    attacks.filter((a) => a.is_charged).forEach((a) => {
        let tr = document.createElement('tr');
        [a.name, a.duration, a.energy_delta, a.power, a.critical_chance].forEach((info) => {
            let td = document.createElement('td');
            td.textContent = info;
            tr.appendChild(td);
        });
        pokemonChargedMoves.appendChild(tr);
        tr.appendChild(createTDWithImage("../" + Type.getImgUrl(a.type), a.type + " type image"));
    });

    pokemonFastMoves.innerHTML = "";
    attacks.filter((a) => !a.is_charged).forEach((a) => {
        let tr = document.createElement('tr');
        [a.name, a.duration, a.energy_delta, a.power].forEach((info) => {
            let td = document.createElement('td');
            td.textContent = info;
            tr.appendChild(td);
        });
        tr.appendChild(createTDWithImage("../" + Type.getImgUrl(a.type), a.type + " type image"));
        pokemonFastMoves.appendChild(tr);
    });
}

closeButton.addEventListener('click', () => {
    modal.style.display = "none";
});

const nextButtons = document.querySelectorAll('.next-page');
const prevButtons = document.querySelectorAll('.prev-page');

const updateNextButtons = () => {
    nextButtons.forEach((button) => {
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
            setCookie('page', currentPage, 7);
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
            setCookie('page', currentPage, 7);
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
    names: "",
    sortBy: getCookie("order") || "id",
    sortByReversed: getCookie("reversed") == "true" || false
}

const getPokemonsFiltered = () => {
    return Object.values(Pokemon.all_pokemons)
        .filter((p) => {
            return (queryFilters.gen ? p.gen == queryFilters.gen : true)
                && (queryFilters.types ? p.types.includes(queryFilters.types) : true)
                && (queryFilters.names ? p.name.toLowerCase().includes(queryFilters.names.toLowerCase()) : true)
        });
}

const updatePokemonsToShow = (reset = true) => {
    pokemonToShow = getPokemonsFiltered();
    sortPokemon(queryFilters.sortBy, queryFilters.sortByReversed);
    if (reset) currentPage = 1;
    showPokemons();
}

nameFilter.addEventListener('input', () => {
    queryFilters.names = nameFilter.value;
    updatePokemonsToShow();
});

genFilter.addEventListener('change', (e) => {
    queryFilters.gen = e.target.value;
    updatePokemonsToShow();
});

typeFilter.addEventListener('change', (e) => {
    queryFilters.types = e.target.value;
    updatePokemonsToShow();
});

const handleClickSortPokemon = (element) => {
    if (currentButtonSort == null){
        element.classList.add('sorting');
        queryFilters.sortBy = element.dataset.order;
        currentButtonSort = element;
    } else if (element == currentButtonSort){
        element.classList.toggle('asc');
        queryFilters.sortByReversed = !queryFilters.sortByReversed;
    } else {
        currentButtonSort.classList.remove('sorting', 'asc');
        element.classList.add('sorting');
        queryFilters.sortBy = element.dataset.order;
        queryFilters.sortByReversed = false;
        currentButtonSort = element;
    }

    updatePokemonsToShow(false);
}

const sortPokemon = (by, reverse = false) => {
    let coef = reverse ? -1 : 1;
        pokemonToShow.sort((a, b) => {
            if (a[by] > b[by]){
                return 1 * coef;
            } else if (a[by] == b[by]){
                return a.name.localeCompare(b.name);
            } else {
                return -1 * coef;
            }
        });
    setCookie('order', by, 7);
    setCookie('reversed', reverse, 7);
}

document.addEventListener('DOMContentLoaded', () => {
    Pokemon.import_pokemon();
    
    updatePokemonsToShow(false);

    const thOrders = Array.from(document.querySelectorAll('#pok-list th'));

    // Initialisation des valeurs (a cause des cookies)
    currentButtonSort = thOrders.find((e) => e.dataset.order == queryFilters.sortBy);
    currentButtonSort.classList.add('sorting');
    if (queryFilters.sortByReversed) currentButtonSort.classList.add('asc');
    
    showPokemons();

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
    });
    
    sortingButtons.forEach((b) => {
        if (b.dataset.order != null){
            b.addEventListener('click', (e) => {
                handleClickSortPokemon(e.target);
            });
        }
    });
});




