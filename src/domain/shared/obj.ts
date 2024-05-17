import { LiteralObject } from '../aurora.types';

export const obj = (item: LiteralObject): Obj => new Obj(item);

class Obj
{
    private _item: LiteralObject;

    constructor(item: LiteralObject)
    {
        this._item = item;
    }

    toObject(): LiteralObject
    {
        return this._item;
    }

    deepMapValues(fn: (val, key) => any): Obj
    {
        const innerDeepMapValues = (obj, fn: (val, key) => any): LiteralObject =>
        {
            if (Array.isArray(obj))
            {
                return obj.map((val, key)  => (typeof val === 'object') ? innerDeepMapValues(val, fn) : fn(val, key));
            }
            else if (typeof obj === 'object')
            {
                // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/null
                const res = obj === null ? null : {};
                for (const key in obj)
                {
                    const val = obj[key];
                    if (typeof val === 'object')
                    {
                        res[key] = innerDeepMapValues(val, fn);
                    }
                    else
                    {
                        res[key] = fn(val, key);
                    }
                }
                return res;
            }
            else
            {
                return obj;
            }
        };

        this._item = innerDeepMapValues(this._item, fn);
        return this;
    }
}