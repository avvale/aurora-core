import { ValueObject } from './value-object';
import { BadRequestException } from '@nestjs/common';

export abstract class NumberValueObject extends ValueObject<number>
{
    set value(value: number)
    {
        if (value === <number><unknown>'') value = null;
        if (value?.toString().length > this.validationRules.maxLength) throw new BadRequestException(`Value for ${this.validationRules.name} is too large, has a maximum length of ${this.validationRules.maxLength}`);
        if (this.validationRules.unsigned && Math.sign(value) === -1) throw new BadRequestException(`The numerical value for ${this.validationRules.name} must have a positive sign, this field does not accept negative values`);

        super.value = value;
    }

    get value(): number
    {
        return super.value;
    }

    toString(): string
    {
        return this.value.toString();
    }
}