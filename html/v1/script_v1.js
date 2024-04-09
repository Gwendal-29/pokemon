const pokemonList = document.querySelector('table>tbody');
const pageInfos = document.querySelectorAll('p.info-page');

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

/* Affiche les pokémons dans le <table> pokemonList. */
const showPokemons = () => {
    pokemonList.innerHTML = '';

    pokemonToShow.forEach((p) => {
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

/* Lorsque la page est chargé : */
document.addEventListener('DOMContentLoaded', () => {
    /* On importe nos pokémons depuis la classe Pokemon */
    Pokemon.import_pokemon();

    pokemonToShow = Object.values(Pokemon.all_pokemons);
    showPokemons();
});