import { StringValueObject } from './string.value-object';
import { Crypt } from '../shared';

export abstract class PasswordValueObject extends StringValueObject
{
    set value(value: string)
    {
        this.validateStringRules(value);
        super.value = value && this.data.haveToEncrypt ? Crypt.hash(value) : value;
    }

    get value(): string
    {
        return super.value;
    }
}