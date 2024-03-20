const pokemonList = document.querySelector('table-wrapper>table>tbody');

document.addEventListener('DOMContentLoaded', () => {

    Pokemon.import_pokemon();
    showPokemons(Pokemon.all_pokemons);

});


const showPokemons = (pokemons) => {
    pokemonList.innerHTML = '';
    Object.values(pokemons).forEach((p) => {
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