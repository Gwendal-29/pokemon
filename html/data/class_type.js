class Type
{
    static all_types = {};

    constructor(name)
    {
        this._name = name;
        this._effectiveness = type_effectiveness[name] || [];
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

    static getImgUrl(typeName){
        return "webp/types/" + typeName.toLowerCase() + ".png";
    }
}

