import { Op } from 'sequelize';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as dayjs from 'dayjs';
dayjs.extend(utc);
dayjs.extend(timezone);

import { ICriteria } from '../../../domain/persistence/criteria';
import { QueryStatement } from '../../../domain/persistence/sql-statement/sql-statement';
import { CQMetadata } from '../../../domain/aurora.types';
import { Utils } from '../../../domain/shared/utils';
import { Operator } from '../../../domain/persistence/sql-statement/operator';
import { merge, isEmpty } from 'lodash';
import { setSequelizeFunctions } from './functions/set-sequelize-functions.function';

export class SequelizeCriteria implements ICriteria
{
    implements(
        queryStatement?: QueryStatement,
        cQMetadata?: CQMetadata,
    ): QueryStatement
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

        // get all keys from Operator enum
        const availableOperators = [];
        for (const operator in Operator)
        {
            if (!isNaN(Number(operator))) break;
            availableOperators.push(operator);
        }

        // replace key string by sequelize symbols
        queryStatement = Utils.deepMapKeysOperators(
            queryStatement,
            key => key.startsWith('[') &&
            key.endsWith(']') &&
            availableOperators.includes(key.slice(1,-1))
                ? Op[key.slice(1,-1)]
                : key,
        );

        // set sequelize functions to query statement
        queryStatement = setSequelizeFunctions(queryStatement);

        return queryStatement;
    }

    mergeQueryConstraintStatement(
        queryStatement: QueryStatement,
        constraint: QueryStatement,
    ): QueryStatement
    {
        // merge query and constraint, merge on variables references, clone objects to a
        const finalQueryStatement = merge({}, queryStatement, constraint);

        // only overwrite where statement if both query and constraint have where
        if (!isEmpty(queryStatement.where) && !isEmpty(constraint.where))
        {
            finalQueryStatement.where = {
                [Operator.and]: [queryStatement.where, constraint.where],
            };
        }

        return finalQueryStatement;
    }
}