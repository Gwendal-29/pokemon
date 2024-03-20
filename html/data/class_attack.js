class Attack {

    static all_attacks = {}

    constructor(name)
    {   
        let attack = charged_moves.find((moves) => moves.name == name);
        let is_charged = false;
        
        if (attack == undefined) {
            attack = fast_moves.find((moves) => moves.name == name);
            is_charged = true;
        } 
        
        if (attack == undefined) {
            console.log("Undefined moves : " + name);
            return null;
        }

        this._critical_chance = attack.critical_chance || 0;
        this._duration = attack.duration;
        this._energy_delta = attack.energy_delta;
        this._name = name;
        this._power = attack.power;
        this._stamina_loss_scaler = attack.stamina_loss_scaler;
        this._type = attack.type;
        this._is_charged = is_charged;    
    }

    get critical_chance(){return this._critical_chance}
    get duration(){return this._duration}
    get energy_delta(){return this._energy_delta}
    get name(){return this._name}
    get power(){return this._power}
    get stamina_loss_scaler(){return this._stamina_loss_scaler}
    get type(){return this._type}
    get is_charged(){return this._is_charged}

    getType(){
        return Type.all_types[this.type];
    }
}