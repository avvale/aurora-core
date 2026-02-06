import { Crypt } from '../shared';
import { StringValueObject } from './string.value-object';

export abstract class EncryptedValueObject extends StringValueObject {
  set value(value: string) {
    this.validateStringRules(value);

    if (value && this.data.haveToEncrypt) {
      super.value = Crypt.encryptWithAuroraPublicKey(value);
    } else {
      super.value = value;
    }
  }

  get value(): string {
    if (super.value && this.data.haveToDecrypt) {
      return Crypt.decryptWithAuroraPrivateKey(super.value);
    }
    return super.value;
  }
}
