import { StringValueObject } from './string.value-object';
import { Utils } from './../lib/utils';

export abstract class PasswordValueObject extends StringValueObject
{
    set value(value: string)
    {
        super.value = value && this.data.haveToEncrypt ? Utils.hash(value) : value;
    }

    get value(): string
    {
        return super.value;
    }
}