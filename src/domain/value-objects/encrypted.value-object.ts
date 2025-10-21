import { StringValueObject } from './string.value-object';
import { Crypt } from '../shared';
import { readFileSync } from 'node:fs';

export abstract class EncryptedValueObject extends StringValueObject
{
    set value(value: string)
    {
        this.validateStringRules(value);

        if (value && this.data.haveToEncrypt)
        {
            const publicKey = readFileSync(process.env.OAUTH_PUBLIC_KEY_PATH, 'utf8');
            super.value = Crypt.encrypt(value, publicKey)
        }
        else
        {
            super.value = value;
        }
    }

    get value(): string
    {
        if (super.value && this.data.haveToDecrypt)
        {
            const privateKey = readFileSync(process.env.OAUTH_PRIVATE_KEY_PATH, 'utf8');
            return Crypt.decrypt(super.value, privateKey);
        }
        return super.value;
    }
}