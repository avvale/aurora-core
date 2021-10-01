import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object';

export abstract class BooleanValueObject extends ValueObject<boolean>
{
    set value(value: boolean)
    {
        if (value === <boolean><unknown>'') value = null;
        if (value !== undefined && value !== null && typeof value !== 'boolean') throw new BadRequestException(`Value for ${this.validationRules.name} has to be a boolean value`);

        super.value = value;
    }

    get value(): boolean
    {
        return super.value;
    }

    toString(): string
    {
        return this.value.toString();
    }
}