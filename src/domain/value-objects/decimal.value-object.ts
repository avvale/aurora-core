import { BadRequestException } from '@nestjs/common';
import { NumberValueObject } from './number.value-object';

export abstract class DecimalValueObject extends NumberValueObject
{
    set value(value: number)
    {
        //if (value !== undefined && value !== null && Number.isNaN(value)) throw new BadRequestException(`Value for ${this.validationRules.name} has to be a number value`);

        // get integers and decimals length
        const decimalCounter = this.decimalCount(value);
        const integersLimit = this.validationRules.decimals[0] - this.validationRules.decimals[1];
        const decimalsLimit = this.validationRules.decimals[1];

        if (decimalCounter.integers > integersLimit)
            throw new BadRequestException(`Value for ${this.validationRules.name} is too large, has a maximum length of ${integersLimit} integers in ${value} number`);
        if (decimalCounter.decimals > decimalsLimit)
            throw new BadRequestException(`Value for ${this.validationRules.name} is too large, has a maximum length of ${decimalsLimit} decimals in ${value} number`);

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

    decimalCount(value: number): { integers: number; decimals: number; }
    {
        // get absolute value of number and convert to string
        const n = String(Math.abs(value));

        if (n.includes('.'))
        {
            return {
                integers: n.split('.')[0].length,
                decimals: n.split('.')[1].length,
            };
        }
        // String Does Not Contain Decimal
        return {
            integers: n.length,
            decimals: 0,
        };
    }
}