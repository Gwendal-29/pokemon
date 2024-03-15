Pokemon.import_pokemon();

const getPokemonsByType = (typeName) => {
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.types.includes(typeName);
    })
};

console.log(getPokemonsByType('Fire'));

const getPokemonsByAttack = (attackName) => {
    return Object.values(Pokemon.all_pokemons).filter((p) => {
        return p.moves.includes(attackName);
    })
};

console.log(getPokemonsByAttack('Sludge Bomb'));

const getAttackByType = (typeName) => {
    return Object.values(Attack.all_attacks).filter((p) => {
        return p.type == typeName;
    })
};

console.log(getAttackByType('Fire'));

const sortPokemonByName = () => {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return a.name.localeCompare(b.name);
    })
};

console.log(sortPokemonByName());

const sortPokemonByStamina = () => {
    return Object.values(Pokemon.all_pokemons).sort((a, b) => {
        return b.stamina - a.stamina;
    })
};

console.log(sortPokemonByStamina());

const getWeakestEnemies = (attackName) => {
    return Array.from(new Set(...[...Attack.all_attacks[attackName].getType().getTypeWithMinimumEffectiveness().map((t) => getPokemonsByType(t))]));
};

console.log(getWeakestEnemies("Fury Cutter"));

const getStrongestEnemies = (attackName) => {
    return Array.from(new Set(...[...Attack.all_attacks[attackName].getType().getTypeWithMaximumEffectiveness().map((t) => getPokemonsByType(t))]));
};

console.log(getStrongestEnemies("Fury Cutter"));