import { ValueObject } from './value-object';

export abstract class UuidArrayValueObject extends ValueObject<string[]>
{
    get length(): number
    {
        return super.value?.length;
    }

    isArray(): boolean
    {
        return Array.isArray(super.value);
    }

    toString(): string
    {
        return super.value.toString();
    }
}