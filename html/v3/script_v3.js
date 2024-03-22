const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

var pageTotal = 0;
var pokemonsPerPage = 25;
var currentPage = 1;

const createTDWithImage = (url, name) => {
    let td_img = document.createElement('td');
    let img = document.createElement('img');
    img.src = url;
    img.alt = name;
    td_img.appendChild(img);
    return td_img;
}

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

        tr.appendChild(createTDWithImage("../webp/images/" + Pokemon.formatPokemonId(p.id) + ".webp", p.name + " image"));
        tr.addEventListener('click', () => showMoreInfo(p.id));
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
    let pokemon = Pokemon.all_pokemons[id];

    console.log(pokemon.toString());
    console.log(pokemon.getAttacks()[0].toString());
    console.log(pokemon.getTypes()[0].toString());

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