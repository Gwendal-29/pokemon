class Pokemon {
    static all_pokemons = {};
    constructor(name, id, form, stamina, defense, attack, gen, types, moves){
        this._id = id;
        this._name = name;
        this._form = form;
        this._stamina = stamina;
        this._defense = defense;
        this._attack = attack;
        this._gen = gen;
        this._types = types;
        this._moves = moves;
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

    get moves(){
        return this._moves;
    }

    // Transforme 1 en 001, 10 en 010 etc...
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
            // On créé a partir des types du pokémon des nouveaux Objet Type si il n'existe pas dans Type.all_types
            types.forEach((t) => {
                if (!Type.all_types[t]){
                    Type.all_types[t] = new Type(t);    
                }
            });

            // On trouve toutes les attacks du pokemons.
            let attacks = pokemon_moves.find((pattack) => pattack.form == "Normal" && pattack.pokemon_name == p.pokemon_name);
            // On décompose ces attacks chargés et fast.
            let moves = [...attacks.charged_moves, ...attacks.fast_moves];
            
            // Verifie si l'attack existe bien sois dans charged moves soit dans fast moves.
            // Sinon on ne l'ajoute pas dans Attack.all_attacks et on la supprime de la liste du pokémon 
            moves = moves.filter((a) => {
                if (!Attack.all_attacks[a]){
                    let attack = new Attack(a);
                    if (attack.name != undefined){
                        Attack.all_attacks[a] = attack; 
                        return true;
                    } else {
                        return false;
                    }

                }
            });
            
            // On créé le pokemon.
            Pokemon.all_pokemons[p.pokemon_id] = new Pokemon(p.pokemon_name, p.pokemon_id, p.form, p.base_stamina, p.base_defense, p.base_attack,
                this.get_gen(p.pokemon_name), 
                pokemon_type.find((ptype) => ptype.form == "Normal" && p.pokemon_name == ptype.pokemon_name).type,
                moves
                );
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
        return this._moves.map((a) => Attack.all_attacks[a]);
    }
}