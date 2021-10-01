import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';

export abstract class EnumValueObject extends StringValueObject
{
    set value(value: string)
    {
        if (
            value &&
            !this.validationRules.enumOptions.includes(value)
        ) throw new BadRequestException(`Value for ${this.validationRules.name} has to be any of this options: ${this.validationRules.enumOptions.join(', ')}`);

        super.value = value;
    }

    get value(): string
    {
        return super.value;
    }
}