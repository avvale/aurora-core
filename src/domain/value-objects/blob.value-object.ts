import { StringValueObject } from './string.value-object';

export abstract class BlobValueObject extends StringValueObject
{
    get buffer(): Buffer
    {
        return Buffer.from(super.value, 'base64');
    }
}