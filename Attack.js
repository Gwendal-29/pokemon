class Attack{

    static all_attacks = {}

    /**
     * 
     * @param {*} critical_chance 
     * @param {*} duration 
     * @param {*} property 
     * @param {*} energy_delta 
     * @param {*} name 
     * @param {*} power 
     * @param {*} stamina_loss_scaler 
     * @param {*} type 
     * @param {*} is_charged 
     * @param {*} critical_chance 
     */
    constructor
    (
        critical_chance,
        duration,
        property,
        energy_delta,
        name,
        power,
        stamina_loss_scaler,
        type,
        is_charged,
        critical_chance = 0
    )
    {
        this._critical_chance = critical_chance;
        this._duration = duration;
        this._property = property;
        this._energy_delta = energy_delta;
        this._name = name;
        this._power = power;
        this._stamina_loss_scaler = stamina_loss_scaler;
        this._type = type;
        this._is_charged = is_charged;
        this._critical_chance = critical_chance;
    
    }

    get critical_chance(){return this._critical_chance}
    get duration(){return this._duration}
    get property(){return this._property}
    get energy_delta(){return this._energy_delta}
    get name(){return this._name}
    get power(){return this._power}
    get stamina_loss_scaler(){return this._stamina_loss_scaler}
    get type(){return this._type}
    get is_charged(){return this._is_charged}
    get critical_chance(){return this._critical_chance}
}