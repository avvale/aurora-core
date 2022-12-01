import { JsonValueObject } from './json.value-object';

export abstract class UuidArrayValueObject extends JsonValueObject
{
    get length(): number
    {
        return this.value?.length;
    }

    isArray(): boolean
    {
        return Array.isArray(super.value);
    }
}