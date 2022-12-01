import { ValueObject } from './value-object';

export abstract class JsonValueObject<T = string | object> extends ValueObject<T>
{
    set value(value: any)
    {
        if (value === '') value = null; // avoid empty value, throw a error to parse
        super.value = typeof value === 'string' ? JSON.parse(value) : value;
    }

    get value(): any
    {
        return super.value;
    }

    toString(): string
    {
        return JSON.stringify(this.value);
    }
}