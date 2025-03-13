import { BadRequestException } from '@nestjs/common';
import { IValueObject } from './value-object.interface';
import { DataValueObject, ValidationRules } from './../aurora.types';

export abstract class ValueObject<T> implements IValueObject<T>
{
    public readonly type: string;
    public validationRules: ValidationRules = {};
    public data: DataValueObject = {};

    protected _value: T;
    set value(value: T)
    {
        // validate nullable values
        if (this.validationRules.nullable === false && value === null && !this.validationRules.default)
        {
            throw new BadRequestException(`Value for ${this.validationRules.name} must be defined, can not be null`);
        }

        // validate undefinable values
        if (this.validationRules.undefinable === false && value === undefined && !this.validationRules.default)
        {
            throw new BadRequestException(`Value for ${this.validationRules.name} must be defined, can not be undefined`);
        }

        if (
            ((this.validationRules.nullable === false && value === null) ||
            (this.validationRules.undefinable === false && value === undefined))
            && this.validationRules.default
        )  this._value = this.validationRules.default;
        else
        {
            this._value = value;
        }
    }

    get value(): T
    {
        return this._value;
    }

    constructor(dataValue: T | DataValueObject | undefined, validationRules: ValidationRules = {}, data: DataValueObject | T = {})
    {
        // set default value
        let value = undefined;

        // check if dataValue has any property of DataValueObject,
        // to assign value to value or data variable
        if (
            dataValue &&
            typeof dataValue === 'object' &&
            (
                'haveToEncrypt'    in dataValue ||
                'currentTimestamp' in dataValue ||
                'timezone'         in dataValue
            )
        )
        {
            data = dataValue;
        }
        else
        {
            value = dataValue;
        }

        // merge additional data for customize behavior value object
        this.data = Object.assign({}, this.data, data);

        // first get validationRules value to be used in value accessors methods
        this.validationRules = validationRules;

        // second call to accessor value method
        // Attention!! this call has to be the last, is the bootstrap for run validations in nested classes
        this.value = value;
    }
}