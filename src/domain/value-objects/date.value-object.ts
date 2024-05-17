import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';
import { Utils } from '../shared/utils';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export abstract class DateValueObject extends StringValueObject
{
    set value(value: string)
    {
        // if value is undefined, generate current date
        if ((value === undefined || value === null) && this.data.currentDate) value = Utils.nowDate();

        // first pass value to super to pass validations
        super.value = value;

        // avoid manage null and undefined values, return a invalid date string
        if (value === null || value === undefined) return;

        if (value !== null && value !== undefined && isNaN((new Date(value)).getTime()))
        {
            throw new BadRequestException(`Value for ${this.validationRules.name} has to be a date value, value ${value} is a not valid date, format YYYY-MM-DD expected`);
        }

        if (this.data.addTimezone)
        {
            // create data with application timezone and transform to request timezone to be returned to client
            super.value = dayjs.tz(value, process.env.TZ).tz(this.data.addTimezone).format('YYYY-MM-DD');
        }
        else if (this.data.removeTimezone)
        {
            // create date with request timezone and transform to application timezone to be saved in database
            super.value = dayjs.tz(value, this.data.removeTimezone).tz(process.env.TZ).format('YYYY-MM-DD');
        }
        else
        {
            // crate value according to default timezone application
            super.value = dayjs(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
    }

    get value(): string
    {
        return super.value;
    }
}