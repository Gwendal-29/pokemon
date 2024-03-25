class PokemonFighting {
    constructor (pokemon, fast_move, charged_move){
        this._pokemon = Pokemon.all_pokemons[pokemon];
        this._fast_move = Attack.all_attacks[fast_move];
        this._charged_move = Attack.all_attacks[charged_move];
    }
}

class Battle {
    static #pokemonEnemy = document.getElementById('pok-enemy'); 
    static #pokemonAlly = document.getElementById('pok-ally'); 

    constructor (){
        this._enemy = null;
        this._ally = null;
    }

    get enemy() { return this._enemy; }
    get ally() { return this._ally; } 
    
    set enemy (enemy) {this._enemy = this.enemy}
    set ally (ally) {this._ally = this.ally}


}