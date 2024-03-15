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

    getTypeWithMinimumEffectiveness() {
        const entries = Object.entries(this.effectiveness);
    
        const [minTypes, _] = entries.reduce((acc, [type, effectiveness]) => {
            if (effectiveness < acc[1]) {
                return [[type], effectiveness];
            } else if (effectiveness === acc[1]) {
                acc[0].push(type);
            }
            return acc;
        }, [[], Infinity]);
    
        return minTypes;
    }

    getTypeWithMaximumEffectiveness() {
        const entries = Object.entries(this.effectiveness);
    
        const [maxTypes, _] = entries.reduce((acc, [type, effectiveness]) => {
            if (effectiveness > acc[1]) {
                return [[type], effectiveness];
            } else if (effectiveness === acc[1]) {
                acc[0].push(type);
            }
            return acc;
        }, [[], 0]);
    
        return maxTypes;
    }
}

