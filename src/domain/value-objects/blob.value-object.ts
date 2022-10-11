import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object';

export abstract class BlobValueObject extends ValueObject<string | Buffer>
{
    set value(value: string | Buffer)
    {
        if (value instanceof Buffer) value = value.toString('base64');
        super.value = value;
    }

    get buffer(): Buffer
    {
        if (typeof super.value === 'string') return Buffer.from(super.value, 'base64');
        throw new BadRequestException(`The value for BlobValueObject must must to be a string base64, your type is ${typeof super.value}`);
    }
}