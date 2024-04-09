const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

const errorMessage = document.getElementById('error-message');

const getCookie = (name) => {
    const cookies = document.cookie.split('; ');
    let cookie = cookies.find((c) => c.split('=')[0] == name); // cherche si parmis la liste des cookies on a un cookie nommé 'name' sinon renvoie undefined
    if (cookie) return decodeURI(cookie.split("=")[1]); //si le cookie n'est pas undefined on retourne celui-ci.
    return undefined;
}

const setCookie = (name, value, expire) => {
    const date = new Date();
    date.setDate(date + expire);
    document.cookie = `${name}=${encodeURI(value)}; expires=${date.toUTCString()};` // ajoute un cookie au format : name=<value>; expries=<date actuelle + expire>
}

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = getCookie("page") || 1;

/* Fonction utilitaire, qui créé un élément <td> contenant une <img> qui à pour src : url et alt : name */
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

/* Affiche les pokémons dans le <table> pokemonList en fonction de la pagnination. */

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
        tr.addEventListener('click', (e) => {
            showMoreInfo(p.id);
            // Evite d'appeler l'événement sur via 'document' (qui ferme la modal)
            e.stopPropagation();
        });
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

const modalWrapper = document.getElementById('modal-details');
const modalDetails = modalWrapper.querySelector('.modal'); 

const closeButton = document.getElementById('cross');

const pokemonName = modalWrapper.querySelector('h3');
const pokemonId = modalWrapper.querySelector('#pok-id');
const pokemonImg = modalWrapper.querySelector('.img_more_pok');
const generationField = modalWrapper.querySelector('#pok-gen');
const pokemonTypes = modalWrapper.querySelector('#pok-types');
const pokemonStats = modalWrapper.querySelector('#pok-stats');
const pokemonWeakness = modalWrapper.querySelector('#pok-weakness');
const pokemonChargedMoves = modalWrapper.querySelector('#charged_move>tbody');
const pokemonFastMoves = modalWrapper.querySelector('#fast_move>tbody')

/* Fonction qui permet d'afficher la modale contenant les informations détaillés du pokémon avec l'identifiant: id */
const showMoreInfo = (id) => {
    getCookie();
    let pokemon = Pokemon.all_pokemons[id];

    modalWrapper.style.display = "flex";
    
    pokemonName.innerText = pokemon.name;
    pokemonId.innerText = Pokemon.formatPokemonId(pokemon.id);
    pokemonImg.src = "../webp/images/"+Pokemon.formatPokemonId(pokemon.id)+".webp";
    pokemon.alt = pokemon.name + " image";
    generationField.innerText = pokemon.gen;

    pokemonTypes.innerHTML = "";
    // Affiche tous les types du pokémon.
    pokemon.types.forEach((t) => {
        let img = document.createElement('img');
        img.classList.add('type');
        img.src = "../" + Type.getImgUrl(t);
        img.alt = t + " type icon";
        pokemonTypes.appendChild(img);
    });

    pokemonStats.innerHTML = "";
    // Affiche toutes les statistiques du pokémon (attaque, défense, stamina).
    [pokemon.attack, pokemon.defense, pokemon.stamina].forEach((stat) => {
        let td = document.createElement('td');
        td.textContent = stat;
        pokemonStats.appendChild(td);
    });

    // Affiche tous les types pour lesquelles le pokémon affiché est faible. 
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

    // Affiche dans un tableau la liste des attaques chargées possibles pour le pokémon affiché.
    pokemonChargedMoves.innerHTML = "";
    attacks.filter((a) => a.is_charged).forEach((a) => {
        let tr = document.createElement('tr');
        // Affiche chacune des statistques que l'on souhaites (nom, duration, energy, puissance, chance de coup critique.)
        [a.name, a.duration, a.energy_delta, a.power, a.critical_chance].forEach((info) => {
            let td = document.createElement('td');
            td.textContent = info;
            tr.appendChild(td);
        });
        // Et on ajoute ensuite le type de l'attaque.
        pokemonChargedMoves.appendChild(tr);
        tr.appendChild(createTDWithImage("../" + Type.getImgUrl(a.type), a.type + " type image"));
    });

    // Affiche dans un tableau la liste des attaques rapides possibles pour le pokémon affiché.
    pokemonFastMoves.innerHTML = "";
    attacks.filter((a) => !a.is_charged).forEach((a) => {
        let tr = document.createElement('tr');
        // Affiche chacune des statistques que l'on souhaites (nom, duration, energy, puissance)
        [a.name, a.duration, a.energy_delta, a.power].forEach((info) => {
            let td = document.createElement('td');
            td.textContent = info;
            tr.appendChild(td);
        });
        // Et on ajoute ensuite le type de l'attaque.
        tr.appendChild(createTDWithImage("../" + Type.getImgUrl(a.type), a.type + " type image"));
        pokemonFastMoves.appendChild(tr);
    });
}

closeButton.addEventListener('click', () => {
    modalWrapper.style.display = "none";
});

// Ferme lors du click en dehors de la modale.
document.addEventListener('click', (e) => {
    if (!modalDetails.contains(e.target)){
        modalWrapper.style.display = "none";
    } else {
        console.log("containing modal")
    }
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
            // On incrémente le numéro de page.
            currentPage++;
            // On retient la page a laquelle on est arrivé en cas de rafraichissement.
            setCookie('page', currentPage, 7);
            // On réaffiche les pokémons.
            showPokemons();
        }
        if (currentPage === pageTotal){
            // On met a jour le status du boutton.
            nextButtons.forEach((b) => b.disabled = true);
        }
    
        if (prevButtons[0].disabled){
            // On met a jour le status du boutton.
            prevButtons.forEach((b) => b.disabled = false);
        }
    });
});

updatePrevButtons();
prevButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (currentPage > 1) {
            // On décrémente le numéro de page.
            currentPage--;
            // On retient la page a laquelle on est arrivé en cas de rafraichissement.
            setCookie('page', currentPage, 7);
            // On réaffiche les pokémons.
            showPokemons();
        }

        if (currentPage === 1){
            // On met a jour le status du boutton.
            prevButtons.forEach((b) => b.disabled = true);
        }
    
        if (nextButtons[0].disabled){
            // On met a jour le status du boutton.
            nextButtons.forEach((b) => b.disabled = false);
        }
    });
    
});

/* Objet contenant les paramêtre de la recherche (génération, types, name, ordre) */
var queryFilters = {
    gen: null,
    types: null,
    names: "",
    sortBy: getCookie("order") || "id",
    sortByReversed: getCookie("reversed") == "true" || false
}

/* Renvoie la listes des pokémons filtrer par l'objet queryFilters */
const getPokemonsFiltered = () => {
    return Object.values(Pokemon.all_pokemons)
        .filter((p) => {
            // Si notre objet de recherche (queryFilters) contient une génération (queryFilters.gen) on vérifie que chaque pokémon est de cette génération.
            return (queryFilters.gen ? p.gen == queryFilters.gen : true) 
                // Si notre objet de recherche (queryFilters) contient un type (queryFilters.types) on vérifie que chaque pokémon est de ce type.
                && (queryFilters.types ? p.types.includes(queryFilters.types) : true)
                // Si notre objet de recherche (queryFilters) contient un type (queryFilters.names) on vérifie que chaque nom de pokémon contient ce nom.
                && (queryFilters.names ? p.name.toLowerCase().includes(queryFilters.names.toLowerCase()) : true)
        });
}

/* Met à jour les pokémons a afficher (pokemonToShow) en fonction des filtrers ainsi que de l'ordre. 
   Et actualise ceux déjà affiché. */
const updatePokemonsToShow = (reset = true) => {
    pokemonToShow = getPokemonsFiltered();
    sortPokemon(queryFilters.sortBy, queryFilters.sortByReversed);
    if (reset) currentPage = 1;
    showPokemons();
}

/* Défini le nom dans l'objet de filtre queryFilters(.name) lors de la modification de celui-ci dans l'input. */
nameFilter.addEventListener('input', () => {
    queryFilters.names = nameFilter.value;
    updatePokemonsToShow();
});

/* Défini la génération dans l'objet de filtre queryFilters(.gen) lors de la selection de celui-ci dans le <select>. */
genFilter.addEventListener('change', (e) => {
    queryFilters.gen = e.target.value;
    updatePokemonsToShow();
});

/* Défini le type dans l'objet de filtre queryFilters(.types) lors de la selection de celui-ci dans le <select>. */
typeFilter.addEventListener('change', (e) => {
    queryFilters.types = e.target.value;
    updatePokemonsToShow();
});

/* Réagit au click sur un entête du tableau */
const handleClickSortPokemon = (element) => {
    if (currentButtonSort == null){     // Si aucun tri est en cours.
        // Le tri deviens le cliquer.
        element.classList.add('sorting');
        queryFilters.sortBy = element.dataset.order;
        currentButtonSort = element;
    } else if (element == currentButtonSort){ // Si le tri en cours est le même que celui du click
        element.classList.toggle('asc');
        // On inverse le sens du tri.
        queryFilters.sortByReversed = !queryFilters.sortByReversed;
    } else {
        // Le tri deviens le cliquer.
        // et on reset le sens avec celui par défaut.
        // On retire également les styles à l'ancien bouttons.
        currentButtonSort.classList.remove('sorting', 'asc');
        element.classList.add('sorting');
        queryFilters.sortBy = element.dataset.order;
        queryFilters.sortByReversed = false;
        currentButtonSort = element;
    }
    // Met a jour la liste des pokémons affiché, en conservant le numéro de page actuelle.
    updatePokemonsToShow(false);
}

/* On trie les pokemons en fonction d'un attribut (by). On indique également le trie ce fait ordre décroissant. */
const sortPokemon = (by, reverse = false) => {
    let coef = reverse ? -1 : 1;
        pokemonToShow.sort((a, b) => {
            if (a[by] > b[by]){
                return 1 * coef;
            } else if (a[by] == b[by]){
                // En cas d'égalité pour l'attribut by, on compare le nom.
                return a.name.localeCompare(b.name);
            } else {
                return -1 * coef;
            }
        });
    // On défini les cookies pour la récupération en cas de rafraichissement.
    setCookie('order', by, 7);
    setCookie('reversed', reverse, 7);
}

/* Lorsque la page est chargé : */
document.addEventListener('DOMContentLoaded', () => {
    /* On importe nos pokémons depuis la classe Pokemon */
    Pokemon.import_pokemon();
    
    /* On met a jour les pokemons à afficher (sans remettre la page à la 1er.) */
    updatePokemonsToShow(false);


    const thOrders = Array.from(document.querySelectorAll('#pok-list th'));

    // Initialisation des valeurs de trie (a cause des cookies)
    currentButtonSort = thOrders.find((e) => e.dataset.order == queryFilters.sortBy);
    currentButtonSort.classList.add('sorting');
    if (queryFilters.sortByReversed) currentButtonSort.classList.add('asc');
    
    showPokemons();

    /* Créé les options contenu dans le <select> permettant de choisir le Type qui sert de filtre.*/
    Object.keys(Type.all_types).forEach((t) => {
        let option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        typeFilter.appendChild(option);
    });

    /* Créé les options contenu dans le <select> permettant de choisir la génération qui sert de filtre.
    Les générations est un ensemble (pour eviter les doublons) des générations de chaque pokémon.*/
    const generations = [...new Set(Object.values(Pokemon.all_pokemons).map(p => p.gen))];
    generations.forEach((gen) => {
        let option = document.createElement('option');
        option.value = gen;
        option.textContent = gen;
        genFilter.appendChild(option);
    });
    
    /* Pour chacun des entête de tableau, on leurs ajoute un evenement lors du click triant les pokémons par 
       leurs propriété HTML data-order */
    sortingButtons.forEach((b) => {
        if (b.dataset.order != null){
            b.addEventListener('click', (e) => {
                handleClickSortPokemon(e.target);
            });
        }
    });
});