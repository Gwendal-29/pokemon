
class Type
{
    static all_types = {};

    constructor(name, effectiveness)
    {
        this._name = name;
        this._effectiveness = effectiveness;
    }

    toString()
    {

    }

    get name(){
        return this._name;
    }
    get effectiveness(){
        return this._effectiveness;
    }

    getEffectivenessByType(type)
    {
        return this._effectiveness[type] || 1.0;

    }

}

