export interface IValueObject<T> extends Readonly<{ type: string; value: T }> {
  toString(): string;
}
