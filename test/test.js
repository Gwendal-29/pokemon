Pokemon.import_pokemon();

const getPokemonsByType = (typeName) => {
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.types.includes(typeName);
    })
};

const getPokemonsByAttack = (attackName) => {
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.moves.includes(attackName);
    })
};

const getAttackByType = (typeName) => {
    return Object.values(Attack.all_attacks).filter((p) => {
        return p.type == typeName;
    })
};


const sortPokemonByName = () => {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return a.name.localeCompare(b.name);
    })
};

const sortPokemonByStamina = () => {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return b.stamina - a.stamina;
    })
};

const getWeakestEnemies = (attackName) => {
    let type = Attack.all_attacks[attackName].getType();

    return Object.values(Pokemon.all_pokemons).reduce((acc, p) => {
        let efficiency = p.getTypes()
                            .map((t) => type.getEffectivenessByType(t.name))
                            .reduce((acc, curr) => acc * curr);

        if (efficiency > acc.efficiency) {
            return {pokemons: [p], efficiency: efficiency};
        } else if (efficiency === acc.efficiency) {
            acc.pokemons.push(p);
        }
        return acc;
    }, {pokemons: [], efficiency: -1}).pokemons;
};

const getBestAttacksForEnemy = (name) => {
    let pokemon = Object.values(Pokemon.all_pokemons).find((p) => p.name == name);
    
    let types = pokemon.getTypes();


    let types_efficiency = Object.values(Type.all_types)
        .map((type) => {
            let efficiency = types
                            .map((t) => type.getEffectivenessByType(t.name))
                            .reduce((acc, curr) => acc * curr);
            return [type, efficiency];
        });

    return types_efficiency.reduce((acc, [type, efficiency]) => {
        if (efficiency > acc.efficiency) {
            return {types: [type], efficiency: efficiency};
        } else if (efficiency === acc.efficiency) {
            acc.types.push(type);
        }
        return acc;
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