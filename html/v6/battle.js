class PokemonFighting {
    constructor (pokemon, fast_move, charged_move, hp = 100){
        this._pokemon = pokemon;
        this._hp = hp;
        this._fast_move = fast_move;
        this._charged_move = charged_move;
        this._energy = 0;
        this._is_attacking = false;
    }

    get pokemon() { return this._pokemon; }
    get fast_move() { return this._fast_move; }
    get charged_move() { return this._charged_move; }
    get energy(){ return this._energy; }
    get is_attacking(){ return this._is_attacking; }
    get hp() { return this._hp; }

    set energy(energy){ this._energy = energy; }
    set hp(hp){ this._hp = hp; }
    set is_attacking(is_attacking) { this._is_attacking = is_attacking; }

    attackBy(enemy, img) {
        if (!enemy.is_attacking){
            enemy.is_attacking = true;
            console.log("energy delta", enemy.charged_move.energy_delta * -1)
            console.log("energyyyy : ", enemy.energy)
            if (enemy.energy > enemy.charged_move.energy_delta * -1){
                enemy.energy = enemy.energy + enemy.charged_move.energy_delta;
                let efficacity = this.getAttackEfficacity(enemy.charged_move);
                // TODO : Chance critique
                setTimeout(() => {
                    this.hp = this.hp - enemy.charged_move.power * efficacity;
                    enemy.is_attacking = false;
                    console.log("Charged move finish");

                    img.classList.add('little');
                    setTimeout(() => {
                        img.classList.remove('little');
                    }, 100);

                }, enemy.charged_move.duration);

            } else {
                let efficacity = this.getAttackEfficacity(enemy.fast_move);
                enemy.energy = enemy.energy + enemy.fast_move.energy_delta;
                setTimeout(() =>{
                    this.hp = this.hp - enemy.fast_move.power * efficacity;
                    enemy.is_attacking = false;
                    console.log("set false");


                    img.classList.add('little');
                    setTimeout(() => {
                        img.classList.remove('little');
                    }, 120);
                }, enemy.fast_move.duration);
            }
        }
    }

    getAttackEfficacity(attack){
        let efficiency = this.pokemon.getTypes()
            .map((t) => attack.getType().getEffectivenessByType(t.name))
            .reduce((acc, curr) => acc * curr);

        return efficiency;
    }
}

class Battle {
    static pokemonEnemy = document.querySelector('.pok-enemy'); 
    static pokemonAlly = document.querySelector('.pok-ally'); 

    static noPokemonEnemy = document.getElementById('pok-enemy-miss');
    static noPokemonAlly = document.getElementById('pok-enemy-ally');

    constructor (){
        this._enemy = null;
        this._ally = null;
        this._battle = false;
    }

    get enemy() { return this._enemy; }
    get ally() { return this._ally; } 
    
    set enemy (enemy) {
        this._enemy = enemy;
        this.updatePokemonBattle(false);
    }

    set ally (ally) {
        this._ally = ally;
        this.updatePokemonBattle(true);
    }

    updatePokemonBattle(ally){
        if (ally){
            if (this.ally){
                Battle.pokemonAlly.style.display = "grid";
                Battle.noPokemonAlly.style.display = "none";
                this.setDisplayPokemon(ally);
            } else {
                Battle.pokemonAlly.style.display = "none";
                Battle.noPokemonAlly.style.display = "block";
            }
        } else {
            if (this.enemy){
                Battle.pokemonEnemy.style.display = "grid";
                Battle.noPokemonEnemy.style.display = "none";
                this.setDisplayPokemon(ally);
            } else {
                Battle.pokemonEnemy.style.display = "none";
                Battle.noPokemonEnemy.style.display = "block";
            }
        }
    }

    setDisplayPokemon(ally = true){
        if (ally){
            Battle.pokemonAlly.querySelector('.name').textContent = this.ally.pokemon.name;
            Battle.pokemonAlly.querySelector('img').src = "../webp/images/"+Pokemon.formatPokemonId(this.ally.pokemon.id)+".webp";
        } else {
            Battle.pokemonEnemy.querySelector('.name').textContent = this.enemy.pokemon.name;
            Battle.pokemonEnemy.querySelector('img').src = "../webp/images/"+Pokemon.formatPokemonId(this.enemy.pokemon.id)+".webp";
        }
    }

    startBattle(){
        if (this._battle) return;
        this._battle = true;

        console.log('battle start !!')

        const enemyAttackInterval = setInterval(() => {
            if (this.enemy && this.ally.hp > 0) {
                if (!this.enemy.is_attacking){
                    this.ally.attackBy(this.enemy, Battle.pokemonAlly.querySelector('img'));
                    console.log(this.ally.hp)
                }
            } else {
                clearInterval(enemyAttackInterval);
            }
        }, 100);
    }

}

