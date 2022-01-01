import { ValidationRules } from './../aurora.types';

// custom items
import { StringValueObject } from './string.value-object';

class MockStringValueObject extends StringValueObject
{
    public readonly type: 'MockStringValueObject';

    constructor(value: string, validationRules: ValidationRules = {})
    {
        super(value, validationRules);
    }
}

describe('StringValueObject', () =>
{
    describe('main', () =>
    {
        test('MockStringValueObject should be defined with Hello World value', () =>
        {
            const mockStringValueObject = new MockStringValueObject('Hello World', {
                name: 'MockStringValueObject'
            });
            expect(mockStringValueObject.value).toBe('Hello World');
        });

        test('MockStringValueObject should be defined with toString method, Hello World value', () =>
        {
            const mockStringValueObject = new MockStringValueObject('Hello World', {
                name: 'MockStringValueObject'
            });
            expect(mockStringValueObject.toString()).toBe('Hello World');
        });

        test('MockStringValueObject should be null with empty value', () =>
        {
            const mockStringValueObject = new MockStringValueObject('', {
                name: 'MockStringValueObject'
            });
            expect(mockStringValueObject.value).toBe(null);
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: can not be null, when value is empty and nullable validation rule to false', () =>
        {
            expect(() =>
                new MockStringValueObject('', {
                    name    : 'MockStringValueObject',
                    nullable: false
                })
            ).toThrowError('Value for MockStringValueObject must be defined, can not be null');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: can not be null', () =>
        {
            expect(() =>
                new MockStringValueObject(null, {
                    name    : 'MockStringValueObject',
                    nullable: false
                })
            ).toThrowError('Value for MockStringValueObject must be defined, can not be null');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: can not be undefined', () =>
        {
            expect(() =>
                new MockStringValueObject(undefined, {
                    name       : 'MockStringValueObject',
                    undefinable: false
                })
            ).toThrowError('Value for MockStringValueObject must be defined, can not be undefined');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: has a minimum length', () =>
        {
            expect(() =>
                new MockStringValueObject('1234', {
                    name     : 'MockStringValueObject',
                    minLength: 5
                })
            ).toThrowError('Value for MockStringValueObject is too short, has a minimum length of 5');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: has a maximum length', () =>
        {
            expect(() =>
                new MockStringValueObject('123456', {
                    name     : 'MockStringValueObject',
                    maxLength: 5
                })
            ).toThrowError('Value for MockStringValueObject is too large, has a maximum length of 5');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: has a length, pass more characters', () =>
        {
            expect(() =>
                new MockStringValueObject('123456', {
                    name  : 'MockStringValueObject',
                    length: 5
                })
            ).toThrowError('Value for MockStringValueObject is not allowed, must be a length of 5');
        });

        test('MockStringValueObject should catch error: must be defined, BadRequestException: has a length, pass less characters', () =>
        {
            expect(() =>
                new MockStringValueObject('1234', {
                    name  : 'MockStringValueObject',
                    length: 5
                })
            ).toThrowError('Value for MockStringValueObject is not allowed, must be a length of 5');
        });
    });
});