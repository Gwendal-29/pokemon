class Pokemon {
    static all_pokemons = {};
    constructor(name, id, form, stamina, defense, attack, gen, types){
        this.id = id;
        this.name = name;
        this.form = form;
        this.stamina = stamina;
        this.defense = defense;
        this.attack = attack;
        this.gen = gen;
        this.types = types;
    }

    toString(){
        return "[" + this.name + "] " + this.name + " A: " + this.attack + " D: " + this.defense;  
    }

    get name() {
        return this.name;
    }

    get id() {
        return this.id;
    }

    get form(){
        return this.form;
    }

    get stamina(){
        return this.stamina;
    }

    get defense(){
        return this.defense;
    }

    get attack(){
        return this.attack;
    }

    get gen(){
        return this.gen;
    }

    get types(){
        return this.types;
    }

    static formatPokemonId(pokemonId) {
        let idString = String(pokemonId);
        while (idString.length < 3) {
            idString = '0' + idString;
        }
        return idString;
    }

    static import_pokemon(){
        pokemon
    }
}