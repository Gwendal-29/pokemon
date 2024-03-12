class Pokemon {
    static all_pokemons = {};
    constructor(name, id, form, stamina, defense, attack, gen, types){
        this._id = id;
        this._name = name;
        this._form = form;
        this._stamina = stamina;
        this._defense = defense;
        this._attack = attack;
        this._gen = gen;
        this._types = types;
    }

    toString(){
        return "[" + this.name + "] " + this.name + " A: " + this.attack + " D: " + this.defense;  
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get form(){
        return this._form;
    }

    get stamina(){
        return this._stamina;
    }

    get defense(){
        return this._defense;
    }

    get attack(){
        return this._attack;
    }

    get gen(){
        return this._gen;
    }

    get types(){
        return this._types;
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
        .filter((p) => p.form == "Normal")
        .forEach((p) => {
            let types = this.get_types(p.pokemon_name);

            types.map((t) => {
                if (!Type.all_types[t]){
                    Type.all_types[t] = new Type(t);    
                }
                return Type.all_types[t];
            });

            Pokemon.all_pokemons[p.pokemon_id] = new Pokemon(p.pokemon_name, p.pokemon_id, p.form, p.base_stamina, p.base_defense, p.base_attack,
             this.get_gen(p.pokemon_name), 
             types);
            });
    }

    static get_gen(name){
        for (let gen in generation) {
            if (generation[gen].some((p) => p.name == name)){
                return gen;
            }
        } 
        return "Unknown génération."
    }

    static get_types(name){
        return pokemon_type.find((p) => p.form == "Normal" && p.pokemon_name == name).type
    }
}