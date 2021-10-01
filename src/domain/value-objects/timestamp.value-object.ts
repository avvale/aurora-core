import { BadRequestException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';
import { Utils } from '../lib/utils';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export abstract class TimestampValueObject extends StringValueObject
{
    set value(value: string)
    {
        // if value is undefined, generate current timestamp
        if ((value === undefined || value === null) && this.data.currentTimestamp) value = Utils.nowTimestamp();

        // first pass value to super to pass validations
        super.value = value;

        // avoid manage null and undefined values, return a invalid date string
        if (value === null || value === undefined) return;

        if (value !== null && value !== undefined && !((new Date(value)).getTime() > 0)) throw new BadRequestException(`Value for ${this.validationRules.name} has to be a timestamp value, value ${value} is a not valid timestamp, format YYYY-MM-DD HH:mm:ss expected`);

        if (this.data.addTimezone)
        {
            // create data with application timezone and transform to request timezone to be returned to client
            super.value = dayjs.tz(value, process.env.TZ).tz(this.data.addTimezone).format('YYYY-MM-DD HH:mm:ss');
        }
        else if (this.data.removeTimezone)
        {
            // create date with request timezone and transform to application timezone to be saved in database
            super.value = dayjs.tz(value, this.data.removeTimezone).tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
        }
        else
        {
            // crate value according to default timezone application
            super.value = dayjs(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        }
    }

    get value(): string
    {
        return super.value;
    }
}