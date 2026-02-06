import { Crypt } from '../shared';
import { StringValueObject } from './string.value-object';

export abstract class PasswordValueObject extends StringValueObject {
  set value(value: string) {
    this.validateStringRules(value);
    super.value = value && this.data.haveToEncrypt ? Crypt.hash(value) : value;
  }

  get value(): string {
    return super.value;
  }
}
