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
            let types = pokemon_type.find((ptype) => ptype.form == "Normal" && ptype.pokemon_name == p.pokemon_name).type;

            types.map((t) => {
                if (!Type.all_types[t]){
                    Type.all_types[t] = new Type(t);    
                }
            });

            let attacks = pokemon_moves.find((pattack) => pattack.form == "Normal" && pattack.pokemon_name == p.pokemon_name);
            [...attacks.charged_moves, ...attacks.fast_moves]
                .map((a) => {
                    if (!Attack.all_attacks[a]){
                        Attack.all_attacks[a] = new Attack(a);    
                    }
                })

            Pokemon.all_pokemons[p.pokemon_id] = new Pokemon(p.pokemon_name, p.pokemon_id, p.form, p.base_stamina, p.base_defense, p.base_attack,
             this.get_gen(p.pokemon_name), 
             pokemon_type.find((ptype) => ptype.form == "Normal" && p.pokemon_name == ptype.pokemon_name).type);
            });
    }

    static get_gen(name){
        for (let gen in generation) {
            if (generation[gen].some((p) => p.name == name)){
                return gen;
            }
        } 
        return "Unknown generation."
    }

    getTypes(){
        return this._types.map((t) => Type.all_types[t]);
    }

    getAttacks(){
        return this._attack.map((a) => Attack.all_attacks[a]);
    }
}