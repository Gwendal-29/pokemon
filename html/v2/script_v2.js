const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

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

/* Affiche les pokémons dans le <table> pokemonList en fonction de la pagnination. */

const showPokemons = () => {
    pokemonList.innerHTML = '';
    pageTotal = Math.ceil(pokemonToShow.length / pokemonsPerPage);

    pageInfos.forEach((info) => info.textContent = currentPage + "/" + pageTotal)
    
    const startIndex = (currentPage - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const currentPokemons = pokemonToShow.slice(startIndex, endIndex);

    updateNextButtons();
    updatePrevButtons();

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

        tr.appendChild(td_img);
        // Ajout la ligne à la liste.
        pokemonList.appendChild(tr);
    });
}

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

/* Met à jour les pokémons a afficher (pokemonToShow)
   Et actualise ceux déjà affiché. */
const updatePokemonsToShow = (reset = true) => {
    if (reset) currentPage = 1;
    showPokemons();
}

/* Lorsque la page est chargé : */
document.addEventListener('DOMContentLoaded', () => {
    /* On importe nos pokémons depuis la classe Pokemon */
    Pokemon.import_pokemon();
    
    /* On met a jour les pokemons à afficher (sans remettre la page à la 1er.) */
    updatePokemonsToShow(false);
    
    pokemonToShow = Object.values(Pokemon.all_pokemons);
    showPokemons();
});