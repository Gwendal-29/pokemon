Pokemon.import_pokemon();

const getPokemonsByType = (typeName) => {
    // Filtre les pokémons par le typeName (exactement les mêmes, majuscules / minuscules pris en compte.)
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.types.includes(typeName);
    })
};

const getPokemonsByAttack = (attackName) => {
    // filtre les pokémons qui ont une attack du nom de attackName (majuscules / minuscules pris en compte.)
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.moves.includes(attackName);
    })
};

const getAttackByType = (typeName) => {
    // filtre les attacks qui sont de type typeName (majuscules / minuscules pris en compte.)
    return Object.values(Attack.all_attacks).filter((p) => {
        return p.type == typeName;
    })
};


const sortPokemonByName = () => {
    // renvoie tout les pokemons mais ordonné par leurs nom.
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return a.name.localeCompare(b.name);
    })
};

const sortPokemonByStamina = () => {
    // renvoie tout les pokemons ordonnée par leurs stamina (décroissant)
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return b.stamina - a.stamina;
    })
};

const getWeakestEnemies = (attackName) => {
    // récupére le type de l'attack.
    let type = Attack.all_attacks[attackName].getType();

    // Pour toutes les pokémons :
    return Object.values(Pokemon.all_pokemons).reduce((acc, p) => {
        // On récupére l'efficacité du type de l'attack en fonction de tout les types du pokémon.
        let efficiency = p.getTypes()
                            .map((t) => type.getEffectivenessByType(t.name))
                            .reduce((acc, curr) => acc * curr);
     
        // Si cette effifacité est supérieur à l'ancienne dans ce cas l'objet de stockage est recréé.
        if (efficiency > acc.efficiency) {
            return {pokemons: [p], efficiency: efficiency};
        // sinon si c'est égale, on ajoute ce pokémon à l'objet de stockage.
        } else if (efficiency === acc.efficiency) {
            acc.pokemons.push(p);
        }
        // On return l'objet de stockage
        return acc;
        // par défaut cette objet est initialisé avec un tableau vide 
        // et une efficiency à -1 car aucun pokémon ne peux avoir une efficacité négative.
    
    }, {pokemons: [], efficiency: -1}).pokemons;
};

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

const getArgs = () => {
    const input = document.getElementById("args");
    return input.value;
}

const a = document.querySelectorAll('a');
a.forEach((e) => {
    e.addEventListener('click', (s) => {
        s.preventDefault();
    })
})