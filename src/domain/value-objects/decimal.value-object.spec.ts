import { ValidationRules } from './../aurora.types';

// custom items
import { DecimalValueObject } from './decimal.value-object';

class MockDecimalValueObject extends DecimalValueObject
{
    public readonly type: 'MockDecimalValueObject';

    constructor(value: number, validationRules: ValidationRules = {})
    {
        super(value, validationRules);
    }
}

describe('NumberValueObject', () =>
{
    describe('main', () =>
    {
        test('MockDecimalValueObject should be defined with 10.1 value', () =>
        {
            const mockDecimalValueObject = new MockDecimalValueObject(10.1, {
                name    : 'MockDecimalValueObject',
                decimals: [11,2],
            });
            expect(mockDecimalValueObject.value).toBe(10.1);
        });

        test('MockDecimalValueObject should be defined with -100.23 value', () =>
        {
            const mockDecimalValueObject = new MockDecimalValueObject(-100.23, {
                name    : 'MockDecimalValueObject',
                decimals: [5,2],
            });
            expect(mockDecimalValueObject.value).toBe(-100.23);
        });

        test('MockDecimalValueObject should be defined with toString method, 10.2 value', () =>
        {
            const mockDecimalValueObject = new MockDecimalValueObject(10.2, {
                name    : 'MockDecimalValueObject',
                decimals: [11,2],
            });
            expect(mockDecimalValueObject.toString()).toBe('10.2');
        });

        test('MockDecimalValueObject should catch error: must be defined, BadRequestException: can not be null', () =>
        {
            expect(() =>
                new MockDecimalValueObject(null, {
                    name    : 'MockDecimalValueObject',
                    nullable: false,
                    decimals: [11,2],
                }),
            ).toThrowError('Value for MockDecimalValueObject must be defined, can not be null');
        });

        test('MockDecimalValueObject should catch error: must be defined, BadRequestException: can not be undefined', () =>
        {
            expect(() =>
                new MockDecimalValueObject(undefined, {
                    name       : 'MockDecimalValueObject',
                    undefinable: false,
                    decimals   : [11,2],
                }),
            ).toThrowError('Value for MockDecimalValueObject must be defined, can not be undefined');
        });

        test('MockDecimalValueObject should catch error: must be defined, BadRequestException: can not be empty value', () =>
        {
            expect(() =>
                new MockDecimalValueObject(<number><unknown>'', {
                    name    : 'MockDecimalValueObject',
                    nullable: false,
                    decimals: [11,2],
                }),
            ).toThrowError('Value for MockDecimalValueObject must be defined, can not be null');
        });

        test('MockDecimalValueObject should catch error: must be defined, BadRequestException: integers too large', () =>
        {
            expect(() =>
                new MockDecimalValueObject(2567.22, {
                    name    : 'MockDecimalValueObject',
                    decimals: [5,2],
                }),
            ).toThrowError('Value for MockDecimalValueObject is too large, has a maximum length of 3 integers in 2567.22 number');
        });

        test('MockDecimalValueObject should catch error: must be defined, BadRequestException: decimals too large', () =>
        {
            expect(() =>
                new MockDecimalValueObject(256.223, {
                    name    : 'MockDecimalValueObject',
                    decimals: [5,2],
                }),
            ).toThrowError('Value for MockDecimalValueObject is too large, has a maximum length of 2 decimals in 256.223 number');
        });
    });
});