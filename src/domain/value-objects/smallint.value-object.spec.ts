import { ValidationRules } from './../aurora.types';

// custom items
import { SmallintValueObject } from './smallint.value-object';

class MockSmallintValueObject extends SmallintValueObject {
  public readonly type: string = 'MockSmallintValueObject';

  constructor(value: number, validationRules: ValidationRules = {}) {
    super(value, validationRules);
  }
}

describe('NumberValueObject', () => {
  describe('main', () => {
    test('MockSmallintValueObject should be defined with 10 value', () => {
      const mockNumberValueObject = new MockSmallintValueObject(10, {
        name: 'MockSmallintValueObject',
      });
      expect(mockNumberValueObject.value).toBe(10);
    });

    test('MockSmallintValueObject should be defined with toString method, 10 value', () => {
      const mockNumberValueObject = new MockSmallintValueObject(10, {
        name: 'MockSmallintValueObject',
      });
      expect(mockNumberValueObject.toString()).toBe('10');
    });

    test('MockSmallintValueObject should be defined with 0 value', () => {
      const mockNumberValueObject = new MockSmallintValueObject(0, {
        name: 'MockSmallintValueObject',
      });
      expect(mockNumberValueObject.value).toBe(0);
    });

    test('MockSmallintValueObject should be have max length of 5 digits', () => {
      expect(
        () =>
          new MockSmallintValueObject(100000, {
            name: 'MockSmallintValueObject',
            nullable: false,
            undefinable: false,
            maxLength: 5,
            unsigned: true,
          }),
      ).toThrowError(
        'Value for MockSmallintValueObject is too large, has a maximum length of 5',
      );
    });
  });
});
