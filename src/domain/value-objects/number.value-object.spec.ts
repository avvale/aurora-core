import { ValidationRules } from './../aurora.types';

// custom items
import { NumberValueObject } from './number.value-object';

class MockNumberValueObject extends NumberValueObject
{
    public readonly type: string = 'MockNumberValueObject';

    constructor(value: number, validationRules: ValidationRules = {})
    {
        super(value, validationRules);
    }
}

describe('NumberValueObject', () =>
{
    describe('main', () =>
    {
        test('MockNumberValueObject should be defined with 10 value', () =>
        {
            const mockNumberValueObject = new MockNumberValueObject(10, {
                name: 'MockNumberValueObject',
            });
            expect(mockNumberValueObject.value).toBe(10);
        });

        test('MockNumberValueObject should be defined with toString method, 10 value', () =>
        {
            const mockNumberValueObject = new MockNumberValueObject(10, {
                name: 'MockNumberValueObject',
            });
            expect(mockNumberValueObject.toString()).toBe('10');
        });

        test('MockNumberValueObject should catch error: must be defined, BadRequestException: can not be null', () =>
        {
            expect(() =>
                new MockNumberValueObject(null, {
                    name    : 'MockNumberValueObject',
                    nullable: false,
                }),
            ).toThrowError('Value for MockNumberValueObject must be defined, can not be null');
        });

        test('MockNumberValueObject should catch error: must be defined, BadRequestException: can not be undefined', () =>
        {
            expect(() =>
                new MockNumberValueObject(undefined, {
                    name       : 'MockNumberValueObject',
                    undefinable: false,
                }),
            ).toThrowError('Value for MockNumberValueObject must be defined, can not be undefined');
        });

        test('MockNumberValueObject should catch error: must be defined, BadRequestException: can not be empty value', () =>
        {
            expect(() =>
                new MockNumberValueObject(<number><unknown>'', {
                    name    : 'MockNumberValueObject',
                    nullable: false,
                }),
            ).toThrowError('Value for MockNumberValueObject must be defined, can not be null');
        });

        test('MockNumberValueObject should catch error: must be defined, BadRequestException: has a maximum length', () =>
        {
            expect(() =>
                new MockNumberValueObject(123456, {
                    name     : 'MockNumberValueObject',
                    maxLength: 5,
                }),
            ).toThrowError('Value for MockNumberValueObject is too large, has a maximum length of 5');
        });

        test('MockNumberValueObject should catch error: must be defined, BadRequestException: must have a positive sign', () =>
        {
            expect(() =>
                new MockNumberValueObject(-1, {
                    name    : 'MockNumberValueObject',
                    unsigned: true,
                }),
            ).toThrowError('The numerical value for MockNumberValueObject must have a positive sign, this field does not accept negative values');
        });
    });
});