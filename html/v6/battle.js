class PokemonFighting {
    constructor (pokemon, fast_move, charged_move, max_hp = 100){
        this._pokemon = pokemon;
        this._max_hp = max_hp;
        this._hp = max_hp;
        this._fast_move = fast_move;
        this._charged_move = charged_move;
        this._energy = 0;
        this._is_attacking = false;
        this._currentAttack = null;
    }

    get pokemon() { return this._pokemon; }
    get fast_move() { return this._fast_move; }
    get charged_move() { return this._charged_move; }
    get energy(){ return this._energy; }
    get is_attacking(){ return this._is_attacking; }
    get hp() { return this._hp; }
    get max_hp() { return this._max_hp; }

    set energy(energy){ this._energy = energy; }
    set hp(hp){ this._hp = hp; }
    set is_attacking(is_attacking) { this._is_attacking = is_attacking; }

    attackBy(enemy, img, ally, imgEnemy, battle) {
        if (!enemy.is_attacking){
            enemy.is_attacking = true;
            let move = enemy.energy > enemy.charged_move.energy_delta * -1 ? enemy.charged_move : enemy.fast_move;
            enemy.energy = enemy.energy + move.energy_delta;

            let efficacity = this.getAttackEfficacity(move);
            let coef = ally ? 1 : -1;
                gsap.timeline()
                    .to(imgEnemy, { duration: 0.1, rotation: 25 * coef })
                    .to({}, { duration: (move.duration - 300) / 1000 })
                    .to(imgEnemy, { duration: 0.1, rotation: 0, x: -200 * coef, y: 100 * coef })
                    .to(imgEnemy, { duration: 0.1, x: 0, y: 0 });
                
                this._currentAttack = setTimeout(() =>{
                    let new_hp = Math.round(this.hp - move.power * efficacity);
                    this.hp = new_hp > 0 ? new_hp : 0;
                    Battle.updateHP(ally, this);
                    console.log('energy during attack : ' + enemy.energy)

                    if (!ally){
                        Battle.updateEnergy(this, enemy.energy);
                    }
                    enemy.is_attacking = false;

                    gsap.timeline()
                     .to(img, { duration: 0.01, scaleX: -coef, scaleY: 0.8 })
                     .to({}, { duration: 0.120, })
                     .to(img, { duration: 0.01, scaleX: -coef, scaleY: 1 })

                     if (this.hp == 0){
                         battle.finishBattle(!ally);
                     }
                }, move.duration);
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

    static pokemonEnemyImg = Battle.pokemonEnemy.querySelector('img'); 
    static pokemonAllyImg = Battle.pokemonAlly.querySelector('img'); 

    static noPokemonEnemy = document.getElementById('pok-enemy-miss');
    static noPokemonAlly = document.getElementById('pok-enemy-ally');

    static finishDiv = document.getElementById('finish');

    static energyMove = document.querySelector('.energy');

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
                Battle.updateHP(ally, this.ally);
                Battle.updateEnergy(this.ally);
            } else {
                Battle.pokemonAlly.style.display = "none";
                Battle.noPokemonAlly.style.display = "block";
            }
        } else {
            if (this.enemy){
                Battle.pokemonEnemy.style.display = "grid";
                Battle.noPokemonEnemy.style.display = "none";
                this.setDisplayPokemon(ally);
                Battle.updateHP(ally, this.enemy);
            } else {
                Battle.pokemonEnemy.style.display = "none";
                Battle.noPokemonEnemy.style.display = "block";
            }
        }
    }

    static updateHP(ally, pokemon){
        let hpElement = ally ? Battle.pokemonAlly.querySelector('.hp') : Battle.pokemonEnemy.querySelector('.hp');
        let hpBarElement = ally ? Battle.pokemonAlly.querySelector('.actual') : Battle.pokemonEnemy.querySelector('.actual');
        
        if (pokemon.hp < pokemon.max_hp/2){
            if (pokemon.hp < pokemon.max_hp/4){
                hpBarElement.classList.add('low');
            } else {
                hpBarElement.classList.add('medium');
            }
        }

        hpElement.textContent = pokemon.hp;
        let hpBarWidth = (pokemon.hp / pokemon.max_hp) * 100;
        gsap.to(hpBarElement, { duration: 0.3, width: hpBarWidth + '%' });
    }
    
    static updateEnergy(pokemon, energy = 0){
        const energyBarHeight = (1 - (energy / pokemon.charged_move.energy_delta * -1)) * 100;
        gsap.to(Battle.energyMove, { duration: 0.3, height: energyBarHeight + '%' });
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
        this.resetBattle();
        this._battle = true;


        const enemyAttackInterval = setInterval(() => {
            if (this._battle && this.enemy && this.ally.hp > 0) {
                if (!this.enemy.is_attacking){
                    if (Math.floor(Math.random() * 1000) > 900){
                       this.ally.attackBy(this.enemy, Battle.pokemonAllyImg, true, Battle.pokemonEnemyImg, this);
                    }
                }
            } else {
                clearInterval(enemyAttackInterval);
            }
        }, 100);
    }

    finishBattle(ally){
        this._battle = false;
        clearTimeout(this.ally._currentAttack);
        clearTimeout(this.enemy._currentAttack);
        let name = ally ? this.ally.pokemon.name : this.enemy.pokemon.name;
        Battle.finishDiv.textContent = 'Le ' + name + ' ' + (ally ? "allié" : "enemie") + " remporte le combat !";
        Battle.finishDiv.classList.add('show');
        gsap.globalTimeline.kill();
    }

    resetBattle(){
        this.ally.hp = this.ally.max_hp;
        this.enemy.hp = this.enemy.max_hp;
        this.ally.is_attacking = false;
        this.enemy.is_attacking = false;
        this.ally.energy = 0;
        this.enemy.energy = 0;
        Battle.updateHP(true, this.ally);
        Battle.updateHP(false, this.enemy);
        Battle.finishDiv.classList.remove('show');
    }

}

