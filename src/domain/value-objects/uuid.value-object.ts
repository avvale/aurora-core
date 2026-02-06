import { BadRequestException } from '@nestjs/common';
import * as validate from 'uuid-validate';
import { StringValueObject } from './string.value-object';

export abstract class UuidValueObject extends StringValueObject {
  set value(value: string) {
    // null, undefined and length validation checked in StringValueObject
    if (value && value.length === 36 && !validate(value))
      throw new BadRequestException(
        `Value for ${this.validationRules.name} has value: ${value}, not allowed for uuid`,
      );

    super.value = value;
  }

  get value(): string {
    return super.value;
  }
}
