import { BadRequestException } from '@nestjs/common';
import { NumberValueObject } from './number.value-object';

export abstract class IntValueObject extends NumberValueObject {
  set value(value: number | null | undefined) {
    if (value !== undefined && value !== null && !Number.isInteger(value))
      throw new BadRequestException(
        `Value for ${this.validationRules.name} has to be a integer value`,
      );

    super.value = value;
  }

  get value(): number {
    return super.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
