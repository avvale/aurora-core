import { Op } from 'sequelize';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

import { ICriteria } from '../../../domain/persistence/criteria';
import { QueryStatement } from '../../../domain/persistence/sql-statement/sql-statement';
import { CQMetadata } from '../../../domain/aurora.types';
import { Utils } from '../../../domain/lib/utils';

export class SequelizeCriteria implements ICriteria
{
    implements(queryStatement?: QueryStatement, cQMetadata?: CQMetadata): QueryStatement
    {
        // add timezone to query statement
        if (cQMetadata?.timezone)
        {
            queryStatement = Utils.deepMapValues(queryStatement, (value, key) =>
            {
                if (typeof value === 'string')
                {
                    const isDate = value.match(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/);
                    return isDate ? dayjs.tz(value, cQMetadata.timezone).tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss') : value;
                }
                return value;
            });
        }

        // replace key string by sequelize symbols
        return Utils.deepMapKeys(queryStatement, key => key.startsWith('[') && key.endsWith(']') ? Op[key.slice(1,-1)] : key);
    }
}