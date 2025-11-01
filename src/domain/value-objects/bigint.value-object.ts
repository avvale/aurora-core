import { NumberValueObject } from './number.value-object';

export abstract class BigintValueObject extends NumberValueObject
{
    set value(value: number | null | undefined)
    {
        if (typeof value === 'string')
        {
            super.value = value ? Number(value) : null;
        }
        else
        {
            super.value = value;
        }
    }
}
