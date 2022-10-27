import { ValidationRules } from './../aurora.types';

// custom items
import { IntValueObject } from './int.value-object';

class MockIntValueObject extends IntValueObject
{
    public readonly type: string = 'MockIntValueObject';

    constructor(value: number | null | undefined, validationRules: ValidationRules = {})
    {
        super(value, validationRules);
    }
}

describe('IntValueObject', () =>
{
    describe('main', () =>
    {
        test('MockIntValueObject should be defined with 10 value', () =>
        {
            const mockNumberValueObject = new MockIntValueObject(10, {
                name: 'MockIntValueObject',
            });
            expect(mockNumberValueObject.value).toBe(10);
        });

        test('MockIntValueObject should be defined with toString method, 10 value', () =>
        {
            const mockNumberValueObject = new MockIntValueObject(10, {
                name: 'MockIntValueObject',
            });
            expect(mockNumberValueObject.toString()).toBe('10');
        });

        test('MockIntValueObject should catch error: must be defined, BadRequestException: can not be null', () =>
        {
            expect(() =>
                new MockIntValueObject(null, {
                    name    : 'MockIntValueObject',
                    nullable: false,
                }),
            ).toThrowError('Value for MockIntValueObject must be defined, can not be null');
        });

        test('MockIntValueObject should catch error: must be defined, BadRequestException: can not be undefined', () =>
        {
            expect(() =>
                new MockIntValueObject(undefined, {
                    name       : 'MockIntValueObject',
                    undefinable: false,
                }),
            ).toThrowError('Value for MockIntValueObject must be defined, can not be undefined');
        });

        test('MockIntValueObject should catch error: must be defined, BadRequestException: can not be empty value', () =>
        {
            expect(() =>
                new MockIntValueObject(<number><unknown>'', {
                    name    : 'MockIntValueObject',
                    nullable: true,
                }),
            ).toThrowError('Value for MockIntValueObject has to be a integer value');
        });

        test('MockIntValueObject should catch error: must be defined, BadRequestException: has a maximum length', () =>
        {
            expect(() =>
                new MockIntValueObject(123456, {
                    name     : 'MockIntValueObject',
                    maxLength: 5,
                }),
            ).toThrowError('Value for MockIntValueObject is too large, has a maximum length of 5');
        });

        test('MockIntValueObject should catch error: must be defined, BadRequestException: must have a positive sign', () =>
        {
            expect(() =>
                new MockIntValueObject(-1, {
                    name    : 'MockIntValueObject',
                    unsigned: true,
                }),
            ).toThrowError('The numerical value for MockIntValueObject must have a positive sign, this field does not accept negative values');
        });
    });
});