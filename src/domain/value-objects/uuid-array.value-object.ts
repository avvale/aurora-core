import { JsonValueObject } from './json.value-object';

export abstract class UuidArrayValueObject extends JsonValueObject<
  string | string[]
> {
  get length(): number {
    return super.value?.length;
  }

  isArray(): boolean {
    return Array.isArray(super.value);
  }
}
