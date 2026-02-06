import { BadRequestException } from '@nestjs/common';
import { ValueObject } from './value-object';

export abstract class NumberValueObject extends ValueObject<
  number | null | undefined
> {
  set value(value: number | null | undefined) {
    if (value !== undefined && value !== null && isNaN(value))
      throw new BadRequestException(
        `Value for ${this.validationRules.name} has to be a number value`,
      );

    if (value === <number>(<unknown>'')) value = null;

    if (value?.toString().length > this.validationRules.maxLength) {
      throw new BadRequestException(
        `Value for ${this.validationRules.name} is too large, has a maximum length of ${this.validationRules.maxLength}`,
      );
    }

    if (this.validationRules.unsigned && Math.sign(value) === -1) {
      // eslint-disable-next-line max-len
      throw new BadRequestException(
        `The numerical value for ${this.validationRules.name} must have a positive sign, this field does not accept negative values, the received value is ${value}`,
      );
    }

    super.value = value;
  }

  get value(): number {
    return super.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
