import { BadRequestException } from '@nestjs/common';
import { NumberValueObject } from './number.value-object';

export abstract class DecimalValueObject extends NumberValueObject
{
    set value(value: number)
    {
        //if (value !== undefined && value !== null && Number.isNaN(value)) throw new BadRequestException(`Value for ${this.validationRules.name} has to be a number value`);
        // for decimal only, we add one to the maxLength to accommodate the decimal point symbol.
        this.validationRules.maxLength++;

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