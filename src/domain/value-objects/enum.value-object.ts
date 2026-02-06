import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';

export abstract class EnumValueObject<
  T extends string = string,
> extends StringValueObject {
  set value(value: T) {
    if (value && !this.validationRules.enumOptions.includes(value))
      throw new BadRequestException(
        `Value for ${this.validationRules.name} has to be any of this options: ${this.validationRules.enumOptions.join(', ')}`,
      );

    super.value = value;
  }

  get value(): T {
    return super.value as T;
  }
}
