import { BadRequestException } from '@nestjs/common';
import { isValidJson } from '../functions';
import { ValueObject } from './value-object';

export abstract class JsonValueObject<T = string | object> extends ValueObject<T>
{
    set value(value: any)
    {
        if (value === '') value = null; // avoid empty value, throw a error to parse

        if (typeof value === 'string')
        {
            if (!isValidJson(value))
            {
                throw new BadRequestException(`Value for ${this.validationRules.name} has to be a valid JSON, value ${value} is not a valid JSON`);
            }
            super.value = JSON.parse(value);
        }
        else
        {
            super.value = value;
        }
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