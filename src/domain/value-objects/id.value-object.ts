import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';

export abstract class IdValueObject extends StringValueObject
{
    set value(value: string)
    {
        // null, undefined and length validation checked in StringValueObject
        if (value && value.length !== 21)
            throw new BadRequestException(`Value for ${this.validationRules.name} has value: ${value}, not allowed for id, has length: ${value.length}`);

        super.value = value;
    }

    get value(): string
    {
        return super.value;
    }
}